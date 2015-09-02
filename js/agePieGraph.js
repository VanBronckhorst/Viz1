function agePieGraph(where, stateToDisplay){
	this.svgH = 1000
	this.svgW = 1000
	this.svgXPad = 100
	this.svgYPad = 100
	this.buckets = false;
	this.compare = false;
	this.percentage= true;
	this.ageThreshold = 21;
	this.state=stateToDisplay
	
	var that = this;
	this.canvas = d3.select(where).append("svg").attr("height","100%").attr("width","100%").attr("viewBox","0 0 "+(this.svgH+this.svgYPad)+ " " + (this.svgW+this.svgXPad));
	this.state = stateToDisplay;
	this.refreshGraph = function(){
			var radius = Math.min(this.svgH, this.svgW) / 2;
			var inRadius = 250;
			
			this.canvas.selectAll("*").remove()
			
			
			for(i=0;i<popAgeSex["states"].length;i++){
				if (popAgeSex["states"][i]["name"] == this.state){
					this.d = popAgeSex["states"][i];
				}
			}
			
			

			var arc = d3.svg.arc()
			                .innerRadius(inRadius)
			                .outerRadius(radius);
			var inArc = d3.svg.arc()
			                .innerRadius(0)
			                .outerRadius(inRadius);
			
			this.usedData = []
			var buck = 0
			var no=0;
			var yes=0;
			
			if (this.d != NaN){
				var maxY = Object.keys(this.d).length-1
				if (this.buckets == false){
					for(i=0;i<maxY;i++){
						
						if (this.percentage){
							buck = parseFloat(this.d[i.toString()]["perc"])
						}else{
							buck = parseInt(this.d[i.toString()]["m"]) + parseInt(this.d[i.toString()]["f"])
						}
						this.usedData.push({key: i , value:buck})
						
						if (i<this.ageThreshold){
							no+=buck
						}else{
							yes+=buck
						}

						}
				}else{
					for(i=0;i<maxY/10;i++){
						buck = 0
						for(j=0;j<=9;j++){
							if (i*10+j<maxY){
								if (this.percentage){
									var add= parseFloat(this.d[(i*10+j).toString()]["perc"])
									buck += add
									if ((i*10+j)<this.ageThreshold){
										no+= add
									}else{
										yes+=add
									}
								}else{
									var add = parseInt(this.d[(i*10+j).toString()]["m"]) + parseInt(this.d[(i*10+j).toString()]["f"])
									buck += add 
									if ((i*10+j)<this.ageThreshold){
										no+= add
									}else{
										yes+=add
										}
									}
								}
							}
						this.usedData.push({key: i*10+" - "+((i+1)*10-1), value: (buck) })
						
					}
					
				}
			}
			this.highData = []
			this.highData.push(no);
			this.highData.push(yes);
			
			
			var pie = d3.layout.pie().value(function(d) { return d.value; }).sort(null)
			this.pieData = pie(this.usedData)	
			var highPie = d3.layout.pie().value(function(d) { return d }).sort(null)
			this.pieHighData = highPie(this.highData)
			// OUTER PIE		
			var arcs = this.canvas.selectAll("g.arc")
							.data(this.pieData)
					        .enter()
					        .append("g")
					        .attr("class", "arc")
					        .attr("transform", "translate(" + (radius + this.svgXPad/2) + ", " + (radius+ this.svgYPad/2) + ")");
								
								
			var color = d3.scale.linear().domain([0,this.pieData.length/2,this.pieData.length]).range(["green","orange","red"]);
			
			arcs.append("path")
			.attr("stroke","white")
			.attr("stroke-width",3)
		    .attr("fill", function(d, i) {
		        return color(i);
		    })
		    .attr("d", arc);		
			
			
			
			arcs.append("text")
		    .attr("transform", function(d) {
		        return "translate(" + arc.centroid(d) + ")";
		    })
		    .attr("text-anchor", "middle")
		    .attr("font-size","250%")
		    .text(function(d,i) {
		        return i%3==0?that.usedData[i].key:"";
		    });
		    
		    // INNER PIE
			
			
			
			var arcs = this.canvas.selectAll("g.inner-arc")
							.data(this.pieHighData)
					        .enter()
					        .append("g")
					        .attr("class", "inner-arc")
					        .attr("transform", "translate(" + (radius + this.svgXPad/2) + ", " + (radius+ this.svgYPad/2) + ")");
								
								
			
			
			arcs.append("path")
		    .attr("fill", function(d, i) {
		        return i==1?"yellow":"gray";
		    })
		    .attr("d", inArc);		
		    
		    arcs.append("text")
		    .attr("transform", function(d) {
		        return "translate(" + inArc.centroid(d) + ")";
		    })
		    .attr("text-anchor", "middle")
		    .attr("font-size","250%")
		    .text(function(d,i) {
			    
		        return (that.highData[i]/(that.highData[0]+that.highData[1])*100).toFixed(2)+"%";
		    });
		    
		    
					
	}
	
	this.changeState = function(name){
		this.state = name;
		this.refreshGraph();
	}
	
	//this.refreshGraph()
	this.removeGraph = function(){
		this.canvas.transition().duration(500).style("opacity",0).each("end",function(){d3.select(this).remove()});
	}
	
	
}