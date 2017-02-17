var polylinePoints1 = [];
var polylinePoints2 = [];
var polylinePoints3 = [];
var polylinePoints4 = [];
var polylinePoints5 = [];

function query_fitted_track(date)   {
    var elem = document.getElementById("myBar");

    xhr = $.ajax({      //query fitted track
        type: 'GET',
        url:"php/taxi_track.php",
        dataType: 'json',
        data: {
            find_fit_carno: focus_carno,
            find_fit_time: date
        },
        success: function (data3){
            //window.alert(data3);
            //console.log(data3);
            elem.style.width = 100 + '%';
            elem.innerHTML = 100 + '%';
            document.getElementById("myProgress").style.display = 'none';
            elem.style.width = 50 + '%';
            elem.innerHTML = 50 + '%';
            bar_counter = 50;
            n = -1;

            if (data3.length == 0)
                window.alert("didn't have tarck data");
            

            for (i = 0; i < data3.length; i++)   {

                if (data3[i][3].localeCompare(date + " 00:00:00") == 0) {
                    polylinePoints1[count1] = new L.LatLng(data3[i][1], data3[i][2]);
                    polylinePoints5[count5] = new L.LatLng(data3[i][1], data3[i][2]);
                    count5 = count5 + 1;
                    count1 = count1 + 1;
                }
                    else if (data3[i][3].localeCompare(date + " 06:00:00") == 0)    {
                    polylinePoints2[count2] = new L.LatLng(data3[i][1], data3[i][2]);
                    polylinePoints5[count5] = new L.LatLng(data3[i][1], data3[i][2]);
                    count5 = count5 + 1;
                    count2 = count2 + 1;
                }   
                else if (data3[i][3].localeCompare(date + " 12:00:00") == 0)    {
                    polylinePoints3[count3] = new L.LatLng(data3[i][1], data3[i][2]);
                    polylinePoints5[count5] = new L.LatLng(data3[i][1], data3[i][2]);
                    count5 = count5 + 1;
                    count3 = count3 + 1;
                }   
                else {
                    polylinePoints4[count4] = new L.LatLng(data3[i][1], data3[i][2]);
                    polylinePoints5[count5] = new L.LatLng(data3[i][1], data3[i][2]);
                    count5 = count5 + 1;
                    count4 = count4 + 1;
                }             
            }
            var polylineOptions = {
                color: 'white',
                weight: 5,
                opacity: 0.9
            };  
            if (count1 > 0)  {
                polyline1 = new L.Polyline(polylinePoints1, polylineOptions);
                map.addLayer(polyline1);                        

                polyline1.setStyle({
                color: '#d81f2a'
                });
            }
            if (count2 > 0)  {
                polyline2 = new L.Polyline(polylinePoints2, polylineOptions);
                map.addLayer(polyline2);                        

                polyline2.setStyle({
                color: '#ff9900'
                });
            }
            if (count3 > 0)  {
                polyline3 = new L.Polyline(polylinePoints3, polylineOptions);
                map.addLayer(polyline3);                        

                polyline3.setStyle({
                color: '#2F4F4F'
                });
            }
            if (count4 > 0)  {
                polyline4 = new L.Polyline(polylinePoints4, polylineOptions);
                map.addLayer(polyline4);                        

                polyline4.setStyle({
                color: '#9ea900'
                });
            }
            polyline5 = new L.Polyline(polylinePoints5, polylineOptions);
            map.fitBounds(polyline5.getBounds()); 
        },
        error: function(){
            window.alert("query_fitted_track Failed~!!3");
        }
    });
}

function map_matching_cal(date) {
    $.ajax({        //call map-matching
        type: 'GET',
        dataType: 'text',
        url:'php/ssh_xterm.php',
        data: {
            set_carno: focus_carno,
            set_time: date
        },
        success: function (data2){
            //window.alert(data2);
            //console.log(data2);
            query_fitted_track(date);
        },
        error: function(){
            window.alert("map_matching_cal Failed~!!2");
        }
    });
}

