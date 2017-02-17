var system_boot = 1;

function Present_Pos(button_id){

    if(line == 1)    {
        for (i in map._layers) {
            if (map._layers[i].options.format == undefined) {
                try {
                    map.removeLayer(map._layers[i]);
                } catch (e) {
                    console.log("problem with " + e + map._layers[i]);
                }
            }
        }
        line = 0;
    }
    L.tileLayer('//a.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:20}).addTo(map);
    


    var d = new Date();
    d.setMinutes(d.getMinutes() + 5);
    var currenttime = d.getFullYear() + "-" +
                      ('0' + (d.getMonth() + 1).toString()).slice(-2) + "-" +
                      ('0' + d.getDate()).slice(-2) + " " + 
                      ('0' + d.getHours()).slice(-2) + ":" + 
                      ('0' + d.getMinutes()).slice(-2) + ":" + 
                      ('0' + d.getSeconds()).slice(-2);

    d.setMinutes(d.getMinutes() - 10);
    var pasttime = d.getFullYear() + "-" + 
                   ('0' + (d.getMonth() + 1).toString()).slice(-2) + "-" + 
                   ('0' + d.getDate()).slice(-2) + " " + 
                   ('0' + d.getHours()).slice(-2) + ":" + 
                   ('0' + d.getMinutes()).slice(-2) + ":" + 
                   ('0' + d.getSeconds()).slice(-2);

    $.ajax({
        type: 'GET',
        url:"php/taxi_pos.php",
        dataType: 'json',
        data: {
            pre_time: pasttime,
            now_time: currenttime
        },
        success: function (data){
            var redIcon = new LeafIcon({iconUrl: 'img/taxi_red.png'}),
            yellowIcon = new LeafIcon({iconUrl: 'img/taxi_yellow.png'}),
            blackIcon = new LeafIcon({iconUrl: 'img/taxi_black.png'});

            //mark[i][0] = marker, mark[i][1] = carno, mark[i][2] = lat, mark[i][3] = lon

            for (i = 0; i < data.length; i++) {
                mark[i] = new Array(4);
                active_taxi[i] = new Array(2);
                
                var carno = data[i][0], lat = data[i][1], lon = data[i][2], speed = data[i][3]; 
                mark[i][1] = carno;     //carno
                mark[i][2] = lat;       //lat
                mark[i][3] = lon;       //lon

                if (carno.localeCompare(button_id) == 0)    {
                    mark[i][0] = L.marker([lat, lon], {icon: redIcon}).addTo(map);
                    mark[i][0].bindPopup(carno);
                    map.panTo(new L.LatLng(lat, lon));
                    active_taxi[i][0] = carno;
                    active_taxi[i][1] = 1;
                }
                else if (speed == 0)    {
                    mark[i][0] = L.marker([lat, lon], {icon: blackIcon}).addTo(map);
                    mark[i][0].bindPopup(carno);
                    active_taxi[i][0] = carno;
                    active_taxi[i][1] = 0;
                }
                else    {
                    mark[i][0] = L.marker([lat, lon], {icon: yellowIcon}).addTo(map);
                    mark[i][0].bindPopup(carno);
                    active_taxi[i][0] = carno;
                    active_taxi[i][1] = 1;
                }
            }

            if (system_boot == 1)   {
                New_Button("taxi_active_date");                             
                system_boot = 0;
            }
        },
        error: function(){
            window.alert("Present_Pos");
        }
    });        
}