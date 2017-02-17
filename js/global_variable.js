var focus_carno = "none";   //現在指定車輛的車號
var mark = [];              //地圖上標記的車輛, mark[i][0] = 圖標, mark[i][1] = 車號, mark[i][2] = 緯度, mark[i][3] = 精度
var active_taxi = [];       //目前正在活動的車輛, activate[i][0] = 車號, ctivate[i][1] = 停止(0)或行進(1)
var track_type = "All";     //目前查看哪個時段的軌跡,  00~06時 = "00-06", 06~12時 = "06-12", 12~18時 = "12-18", 18~24時 = "18-24", 全時段 = "All"
var line = 0;               //地圖上是否在繪製軌跡, 否 = 0, 是 = 1


//=============車號按鈕排序之參數=============
var temp_standard = "charBox";  
var temp_time_range = "threeMonthBox";
var order_standard = "charBox";
var order_time_range = "threeMonthBox";
//=============車號按鈕排序之參數結束=============


//=============地圖上計程車圖標之大小設定=============
var LeafIcon = L.Icon.extend({
    options: {
        iconSize:     [30, 30],
        iconAnchor:   [15, 15],
        popupAnchor:  [0, -15]
    }
});
//=============地圖上計程車圖標之大小設定結束=============


//=============地圖上的軌跡============
var polyline1;
var polyline2;
var polyline3;
var polyline4;
var polyline5;
//=============地圖上的軌跡結束============


var count1 = 0, count2 = 0, count3 = 0, count4 = 0, count5 = 0;     //資料庫抓取後，用於軌跡的計數器
var xhr = null;


//=============柱狀圖表建立=============
var currentdate = new Date(); 
var week_time_label = [];
var month_time_label = [], big_month_time_label = [];
var three_month_time_label = [], big_three_month_time_label = [];


currentdate.setDate(currentdate.getDate()-8);
for (i = 0; i < 7; i++) {
    currentdate.setDate(currentdate.getDate()+1);
    
    var label_day = (currentdate.getDate()).toString();
    var label_month = (currentdate.getMonth()+1).toString();
        
    week_time_label[i] = label_month + "/" + label_day; 
}

currentdate.setDate(currentdate.getDate()-30);
for (i = 0; i < 30; i++)    {
    currentdate.setDate(currentdate.getDate()+1);
    
    var label_day = (currentdate.getDate()).toString();
    var label_month = (currentdate.getMonth()+1).toString();
    
    big_month_time_label[i] = label_month + "/" + label_day;    
    if (i % 9 == 0)
        month_time_label[i] = label_month + "/" + label_day;    
    else
        month_time_label[i] = "";
}

currentdate.setDate(currentdate.getDate()-90);
for (i = 0; i < 90; i++)    {
    currentdate.setDate(currentdate.getDate()+1);
    
    var label_day = (currentdate.getDate()).toString();
    var label_month = (currentdate.getMonth()+1).toString();
        
    big_three_month_time_label[i] = label_month + "/" + label_day; 
    if (i % 15 == 0)
        three_month_time_label[i] = label_month + "/" + label_day;    
    else
        three_month_time_label[i] = "";
}  

Chart.defaults.global.templateInterpolators = {
    start: "[[",
    end: "]]"
};

Chart.defaults.global.scaleLabel = "[[= value ]]";
Chart.defaults.global.tooltipTemplate = "[[if (label){]][[= label ]]: [[}]][[= value ]]";
Chart.defaults.global.multiTooltipTemplate = "[[= value ]]";

var bar_week_val = [];
var bar_week_avg_val = [];
var bar_month_val = [];
var bar_month_avg_val = [];
var bar_three_month_val = [];
var bar_three_month_avg_val = [];


var week_data = {
    labels: week_time_label,
    datasets: [{
        type: "bar",
        data: bar_week_val,
        scaleFontSize: 12
    }]
};
var month_data = {
    labels: month_time_label,
    datasets: [{
        type: "bar",
        data: bar_month_val
    }]
};
var three_month_data = {
    labels: three_month_time_label,
    datasets: [{
        type: "bar",
        data: bar_three_month_val
    }]
};

var big_week_data = {
    labels: week_time_label,
    datasets: [{
        type: "bar",
        data: bar_week_val,
        scaleFontSize: 12
    }]
};
var big_month_data = {
    labels: big_month_time_label,
    datasets: [{
        type: "bar",
        data: bar_month_val
    }]
};
var big_three_month_data = {
    labels: big_three_month_time_label,
    datasets: [{
        type: "bar",
        data: bar_three_month_val
    }]
};
//=============柱狀圖表建立結束=============
