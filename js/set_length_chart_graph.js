//----------------抓取一周、一個月、三個月資訊-----------------
function set_length_chart_bar() {
    myWeekLineBarChart.destroy();
    myMonthLineBarChart.destroy();
    myThreeMonthLineBarChart.destroy();
    myBiggerWeekLineBarChart.destroy();
    myBiggerMonthLineBarChart.destroy();
    myBiggerThreeMonthLineBarChart.destroy();

    var d = new Date();
    var currenttime = d.getFullYear() + "-" + (d.getMonth() + 1).toString() + "-" + d.getDate();
    d.setDate(d.getDate() - 90);
    var pasttime = d.getFullYear() + "-" + (d.getMonth() + 1).toString() + "-" + d.getDate();

    $.ajax({
        type: 'GET',
        url:"php/fetch_length.php",
        dataType: 'json',
        data: {
            find_carno: focus_carno,
            pre_time: pasttime,   
            now_time: currenttime
        },
        success: function (data){
            for (i = 0; i < 7; i++)
                bar_week_val[i] = bar_week_avg_val[i] = 0;

            
            for(i = data.length-1, j = 6, k = 0; i >= 0 && j >= 0; i--, j--, k++) {
                bar_week_val[j] = data[i][2];
                bar_week_avg_val[j] = data[k][4];
            }

            for (i = 0; i < 30; i++)
                bar_month_val[i] = bar_month_avg_val[i] = 0;
            for(i = data.length-1, j = 29, k = 0; i >= 0 && j >= 0; i--, j--, k++)  {
                bar_month_val[j] = data[i][2];
                bar_month_avg_val[j] = data[k][4];
            }

            for (i = 0; i < 90; i++)
                bar_three_month_val[i] = bar_three_month_avg_val[i] = 0;
            for(i = data.length-1, j = 89, k=0; i >= 0 && j >= 0; i--, j--, k++)  {
                bar_three_month_val[j] = data[i][2];
                bar_three_month_avg_val[j] = data[k][4];
            }


            bar_week_data = {
                    labels: week_time_label,
                    datasets: [{
                        type: "line",
                        fillColor: "rgba(0,220,0,0.5)",
                        strokeColor: "rgba(0,220,0,1)",
                        pointColor: "rgba(220,20,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: bar_week_val
                    },
                    {
                        type: "line",
                        fillColor: "rgba(250,34,34,0.2)",
                        strokeColor: "rgba(250,34,34,1)",
                        pointColor: "rgba(250,34,34,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: bar_week_avg_val
                    }]
                };

            bar_month_data = {
                    labels: month_time_label,
                    datasets: [{
                        type: "line",
                        fillColor: "rgba(0,220,0,0.5)",
                        strokeColor: "rgba(0,220,0,1)",
                        pointColor: "rgba(220,20,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: bar_month_val
                    },
                    {
                        type: "line",
                        fillColor: "rgba(250,34,34,0.2)",
                        strokeColor: "rgba(250,34,34,1)",
                        pointColor: "rgba(250,34,34,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: bar_month_avg_val
                    }]
            };

            bar_three_month_data = {
                    labels: three_month_time_label,
                    datasets: [{
                        type: "line",
                        fillColor: "rgba(0,220,0,0.5)",
                        strokeColor: "rgba(0,220,0,1)",
                        pointColor: "rgba(220,20,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: bar_three_month_val
                    },
                    {
                        type: "line",
                        fillColor: "rgba(250,34,34,0.2)",
                        strokeColor: "rgba(250,34,34,1)",
                        pointColor: "rgba(250,34,34,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: bar_three_month_avg_val
                    }]
            };

            big_week_data = {
                    labels: week_time_label,
                    datasets: [{
                        type: "bar",
                        fillColor: "rgba(0,220,0,0.5)",
                        strokeColor: "rgba(0,220,0,1)",
                        pointColor: "rgba(220,20,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: bar_week_val
                    },
                    {
                        type: "line",
                        fillColor: "rgba(250,34,34,0.2)",
                        strokeColor: "rgba(250,34,34,1)",
                        pointColor: "rgba(250,34,34,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: bar_week_avg_val
                    }]
                };

            big_month_data = {
                    labels: big_month_time_label,
                    datasets: [{
                        type: "bar",
                        fillColor: "rgba(0,220,0,0.5)",
                        strokeColor: "rgba(0,220,0,1)",
                        pointColor: "rgba(220,20,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: bar_month_val
                    },
                    {
                        type: "line",
                        fillColor: "rgba(250,34,34,0.2)",
                        strokeColor: "rgba(250,34,34,1)",
                        pointColor: "rgba(250,34,34,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: bar_month_avg_val
                    }]
            };

            big_three_month_data = {
                    labels: big_three_month_time_label,
                    datasets: [{
                        type: "bar",
                        fillColor: "rgba(0,220,0,0.5)",
                        strokeColor: "rgba(0,220,0,1)",
                        pointColor: "rgba(220,20,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: bar_three_month_val
                    },
                    {
                        type: "line",
                        fillColor: "rgba(250,34,34,0.2)",
                        strokeColor: "rgba(250,34,34,1)",
                        pointColor: "rgba(250,34,34,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: bar_three_month_avg_val
                    }]
            };

            //canvases
            weekLineBar = document.getElementById("week-bar").getContext("2d");
            monthLineBar = document.getElementById("month-bar").getContext("2d");
            threeMonthLineBar = document.getElementById("three-month-bar").getContext("2d");
            //---放大
            biggerWeekLineBar = document.getElementById("big-week-bar").getContext("2d");
            biggerMonthLineBar = document.getElementById("big-month-bar").getContext("2d");
            biggerthrTeMonthLineBar = document.getElementById("big-three-month-bar").getContext("2d");

            //charts
            myWeekLineBarChart = new Chart(weekLineBar).Overlay(bar_week_data, {overrideRotation: 0, pointDotRadius : 0,scaleFontSize : 15,
                scaleLabel:function(label){return label.value.toString() + "km";}});
            myMonthLineBarChart = new Chart(monthLineBar).Overlay(bar_month_data, {overrideRotation: 0, pointDotRadius : 0,scaleFontSize : 15,
                scaleLabel:function(label){return label.value.toString() + "km";}});
            myThreeMonthLineBarChart = new Chart(threeMonthLineBar).Overlay(bar_three_month_data, {overrideRotation: 0, pointDotRadius : 0,scaleFontSize : 15,
                scaleLabel:function(label){return label.value.toString() + "km";}});
            //---放大
            myBiggerWeekLineBarChart = new Chart(biggerWeekLineBar).Overlay(big_week_data, {overrideRotation: 0, scaleFontSize : 15,
                scaleLabel:function(label){return label.value.toString() + "km";}});
            myBiggerMonthLineBarChart = new Chart(biggerMonthLineBar).Overlay(big_month_data, {overrideRotation: 0, scaleFontSize : 15,
                scaleLabel:function(label){return label.value.toString() + "km";}});
            myBiggerThreeMonthLineBarChart = new Chart(biggerthrTeMonthLineBar).Overlay(big_three_month_data, {overrideRotation: 0, scaleFontSize : 15,
                scaleLabel:function(label){return label.value.toString() + "km";}});
    
            myWeekLineBarChart.update();
            myMonthLineBarChart.update();
            myThreeMonthLineBarChart.update();
            myBiggerWeekLineBarChart.update();
            myBiggerMonthLineBarChart.update();
            myBiggerThreeMonthLineBarChart.update();

            bar_week_val = [];
            bar_month_val = [];
            bar_three_month_val = [];
            bar_week_avg_val = [];
            bar_month_avg_val = [];
            bar_three_avg_month_val = [];
        },
        error: function(){
            window.alert("set_length_chart_bar failed~!!");
        }
    });
}

//----------------抓取當日資訊-----------------
function query_day_len()    {
    var d = new Date();
    var pasttime = d.getFullYear() + "-" + (d.getMonth() + 1).toString() + "-" + d.getDate() + " 00:00:00";

    $.ajax({
        type: 'GET',
        url:"php/day_len.php",
        dataType: 'json',
        data: {
            find_carno: focus_carno,
            pre_time: pasttime
        },
        success: function (data){
            if (data.length != 0)   {
                if (data[0][0] == "0")
                    document.getElementById("today_total").innerHTML = "今日行駛里程: " + "未活動" + "<br> 車隊平均行駛里程: " + data[0][1];
                else if (data[0][0] != null)    {
                    data[0][0] = data[0][0].substring(0, 5);
                    document.getElementById("today_total").innerHTML = "今日行駛里程: " + data[0][0] + "km<br>車隊平均行駛里程: " + data[0][1] + "km<br> 排名: " + data[0][2];
                }
                else
                    document.getElementById("today_total").innerHTML = "今日行駛里程: 0 km";
            }
        },
        error: function(){
            window.alert("query_day_len failed~!!");
        }
    });
}