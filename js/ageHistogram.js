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
	this.state=stateToDisplay;
	
	this.canvas = d3.select(where).append("svg").attr("height","100%").attr("width","100%").attr("viewBox","0 0 "+(this.svgH+this.svgYPad)+ " " + (this.svgW+this.svgXPad));
	this.state = stateToDisplay;
	
	this.makeData= function(){
		for(var i=0;i<popAgeSex["states"].length;i++){
				if (popAgeSex["states"][i]["name"] == this.state){
					this.d = popAgeSex["states"][i];
				}
			}
			
			
			this.max = 0
			this.min = Infinity
			var buck = 0
			
			this.usedData = []
			
			if (this.d != NaN){
				var maxY = Object.keys(this.d).length-1
				if (this.buckets == false){
					
					for(var i=0;i < maxY;i++){
						if (this.percentage){
							console.log(i);
							buck = parseFloat(this.d[i.toString()]["perc"])
						}else{
							buck = parseInt(this.d[i.toString()]["m"]) + parseInt(this.d[i.toString()]["f"])
						}
						
						this.usedData.push({key: i , value: buck})
						if (buck>this.max){
							this.max=buck;
						}
						if (buck<this.min){
							this.min=buck;
						}
					}
				}else{
					for(var i=0;i< maxY / 10;i++){
						buck = 0
						for(j=0;j<=9;j++){
							if ((i*10+j)< maxY){
								if (this.percentage){
									buck += parseFloat(this.d[(i*10+j).toString()]["perc"])
								}else{
									buck += parseInt(this.d[(i*10+j).toString()]["m"]) + parseInt(this.d[(i*10+j).toString()]["f"])
								}
							}
						}
						this.usedData.push({key: i*10+" - "+((i+1)*10-1), value: (buck) })
						if (buck>this.max){
							this.max=buck;
						}
						if (buck<this.min){
							this.min=buck;
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
					
			this.hScale = d3.scale.linear().
					range([0,this.svgH]).
					domain([0,this.usedData.length])
	}
	
	this.refreshGraph = function(){
			//this.canvas.selectAll("*").remove()
			this.makeData()
			this.makeScale()
			
			
			var h = this.svgW/this.usedData.length;
			
			
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
								return (i*h+(that.svgYPad/2));
							})
							.attr("height",h)
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
		
		
		var h = this.svgW/this.usedData.length;
		
		this.canvas.selectAll(".pop-rect")
				.data(this.usedData)
				.transition()
				.duration(500)
				.attr("x",this.svgXPad/2).attr("fill",this.barColor)
				.attr("stroke","#000000")
							.attr("y", function(d,i){
								return i*h+(that.svgYPad/2);
							})
							.attr("height",h)
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
				.attr("height",h)
				.transition()
				.duration(500)
				.attr("stroke","#000000")
							.attr("y", function(d,i){
								return i*h+(that.svgYPad/2);
							})
							
							.attr("width",function(d){
								return that.wScale(d.value);
							})
	}
	
	this.makeHighlightData= function(){
		for(var i=0;i<popAgeSex["states"].length;i++){
				if (popAgeSex["states"][i]["name"] == this.state){
					this.d = popAgeSex["states"][i];
				}
			}
			
			
			
			
			this.usedHighlightData = []
			
			var buck=0
			if (this.d != NaN){
				var maxY = Object.keys(this.d).length-1
				if (this.buckets == false){
					for(var i=this.ageThreshold;i<maxY;i++){
						if (this.percentage){
							buck = parseFloat(this.d[i.toString()]["perc"])
						}else{
							buck = parseInt(this.d[i.toString()]["m"]) + parseInt(this.d[i.toString()]["f"])
						}
						if (buck>0){
							this.usedHighlightData.push({key: i , value: buck})
						}
					}
				}else{
					for(var i=0;i<maxY/10;i++){
						buck = 0
						for(j=0;j<=9;j++){
							if ((i*10+j)<maxY){
								if (this.percentage){
									if ((i*10+j)>=this.ageThreshold){
										buck += parseFloat(this.d[(i*10+j).toString()]["perc"])
									}
								}else{
									if ((i*10+j)>=this.ageThreshold){
										buck += parseInt(this.d[(i*10+j).toString()]["m"]) + parseInt(this.d[(i*10+j).toString()]["f"])
									}
								}
							}
						}
						if (buck>0){
						this.usedHighlightData.push({key: i, value: (buck) })
						}
					}
					
				}
			}
			
			
			
	}
	

	
	this.highlightData = function(){
	
		
		this.makeHighlightData();
		
		var h = this.svgW/this.usedData.length;
		this.canvas.selectAll(".highlight-rect").remove()
		
		this.canvas.selectAll(".highlight-rect")
				.data(this.usedHighlightData)
				.transition()
				.duration(500)
							.attr("fill","green")
							.attr("y", function(d,i){
								console.log(d.key*h+(that.svgYPad/2))
								return d.key*h+(that.svgYPad/2);
							})
							.attr("height",h)
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
								return d.key*h+(that.svgYPad/2);
							})
				.attr("x",this.svgXPad/2)
				.attr("height",h)
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