function calError(lat,lon,time)
{
	var min = 999999999;
	var optLat = pred_lat[0];
	var optLon = pred_long[0];
	var dist;
	var tresh = 0.02;
	var begin_time = 600;
	var end_time = 700;
	if(time>begin_time && time<end_time)
	{
		for(var i = 0 ; i<pred_lat.length ; i++)
		{
			dist = getDistanceFromLatLonInKm(lat,lon,pred_lat[i],preds_long[i]);
			if(dist<min)
			{
				dist = min;
				optLat = pred_lat[i];
				optLOn = pred_long[i];
			}
		}	
		if(min<tresh)
			return 1;
		return 0;
	}
}