function find_exist_track(date) {
    var elem = document.getElementById("myBar");

    $.ajax({
        type: 'GET',
        url:"php/find_track.php",
        dataType: 'json',
        data: {
            find_carno: focus_carno,   
            find_time: date
        },
        success: function (data){
            //window.alert(data);
            //console.log(data);
            elem.style.width = 50 + '%';
            elem.innerHTML = 50 + '%';

            if (data.length == 0)   {
                map_matching_cal(date);
            }
            else    {
                query_fitted_track(date);
            }

        },
        error: function(){
            window.alert("find_exist_track Failed~!!1");
        }
    });

}

function FindTaxiTrack(date)	{
    track_type = "All";
    document.getElementById(track_type).style.background = "";
    document.getElementById("All").style.background = "gray";
    document.getElementById("myProgress").style.display = 'block';
    var elem = document.getElementById("myBar");

    if( xhr != null ) {
        xhr.abort();
        xhr = null;
    }

   for (i in map._layers) {
        if (map._layers[i].options.format == undefined) {
            try {
                map.removeLayer(map._layers[i]);
            } catch (e) {
                console.log("problem with " + e + map._layers[i]);
            }
        }
   }
   count1 = count2 = count3 = count4 = count5 = 0;

   var carno = focus_carno;
   var find = -1;
   n = 0;
   setTimeout(progress_bar_count, 1000);
   
   polylinePoints1 = [];
   polylinePoints2 = [];
   polylinePoints3 = [];
   polylinePoints4 = [];
   polylinePoints5 = [];

   find_exist_track(date);

   line = 1;
   L.tileLayer('//a.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:20}).addTo(map);
}

//----------------------------強調指定時段軌跡顏色
function changeValue(val)   {
    document.getElementById("00-06").style.background = "#d81f2a";
    document.getElementById("06-12").style.background = "#ff9900";
    document.getElementById("12-18").style.background = "#2F4F4F";
    document.getElementById("18-24").style.background = "#9ea900";
    document.getElementById("All").style.background = "";

    if (val == 1)   {
        track_type = "00-06";
        document.getElementById("00-06").style.background = "gray";
    }
    else if (val == 2)  {
        track_type = "06-12";
        document.getElementById("06-12").style.background = "gray";
    }
    else if (val == 3)  {
        track_type = "12-18";
        document.getElementById("12-18").style.background = "gray";
    }
    else if (val == 4)   {
        track_type = "18-24";
        document.getElementById("18-24").style.background = "gray";
    }

    if (count1 > 0)
        polyline1.setStyle({opacity: 0.0});
    if (count2 > 0)
        polyline2.setStyle({opacity: 0.0});
    if (count3 > 0)
        polyline3.setStyle({opacity: 0.0});
    if (count4 > 0)
        polyline4.setStyle({opacity: 0.0});

    if(line == 1)    {
        if (val == 1 && count1 != 0) {
            polyline1.setStyle({opacity: 1.5});
        }

        if (val == 2 && count2 != 0)   {
            polyline2.setStyle({opacity: 1.5});
        }

        if (val == 3 && count3 != 0)   {
            polyline3.setStyle({opacity: 1.5});
        }

        if (val == 4 && count4 != 0)   {
            polyline4.setStyle({opacity: 1.5});
        }
    }
}

//----------------------------恢復軌跡顏色
function resetColor() {
    document.getElementById("00-06").style.background = "#d81f2a";
    document.getElementById("06-12").style.background = "#ff9900";
    document.getElementById("12-18").style.background = "#2F4F4F";
    document.getElementById("18-24").style.background = "#9ea900";
    document.getElementById("All").style.background = "";
    track_type = "All";

    if (count1 > 0)
        polyline1.setStyle({opacity: 0.9});
    if (count2 > 0)
        polyline2.setStyle({opacity: 0.9});
    if (count3 > 0)
        polyline3.setStyle({opacity: 0.9});
    if (count4 > 0)
        polyline4.setStyle({opacity: 0.9});
}