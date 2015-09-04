
function svgMenu(where,data,whenSelected){
	var that=this
	this.svgW=100;
	this.svgH=20;
	this.hPad=3;
	this.textH=10
	this.data = data//[{name:"7/11",year:2001},{name:"End of WW2",year:1945},{name:"End of WW1",year:1918}];
	this.selected= this.data[0]
	
	this.svg= d3.select(where).append("svg").attr("id","menuSVG").style("z-index",999).attr("viewBox","0 0 "+this.svgW+" "+this.svgH).style("overflow","visible")
	
	this.selectG = this.svg.append("g")
	this.selectG.append("rect").attr("class","menuSelectedBox").attr("width",this.svgW+"").attr("height",this.svgH+"").attr("ry",3)
				.attr("rx",3).on("click",function(){that.show()})
	this.selText = this.selectG.append("text")
				.text(this.selected.name)
				.attr("font-size","10px")
				.attr("text-anchor","middle")
				.attr("dominant-baseline", "middle")
				.attr("y",this.svgH/2)
				.attr("x",this.svgW/2 )
				.on("click",function(){that.show()})
	
	
	this.calcRect = function(){var r = document.getElementById("menuSVG").getBoundingClientRect();
								that.menuList.style("left",r.left)
							    .style("width",r.width)
							    .style("height",h)
							    .style("top",r.top-h)
							    .style("z-index","100")
				     }
	
	window.onresize = this.calcRect	
		
	this.rect = document.getElementById("menuSVG").getBoundingClientRect();		
	var h = (this.textH+this.hPad)*this.data.length+30
	
	
	this.menuList = d3.select("body")
				    .append("svg")
				    .attr("viewBox","0 0 "+this.svgW+" "+this.svgH)
				    .style("visibility","hidden")
				    .style("position","absolute")
				    .style("left",this.rect.left)
				    .style("width",this.rect.width)
				    .style("height",h)
				    .style("top",this.rect.top-h)
				    .style("z-index","100")
				    
	
	
			    
	this.menuList.selectAll("text")
				    .data(this.data)
					.enter()
					.append("text")
					.attr("class","menuSvgListElem")
					.text(function(d){return d.name})
					
					.on("click",function(d){that.selectedEvent(d)})
					.attr("y",function(d,i){return i*(that.textH+that.hPad)})
					.style("opacity",1)
			
	
	this.show= function(){
			if(this.menuList.style("visibility")=="visible"){
				this.menuList.style("visibility","hidden")
			}else{
				this.menuList.style("visibility","visible")
				}
			
	}
	this.selectedEvent = function(ev){
		
		this.selected=ev
		this.selText.text(ev.name)
		this.show()
		whenSelected(ev)
	}
	
	//this.show()
	
}