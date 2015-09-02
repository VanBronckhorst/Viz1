function ageHistogram(where, stateToDisplay,parent){
	var that = this
	this.svgH = 500
	this.svgW = 500
	this.svgXPad = 100
	this.svgYPad = 100
	this.buckets = false
	this.compare = true
	this.percentage= false
	this.parent = parent
	this.barColor = "#FF9900"
	this.ageThreshold = 21;
	this.bSize = 10
	this.state=stateToDisplay;
	
	this.canvas = d3.select(where).append("svg").attr("height","100%").attr("width","100%").attr("viewBox","0 0 "+(this.svgH+this.svgYPad)+ " " + (this.svgW+this.svgXPad));
	this.state = stateToDisplay;
	
	this.makeData= function(){
		for(var i=0;i<popAgeSex["states"].length;i++){
				if (popAgeSex["states"][i]["name"] == this.state){
					this.d = popAgeSex["states"][i]["buckets"];
				}
			}
			
			
			this.max = 0
			this.min = Infinity
			var buck = 0
			
			
			
			this.usedData = []
			
			if (this.d != NaN){
				//var maxY = Object.keys(this.d).length-1
				if (this.buckets == false){
					
					for(var i=0;i < this.d.length;i++){
						if (this.percentage){
							buck = parseFloat(this.d[i]["perc"])
						}else{
							buck = parseInt(this.d[i]["m"]) + parseInt(this.d[i]["f"])
						}
						
						this.usedData.push({start: this.d[i]["start"] , value: buck,span: this.d[i]["span"]})
						if (buck>this.max){
							this.max=buck;
						}
						if (buck<this.min){
							this.min=buck;
						}
					}
				}else{
					var tempBuckets = [];
					var bucketMax = [];
					for (var i=0;i<150/this.bSize;i++){
						tempBuckets[i]=0
						bucketMax[i]=0
					}
					
					for(var i=0;i < this.d.length;i++){
						if (this.percentage){
							buck = parseFloat(this.d[i]["perc"])
						}else{
							buck = parseInt(this.d[i]["m"]) + parseInt(this.d[i]["f"])
						}
					    if (this.d[i]["span"]==1){
						    var bucketNumber = Math.floor(this.d[i]["start"]/this.bSize)
						    tempBuckets[bucketNumber] += buck
						    if (this.d[i]["start"] > bucketMax[bucketNumber]){
							    bucketMax[bucketNumber]=this.d[i]["start"]
						    }
					    }else{
						    if (buck>this.max){
								this.max=buck;
							}
							if (buck<this.min){
								this.min=buck;
							}
						    this.usedData.push({start: this.d[i]["start"] , value: buck,span: this.d[i]["span"]})
					    }
					}
					
					for (var i=0;i<tempBuckets.length;i++){
						if (tempBuckets[i]>0){
							if (tempBuckets[i]>this.max){
								this.max=tempBuckets[i];
							}
							if (tempBuckets[i]<this.min){
								this.min=tempBuckets[i];
							}
							
							this.usedData.push({start: i*this.bSize, value: tempBuckets[i],span: (bucketMax[i]-i*this.bSize+1)})
						}
					}

					
				}
			}
			
			
			
	}
	
	this.makeScale = function (){
		
			var off = (this.max - this.min)/ 10
			if (this.parent.isCompare()==false){
					this.wScale = d3.scale.linear().
							range([0,this.svgW]).
							domain([Math.max(this.min-off,0),this.max+off])
					}else{
						this.wScale = this.parent.getScale(this.svgW)
					}
			this.maxI = 0	
			for (var i in this.usedData){
				if (this.usedData[i].start+this.usedData[i].span>this.maxI){
					this.maxI = this.usedData[i].start+this.usedData[i].span
				}
			}
			
					
			this.hScale = d3.scale.linear().
					range([0,this.svgH]).
					domain([0,this.maxI])
	}
	
	this.refreshGraph = function(){
			//this.canvas.selectAll("*").remove()
			this.makeData()
			this.makeScale()
			
			
			var h = this.svgW/this.maxI;
			
			
			var xAxis = d3.svg.axis().scale(this.wScale);
			var yAxis = d3.svg.axis().scale(this.hScale).orient("left");
			
			this.canvas.append("g").call(xAxis)
				.attr("class","x axis")
				.attr("transform", "translate("+ this.svgXPad/2+"," + (this.svgH+(this.svgYPad/2)) + ")");
				
			//var svgRatio =  this.svgH / this.canvas.node().getBoundingClientRect()["height"]  * 100
			
			this.canvas.append("g").call(yAxis)
					.attr("class","y axis")
					.attr("font-size" , 150 + "%")
					.attr("transform", "translate("+ this.svgXPad/2+ ", " +(+(this.svgYPad/2))+ " )");
					
			//for(i=0;i< this.usedData.length;i++){
				/*Vertical
					
				this.canvas
				.datum(parseInt(this.d[i.toString()]["m"]) + parseInt(this.d[i.toString()]["f"]))
				.append("rect").attr("x",i*w).attr("width",w).attr("fill",femaleColor)
				.attr("stroke","#000000")
							.attr("y",function(d){
								return 1000 - d/100000*1000;
							})
							.attr("height", function(d){ 
								return d/100000*1000;});
				
				
				this.canvas.datum(this.d[i.toString()]["m"]).append("rect").attr("x",i*w)
							.attr("width",w).attr("fill",maleColor)
							.attr("stroke","#000000")
							.attr("y",function(d){
								return 1000 - d/100000*1000;
							})
							.attr("height", function(d){ 
								return d/100000*1000;});
			    */	
			    this.canvas.selectAll(".pop-rect")
				.data(this.usedData).enter()
				.append("rect").attr("class","pop-rect").attr("x",this.svgXPad/2).attr("fill",this.barColor)
				.attr("stroke","#000000")
							.attr("y", function(d,i){
								return (d.start*h+(that.svgYPad/2));
							})
							.attr("height",function(d){return d.span*h})
							.attr("width",function(d){
								return that.wScale(d.value);
							})
				
				/*
				this.canvas.datum(this.d[i.toString()]["m"])
				.append("rect").attr("x",0).attr("fill",maleColor)
				.attr("stroke","#000000")
							.attr("y", h*i)
							.attr("height",h)
							.attr("width",function(d){
								return w(d);
							});	*/
				
			//}
			
	}
	
	this.updateGraph = function(){
		
		this.makeData();
		this.makeScale()
		var xAxis = d3.svg.axis().scale(this.wScale);
		var yAxis = d3.svg.axis().scale(this.hScale).orient("left");
		this.canvas.selectAll("g.x.axis").call(xAxis)
		this.canvas.selectAll("g.y.axis").call(yAxis)
		
		
		var h = this.svgW/this.maxI;
		
		this.canvas.selectAll(".pop-rect")
				.data(this.usedData)
				.transition()
				.duration(500)
				.attr("x",this.svgXPad/2).attr("fill",this.barColor)
				.attr("stroke","#000000")
							.attr("y", function(d,i){
								return d.start*h+(that.svgYPad/2);
							})
							.attr("height",function(d){return d.span*h})
							.attr("width",function(d){
								return that.wScale(d.value);
							})
		this.canvas.selectAll(".pop-rect")
				.data(this.usedData)
				.exit()
				.transition()
				.duration(500)
				.style("opacity",0)
				.attr("y",this.svgH+50)
				.attr("width",0)
				.each("end",function(){this.remove()});
				
		this.canvas.selectAll(".pop-rect")
				.data(this.usedData)
				.enter()
				.append("rect")
				.attr("class","pop-rect")
				.attr("fill",this.barColor)
				.attr("y",this.svgH)
				.attr("x",this.svgXPad/2)
				.attr("height",function(d){return d.span*h})
				.transition()
				.duration(500)
				.attr("stroke","#000000")
							.attr("y", function(d,i){
								return d.start*h+(that.svgYPad/2);
							})
							
							.attr("width",function(d){
								return that.wScale(d.value);
							})
	}
	
	this.makeHighlightData= function(){
		for(var i=0;i<popAgeSex["states"].length;i++){
				if (popAgeSex["states"][i]["name"] == this.state){
					this.d = popAgeSex["states"][i]["buckets"];
				}
			}
			
			
			
			
			this.usedHighlightData = []
			
			var buck=0
			if (this.d != NaN){
				//var maxY = Object.keys(this.d).length-1
				if (this.buckets == false){
					for(var i=this.ageThreshold;i<this.d.length;i++){
						if (this.percentage){
							buck = parseFloat(this.d[i]["perc"])
						}else{
							buck = parseInt(this.d[i]["m"]) + parseInt(this.d[i]["f"])
						}
						if (buck>0){
							this.usedHighlightData.push({start: this.d[i]["start"] , value: buck,span: this.d[i]["span"]})
						}
					}
				}else{
					var tempBuckets = [];
					var bucketMax = [];
					
					for (var i=0;i<150/this.bSize;i++){
						tempBuckets[i]=0
						bucketMax[i]=0
					}
					
					
					for(var i=0;i < this.d.length;i++){
						if (this.percentage){
							buck = parseFloat(this.d[i]["perc"])
						}else{
							buck = parseInt(this.d[i]["m"]) + parseInt(this.d[i]["f"])
						}
					    if (this.d[i]["span"]==1){
						    var bucketNumber=Math.floor(this.d[i]["start"]/this.bSize)
						    tempBuckets[bucketNumber] += buck
						    if (this.d[i]["start"] > bucketMax[bucketNumber]){
							    bucketMax[bucketNumber]=this.d[i]["start"]
						    }
					    }else{
						    if (this.d[i]["start"] >= this.ageThreshold){
						   		 this.usedHighlightData.push({start: this.d[i]["start"] , value: buck,span: this.d[i]["span"]})
						    }
					    }
					}
					
					for (var i=0;i<tempBuckets.length;i++){
						if (tempBuckets[i]>0){
							if (i*this.bSize >= this.ageThreshold){
								this.usedHighlightData.push({start: i*this.bSize, value: tempBuckets[i],span: 1+ bucketMax[i]-i*this.bSize})
							}
						}
					}
					
				}
			}
			
			
			
	}
	

	
	this.highlightData = function(){
	
		
		this.makeHighlightData();
		
		var h = this.svgW/this.maxI;
		this.canvas.selectAll(".highlight-rect").remove()
		
		this.canvas.selectAll(".highlight-rect")
				.data(this.usedHighlightData)
				.transition()
				.duration(500)
							.attr("fill","green")
							.attr("y", function(d,i){
								console.log(d.key*h+(that.svgYPad/2))
								return d.start*h+(that.svgYPad/2);
							})
							.attr("height",function(d){return d.span*h})
							.attr("width",function(d){
								return that.wScale(d.value);
							})
		this.canvas.selectAll(".highlight-rect")
				.data(this.usedHighlightData)
				.exit()
				.transition()
				.duration(500)
				.style("opacity",0)
				.attr("width",0)
				.attr("y",this.svgH+50)
				.each("end",function(){this.remove()});
				
		this.canvas.selectAll(".highlight-rect")
				.data(this.usedHighlightData)
				.enter()
				.append("rect")
				.attr("class","highlight-rect")
				.attr("fill","yellow")
				.attr("y", function(d,i){
								return d.start*h+(that.svgYPad/2);
							})
				.attr("x",this.svgXPad/2)
				.attr("height",function(d){return d.span*h})
				.attr("width",0)
				.transition()
				.duration(500)
				.attr("stroke","#000000")
							.attr("width",function(d){
								return that.wScale(d.value);
							})
	
	}
	
	this.changeState = function(name){
		
		this.state = name;
		this.refreshGraph();
	}
	
	//this.makeData()
	
	this.removeGraph = function(){
		this.canvas.transition().duration(500).style("opacity",0).each("end",function(){d3.select(this).remove()});
	}
	
	
}