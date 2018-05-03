var express=require("express");
var app = express();
var fs=require("fs");
var parse = require('xml-parser');
var xml = fs.readFileSync('file.txt', 'utf8');
var inspect = require('util').inspect;var http = require('http').Server(app);
var http = require('http').Server(app);
var io = require('socket.io')(http);

var bodyParser=require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });


app.set("view engine","ejs");

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}



http.listen(8080, function(){
  console.log('listening on *:3000');
});



app.use("/public",express.static("public"));


var obj = parse(xml);
var l=obj.root.children[1].children[0].children.length;
var lat= obj.root.children[1].children[0].children[l-1].attributes.lat;
var lon=obj.root.children[1].children[0].children[l-1].attributes.lon;

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
	//console.log(year1[i],month1[i],day1[i],hour1[i],minute1[i],seconds1[i]);
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
var distance=[];
var time_d=[];

var contents = fs.readFileSync("val.json");
var contents2 = fs.readFileSync("val2.json");
var route1 = JSON.parse(contents);
var route2 = JSON.parse(contents2);
var coord = [{'lat': 13.555216, 'lon': 80.027301},{'lat': 13.560786, 'lon': 80.026996},{'lat': 13.561295, 'lon': 80.023782},{'lat': 13.557910, 'lon': 80.018976}
,{'lat': 13.554012, 'lon': 80.013900},{'lat': 13.553478, 'lon': 80.011429},{'lat': 13.551799, 'lon': 80.007822},
{'lat': 13.551002, 'lon': 80.005999},{'lat': 13.549593, 'lon': 80.003663},{'lat': 13.548192, 'lon': 80.000188}];
app.use('/assets', express.static('assets'));
var it = 0;
/*
setInterval(function(){
  wget({url: "https://docs.google.com/uc?export=download&id=1LrEWPjeh9n57nSaBrQXkC_9bZcyIfQk2", dest: "file.txt"},function(err,res,body){
 	  var xml = fs.readFileSync('file.txt', 'utf8');
  var obj = parse(xml);
  var  l,lat,lon;
  	console.log(obj);
  	console.log("DSF");
	if(xml.length){
		l=obj.root.children[1].children[0].children.length
		lat= obj.root.children[1].children[0].children[l-1].attributes.lat
		lon=obj.root.children[1].children[0].children[l-1].attributes.lon
		console.log(obj.root.children[1].children[0].children[l-1].attributes)
		console.log(lat,lon);
	
	}




	console.log(lat);
	console.log(lon);
   io.emit('changelocation',{'lat': lat, 'lon': lon});
  });
},10000);

*/
var flag = 0;
setInterval(function(){
	console.log(i);
	if(flag == 0){
		lat = coord[it]['lat'];
		lon = coord[it]['lon'];
		time = coord[it]['time'];
		it = (it + 1)%10;
		if(it == 0)flag = 1;

		console.log(lat);
		console.log(lon);
	   io.emit('changelocation',{'lat': lat, 'lon': lon, 'time': time});
	}
	if(flag == 1){
		lat = route1[it]['lat'];
		lon = route1[it]['lon'];
		time = route1[it]['time'];
		it = (it + 1)%13;
		if(it == 0)flag = 2;

		console.log(lat);
		console.log(lon);
	   io.emit('changelocation',{'lat': lat, 'lon': lon, 'time': time});
	}
	if(flag == 2){
		lat = route2[it]['lat'];
		lon = route2[it]['lon'];
		time = route2[it]['time'];
		it = (it + 1)%16;
		if(it == 0)flag = 0;

		console.log(lat);
		console.log(lon);
	   io.emit('changelocation',{'lat': lat, 'lon': lon, 'time': time});
	}
},2000);



function read_file3(req,res)
{
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
		//console.log(year2[i],month2[i],day2[i],hour2[i],minute2[i],seconds2[i]);				
  	}
  	var count=0;
  	for(i=0;i<time_arr2.length-1;i++)
  	{
  		var d=getDistanceFromLatLonInKm(lat_arr[i],long_arr[i],lat_arr[i+1],long_arr[i+1]);
  		console.log(d);
  		count++;
  		//if(count%5==0 && d<0.5)
  		if (d<0.5)
  		{
  			distance.push(d*1000);
  			time_d.push(hour2[i]+":"+minute2[i]+":"+seconds2[i]);
  			//console.log(distance[i],time_d[i]);
  		}
  		else
  		{
  			distance.push(2.0);
  			time_d.push(hour2[i]+":"+minute2[i]+":"+seconds2[i]);
  		}
  		
  	}
  	

  	console.log(distance,time_d);
  	var data={dist:distance,tim:time_d};
	res.render("dashboard",{data:data});
  });
    
}

function read_file3_tables(req,res)
{
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
		//console.log(year2[i],month2[i],day2[i],hour2[i],minute2[i],seconds2[i]);				
  	}
  	var count=0;
  	for(i=0;i<time_arr2.length-1;i++)
  	{
  		//var d=getDistanceFromLatLonInKm(lat_arr[i],long_arr[i],lat_arr[i+1],long_arr[i+1]);
  		//console.log(d);
  		//count++;
  		//if(count%5==0 && d<0.5)
  		{
  		//	distance.push(d*1000);
  			time_d.push(hour2[i]+":"+minute2[i]+":"+seconds2[i]);
  			//console.log(distance[i],time_d[i]);
  		}
  		
  	}
  	//console.log(distance,time_d);
  	var data={dist:distance,tim:time_d,lat:lat_arr2,lon:long_arr2};
	//console.log(data);
	res.render("tables",{data:data});
  });
    
}


app.get("/dashboard",function(req,res){
  
  //var wget = require('node-wget');
  //wget({url: "https://docs.google.com/uc?export=download&id=1LrEWPjeh9n57nSaBrQXkC_9bZcyIfQk2", dest: "file.txt"},function(){

  //console.log("downloaded1");
  //});
  	 time_arr2=[];
	 lat_arr2=[];
	 long_arr2=[];
	 year2=[];
	 month2=[];
	 day2=[];
	 hour2=[];
	 minute2=[];
	 seconds2=[];
	 distance=[];
	 time_d=[];
	read_file3(req,res);
 
});

app.get("/maps",function(req,res){
  
  //var wget = require('node-wget');
  //wget({url: "https://docs.google.com/uc?export=download&id=11zXcy24AuyxoX3wvuApL8O-d9IkXPzrY", dest: "file2.txt"},function(error, response, body){

  //console.log(body);
  //console.log("downloaded2");

  //});

  console.log(req.body);
  res.render("map");

});

app.get("/tables",function(req,res){
   time_arr2=[];
	lat_arr2=[];
	long_arr2=[];
	year2=[];
	month2=[];
	day2=[];
	hour2=[];
	minute2=[];
	seconds2=[];
	distance=[];
	time_d=[];
 read_file3_tables(req,res);
});


var cur_lat=13.0,cur_long=80.0;

app.post("/location",urlencodedParser,function(req,res){
    var lat=req.body.latitude;
    var lon = req.body.longitude;
    var time = req.body.time;
    cur_lat=lat;
    cur_long=lon;
    fs.appendFile("Time-Location.txt",lat+" "+lon+" "+time+"\n",function(err){
      if(err)
        throw err;
      console.log(lat+" "+lon+" "+time+"----data updated");
    });
  });

app.get("/location",urlencodedParser,function(req,res){
    
	var data={cur_lat:cur_lat,cur_long:cur_long};    
    res.render("location",{data:data});
  });
