function StatesList(){
	
	
	this.states = db.stateNames;
	this.n = this.states[3]
	
	this.display=function (whereToDisplay){
		
		this.gList = d3.select(whereToDisplay).append("svg").attr("height","100%").attr("width","100%").attr("viewBox","0 0 1000 1000").append("g").attr("visibility","visible")
		
		var size = {w : 800, marginRight : 100, h : 900};

		this.gList
			.append("rect")
			.attr("width",size.w)
			.attr("height",size.h)
			.attr("y",0)
			.attr("x",size.marginRight)
			.attr("rx",20)
			.attr("fill" , "#DDDDDD");

		var names = [];
		for(i = 0; i < this.states.length; i++) {
			names.push(this.states[i]); 
		}
		names.sort();

		for(n in names){
			var name = names[n];
			var column = Math.floor(n/26);
			var row = n%26;
			var cspan = Math.floor(size.w / (Math.ceil(names.length/26)))
			var rspan = Math.floor(size.h / 26)
			var sel = false
			if (name == "Alaska"){sel=true;}
			
		this.gList
				.datum(name)
				.append("text")
				.attr("dx",30)
				.attr("dy",30)
				.classed("selected",sel)
				.attr("x", size.marginRight + column*cspan)
				.attr("y", 0 + (rspan*row) )
				.text(name.slice(0,16))
				.classed("states-list-elem",true)
				.on("click",function(d){
					if (!(d3.select(this).classed("selected"))){
						stateComp.addState(d)
						d3.select(this).classed("selected",true);
					}else{
						stateComp.removeState(d)
						d3.select(this).classed("selected",false);	
					}
				});
				
		
		}
		
		
	};
};