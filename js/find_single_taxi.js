var pre_find;   //查詢的前一台車是否有改變圖標顏色
pre_find = -1;
function Find_single_taxi(button_id) {
    resetColor();
    var temp_carno = focus_carno;

    //--------------回復上一個按鈕之顏色---------------
    if (document.getElementById(focus_carno) !== null && document.getElementById(focus_carno).style.background == "darkgray") 
        document.getElementById(focus_carno).style.background = "black";
    else if (document.getElementById(focus_carno) !== null && document.getElementById(focus_carno).style.background == "goldenrod")
        document.getElementById(focus_carno).style.background = "yellow";
    else if (document.getElementById(focus_carno) !== null && document.getElementById(focus_carno).style.background == "gray")
        document.getElementById(focus_carno).style.background = "";
    //--------------回復上一個按鈕之顏色結束---------------


    //--------------設定按鈕之顏色---------------
    if (document.getElementById(button_id).style.background == "black")
        document.getElementById(button_id).style.background = "darkgray";
    else if (document.getElementById(button_id).style.background == "yellow")
        document.getElementById(button_id).style.background = "goldenrod";
    else
        document.getElementById(button_id).style.background = "gray";
    //--------------設定按鈕之顏色結束---------------

    focus_carno = button_id;

    if (document.getElementById("Time").style.background == "gray")   {
        document.getElementById("Time").style.background = "gray";
        query_day_time();
        set_time_chart_bar();
        cal_rank("taxi_day_time", "Hour");
    }
    else    {
        document.getElementById("Length").style.background = "gray";
        query_day_len();
        set_length_chart_bar();
        cal_rank("taxi_day_length", "kilometer");
    }

    L.tileLayer('//a.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:20}).addTo(map);

    if (line == 1) {
        Present_Pos(button_id);
        map.removeLayer(polyline);
        line = 0;
    }
    else {
        line = 0;
    }
    

    //------------------------------回復上台車之顏色-----------------------------
    var redIcon = new LeafIcon({iconUrl: 'img/taxi_red.png'}),
        yellowIcon = new LeafIcon({iconUrl: 'img/taxi_yellow.png'}),
        blackIcon = new LeafIcon({iconUrl: 'img/taxi_black.png'});

    if (pre_find != -1)  {
        map.removeLayer(mark[pre_find][0]);
        mark[pre_find][0] = L.marker([mark[pre_find][2],mark[pre_find][3]],  {icon: yellowIcon}).addTo(map);
        mark[pre_find][0].bindPopup(temp_carno);
    } 
    pre_find = -1;
    //------------------------------回復上台車之顏色結束-----------------------------


    //------------------------------設定指定車輛之顏色-----------------------------
    var finded = 0;
        for (i = 0; i < mark.length; i++)   {
        if (button_id.localeCompare(mark[i][1]) == 0)   {
            finded = 1;
            map.setView([mark[i][2],mark[i][3]], 16);
            
            map.removeLayer(mark[i][1]);
            mark[i][0] = L.marker([mark[i][2],mark[i][3]],  {icon: redIcon}).addTo(map);
            mark[i][0].bindPopup(mark[i][1]);
            pre_find = i;
        }
    }
    //------------------------------清除指定車輛設定指定車輛之顏色結束-----------------------------
}