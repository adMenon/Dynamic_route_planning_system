var express=require("express");
var app = express();
var bodyParser=require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var fs=require("fs");
var parse = require('xml-parser');
var xml = fs.readFileSync('file.txt', 'utf8');
var inspect = require('util').inspect;

app.set("view engine","ejs");

var server=app.listen(process.env.PORT||"8080",function(){

	console.log("server working");
});



app.get("/",function(req,res){
  
  var wget = require('node-wget');
  wget({url: "https://docs.google.com/uc?export=download&id=1LrEWPjeh9n57nSaBrQXkC_9bZcyIfQk2", dest: "file.txt"},function(){

  console.log("downloaded1");
  });

	console.log(req.body);
	res.render("printcoordinates");
 
});

app.get("/2",function(req,res){
  
  var wget = require('node-wget');
  wget({url: "https://docs.google.com/uc?export=download&id=11zXcy24AuyxoX3wvuApL8O-d9IkXPzrY", dest: "file2.txt"},function(error, response, body){

  //console.log(body);
  console.log("downloaded2");

  });

  console.log(req.body);
  res.render("printcoordinates");

});


var obj = parse(xml);
var l=obj.root.children[1].children[0].children.length
var lat= obj.root.children[1].children[0].children[l-1].attributes.lat
var lon=obj.root.children[1].children[0].children[l-1].attributes.lon

console.log("\n\nuser1\n\n")
var lat_arr=[],long_arr=[],time_arr=[];
for(i=0;i<l;i++)
{
 lat_arr.push(obj.root.children[1].children[0].children[i].attributes.lat);
 long_arr.push(obj.root.children[1].children[0].children[i].attributes.lon);
 var temp=obj.root.children[1].children[0].children[i].children[0].content;
 if(temp[temp.length-1]=="Z")
 {
    time_arr.push(temp);
    //console.log(temp);
 }
 else
 {

    temp=obj.root.children[1].children[0].children[i].children[1].content;
    time_arr.push(temp);
   // console.log(temp);
 }
// console.log(lat_arr[i]," ",long_arr[i]," ",time_arr[i]);
}




var pred_lat=[14.5,18.5,17.6];
var pred_long=[80.02,90.03,90.01];


for(i=0;i<pred_lat.length;i++)
{	
	var min=99999999;
	var minj=0;
	for(var j=0;j<lat_arr.length;j++)
	{
		var temp=Math.sqrt((pred_lat[i]-lat_arr[j])*(pred_lat[i]-lat_arr[j])+(pred_long[i]-long_arr[j])*(pred_long[i]-long_arr[j]));
		if(temp<min)
		{
			min=temp;
			minj=j;
		}
	}
	
}

var year1=[];
var month1=[];
var day1=[];
var hour1=[];
var minute1=[];
var seconds1=[];
for(i=0;i<l;i++)
{
	//console.log(time_arr[i]);
	year1.push(""+time_arr[i][0]+time_arr[i][1]+time_arr[i][2]+time_arr[i][3]);
	month1.push(""+time_arr[i][5]+time_arr[i][6]);
	day1.push(""+time_arr[i][8]+time_arr[i][9]);
	hour1.push(""+time_arr[i][11]+time_arr[i][12]);
	minute1.push(""+time_arr[i][14]+time_arr[i][15]);
	seconds1.push(""+time_arr[i][17]+time_arr[i][18]);
	//console.log(year[i],month[i],day[i]);
	console.log(year1[i],month1[i],day1[i],hour1[i],minute1[i],seconds1[i]);
}

var time_arr2=[];
var lat_arr2=[];
var long_arr2=[];
var csv = require('csv-parser')
var year2=[];
var month2=[];
var day2=[];
var hour2=[];
var minute2=[];
var seconds2=[];


fs.createReadStream('file3.csv')
  .pipe(csv())
  .on('data', function (data) {
   // console.log(data.lon);
    time_arr2.push(data.time);
    lat_arr2.push(data.lat);
    long_arr2.push(data.lon);
  })
  .on('end', function () {
  	for(i=0;i<time_arr2.length;i++)
 	{
 		year2.push(""+time_arr2[i][0]+time_arr2[i][1]+time_arr2[i][2]+time_arr2[i][3]);
		month2.push(""+time_arr2[i][5]+time_arr2[i][6]);
		day2.push(""+time_arr2[i][8]+time_arr2[i][9]);
		hour2.push(""+time_arr2[i][11]+time_arr2[i][12]);
		minute2.push(""+time_arr2[i][14]+time_arr2[i][15]);
		seconds2.push(""+time_arr2[i][17]+time_arr2[i][18]);
		//console.log(year[i],month[i],day[i]);
		console.log(year2[i],month2[i],day2[i],hour2[i],minute2[i],seconds2[i]);				
  	}
  });




  app.post("/location",urlencodedParser,function(req,res){
  	var lat=req.body.latitude;
  	var lon = req.body.longitude;
  	var time = req.body.time;
  	fs.appendfile("Time-Location.txt",lat+" "+lon+" "+time+"\n",function(err){
  		if(err)
  			throw err;
  		console.log(lat+lon+time+"----data updated");
  	});
  });

 /**/