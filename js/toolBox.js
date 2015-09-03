

function toolBox(where,parent){
	var that=this
	this.display = d3.select(where)
	this.div = this.display.append("div")
	
	this.buttons=[{s:"Show Single Years",f:"Show Buckets",a:parent.changeBuckets},{f:"Show Number",s:"Show Percentage",a:parent.changePercentage},{f:"Use Estimates",s:"Use Real Data",a:parent.changeEstimates}]
	
	for (i in this.buttons){
		this.div.append("button").attr("tag",i).text(this.buttons[i].f)
				.on("click",function(){
									butt = d3.select(this)
									var i = butt.attr("tag")
									if (butt.text()==that.buttons[i].f){
										butt.text(that.buttons[i].s)
									}else{
										butt.text(that.buttons[i].f)
									
									}
									that.buttons[i].a()
									
									
									 })
	}
	
	
	
}