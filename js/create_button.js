function New_Button(table_name)   {
    var d = new Date();
    var pasttime;
    var order_norm;
    var minus_time;

    if (order_time_range == "dayBox")
        minus_time = 1;
    else if (order_time_range == "weekBox")
        minus_time = 7;
    else if (order_time_range == "monthBox")
        minus_time = 30;
    else 
        minus_time = 90;

    if (table_name == "taxi_hour_time" || table_name == "taxi_hour_length") {
        pasttime = d.getFullYear() + "-" + (d.getMonth() + 1).toString() + "-" + d.getDate() + " 00:00:00";
    }
    else    {
        d.setDate(d.getDate() - minus_time);
        pasttime = d.getFullYear() + "-" + (d.getMonth() + 1).toString() + "-" + d.getDate() + " 00:00:00";
    }

    if (order_standard == "lenBox")
        order_norm = "kilometer";
    else
        order_norm = "Hour";

    $.ajax({
        type: 'GET',
        url:"php/button_order.php",
        dataType: 'json',
        data: {
            pre_time: pasttime,   
            order: order_norm,
            table: table_name
        },
        success: function (data){
            for (i = 0; i < data.length; i++)
                add(data[i][0]);

            for (j = 0; j < active_taxi.length; j++)    {
                var button_dom = document.getElementById(active_taxi[j][0]);
                if (button_dom != null)  {
                    if (active_taxi[j][1] == 0) {
                        button_dom.style.background = "black";
                        button_dom.style.color = "white";
                    }
                    else    {
                        button_dom.style.background = "yellow";
                    }
                }
            }
        },
        error: function(){
            window.alert("New_Button failed~!!");
        }
    });
}

function add(id) {  
    var element = document.createElement("button");
    element.id = id;
    element.type = "button";
    element.value = id; 
    element.name = id;
    element.style.height="50px";
    element.style.width="100%";
    element.style.fontSize="200%";
    element.innerHTML = id;
    element.onclick = function()  {Find_single_taxi(id);}

    var foo = document.getElementById("content");
    foo.appendChild(element);
}

function time_select_show_up()  {
    if (document.getElementById("time_select").style.visibility == "visible")
        document.getElementById("time_select").style.visibility = "hidden";
    else
        document.getElementById("time_select").style.visibility = "visible";
}

function checkValue(id)  {
    if (id == "charBox" || id == "lenBox" || id == "timeBox")    {
        document.getElementById("charBox").checked = false;
        document.getElementById("lenBox").checked = false;
        document.getElementById("timeBox").checked = false;
        temp_standard = id;
    }
    else    {
        document.getElementById("dayBox").checked = false;
        document.getElementById("weekBox").checked = false;
        document.getElementById("monthBox").checked = false;
        document.getElementById("threeMonthBox").checked = false;
        temp_time_range = id;
    }

    if (id != "none")
        document.getElementById(id).checked = true;
}

function change_order() {
    document.getElementById('time_select').style.visibility = "hidden";

    order_standard = temp_standard;
    order_time_range = temp_time_range;

    if (order_standard == "lenBox") {
        if (order_time_range == "dayBox")
            New_Button("taxi_hour_length");
        else
            New_Button("taxi_day_length");
    }
    else if (order_standard == "timeBox")   {
        if (order_time_range == "dayBox")
            New_Button("taxi_hour_time");
        else
            New_Button("taxi_day_time");
    }
    else
        New_Button("taxi_active_date");
}

function reset_checkBox()   {
    checkValue(order_standard);
    checkValue(order_time_range);
}