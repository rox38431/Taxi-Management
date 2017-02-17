import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import java.util.HashMap;
import java.util.Map;

import java.sql.*;

import java.util.Calendar;
import java.util.Date;
import java.text.SimpleDateFormat;

import java.math.BigDecimal;
import java.math.*;

public class cal_now_len
{
    static final String DB_URL = "---";
    static final String USER = "---";
    static final String PASS = "---";

    public static void main(String[] args) 
    {
        
        try {
            new cal_now_len().start();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private void start() throws Exception
    {
        Connection conn = null;
        Statement stmt_carno = null;
        Statement stmt_pos = null;
        Statement stmt_insert = null;

        try{
            Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(DB_URL,USER,PASS);

            stmt_carno = conn.createStatement();
            stmt_pos = conn.createStatement();
            stmt_insert = conn.createStatement();

            String ymd = "";
            while (true)    {

                String future_time = getFutureTime();
                String now_time = getNowTime();
                String pre_time = getPreTime(0, -1);
                

                if (ymd.equals("") == true)
                    ymd = now_time.substring(0, 10);

                if (future_time.equals(now_time) == true)   {
                    String carno_sql = "select carno from test_raw_data where time >= \'" + pre_time + "\' and time < \'" + future_time + "\' group by carno";
                    ResultSet carno_rs = stmt_carno.executeQuery(carno_sql);

                    while(carno_rs.next()) {
                        String id  = carno_rs.getString("carno"); 
                        String pos_sql = "select lat, lon from test_raw_data where carno=\'" +  id + "\' and time >= \'" + pre_time + "\' and time < \'" + future_time + "\' order by recordid";
                        ResultSet position_rs = stmt_pos.executeQuery(pos_sql);

                        int count = 0;
                        BigDecimal bd_first_lat = new BigDecimal("0");
                        BigDecimal bd_first_lon = new BigDecimal("0");
                        BigDecimal bd_second_lat = new BigDecimal("0");
                        BigDecimal bd_second_lon = new BigDecimal("0");
                        BigDecimal total_len = new BigDecimal("0");
                        BigDecimal lon_to_meter = new BigDecimal("101.000");
                        BigDecimal lat_to_meter = new BigDecimal("111.000");

                        while(position_rs.next())   {
                            String lat  = position_rs.getString("lat"); 
                            String lon  = position_rs.getString("lon"); 

                            if (count == 0) {
                                bd_first_lat = new BigDecimal(lat); 
                                bd_first_lon = new BigDecimal(lon); 

                                count++;
                            }
                            else {
                                bd_second_lat = new BigDecimal(lat); 
                                bd_second_lon = new BigDecimal(lon); 

                                BigDecimal x = bd_first_lon.subtract(bd_second_lon);
                                BigDecimal y = bd_first_lat.subtract(bd_second_lat);

                                x = x.multiply(lon_to_meter);
                                y = y.multiply(lat_to_meter);

                                BigDecimal pow_x = x.multiply(x);
                                BigDecimal pow_y = y.multiply(y);

                                BigDecimal un_square_root = pow_x.add(pow_y);

                                BigDecimal part_len = new BigDecimal(Math.pow(un_square_root.doubleValue(), 0.5));

                                // 30 秒內應該不可能行駛超過一公里，但是以避免防影響整體平均值
                                if (part_len.compareTo(new BigDecimal("1")) == 1)
                                    part_len = new BigDecimal("1");

                                total_len = total_len.add(part_len);

                                bd_first_lat = bd_second_lat;
                                bd_first_lon = bd_second_lon;
                            }
                        }

                        total_len = total_len.setScale(5, BigDecimal.ROUND_HALF_UP);

                        try {
                            String insert_sql = "insert into taxi_hour_length values";
                            insert_sql += "(null,\'" + id + "\',\'" + total_len.toString() + "\',\'" + pre_time + "\')";
                            stmt_insert.executeUpdate(insert_sql);
                        } catch (Exception e) {
                            System.out.println("新增每小時行駛距離錯誤");
                        }

                        
                    }
                }

                // 每過午夜12點，加總前日行駛距離與計算平均
                if (now_time.substring(0, 10).equals(ymd) == false)  {
                    ymd = now_time.substring(0, 10);
                    update_average_length(getPreTime(1, -1) ,now_time, "taxi_hour_length", "taxi_day_avg_length");
                    update_length(getPreTime(1, -1) ,now_time, "taxi_hour_length", "taxi_day_length");
                }

                try {
                    Thread.sleep(1000);                 
                } catch(InterruptedException ex) {
                    System.out.println("計時器錯誤");
                    Thread.currentThread().interrupt();
                }
            }
        


        }catch(SQLException se){
            se.printStackTrace();
            System.out.println("行駛資訊查詢:錯誤-1");
        }catch(Exception e){
            System.out.println("行駛資訊查詢:錯誤-2");
            e.printStackTrace();
        }finally{
            try{
                if(stmt_carno!=null)
                    stmt_carno.close();
            }catch(SQLException se2){
                System.out.println("行駛資訊查詢:錯誤-3");
            }// nothing we can do
            try{
                if(conn!=null)
                conn.close();
            }catch(SQLException se){
                System.out.println("行駛資訊查詢:錯誤-4");
                se.printStackTrace();
            }//end finally try
        }//end try
    }


    public static String getFutureTime()  {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH");
        Calendar calendar = Calendar.getInstance();

        String future_time = sdf.format(calendar.getTime());

        return(future_time + ":00:00");
   }

    public static String getNowTime()  {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Calendar calendar = Calendar.getInstance();

        String now_time = sdf.format(calendar.getTime());

        return(now_time);
   }

    public static String getPreTime(int type, int minus_time)  { // type0 = hour, type1 = day, type2 = week, type3 = month. type4 = 3 month
        SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd HH");
        Calendar calendar = Calendar.getInstance();
        String pre_time = "";

        if (type == 0)  {   //hour
            calendar.add(Calendar.HOUR_OF_DAY, minus_time);
            pre_time = sdf1.format(calendar.getTime());
        }
        else if (type == 1) {   //day
            calendar.add(Calendar.DATE, minus_time);
            pre_time = sdf2.format(calendar.getTime());
            pre_time += ":00:00";
        }   
        return(pre_time);
    }

    void update_length(String pre_time, String now_time, String start_table_name, String destination_table_name) {
        Connection conn = null;
        Statement stmt_avg = null;
        Statement stmt_carno = null;
        Statement stmt_pos = null;
        Statement stmt_insert = null;

        try{
            Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(DB_URL,USER,PASS);

            stmt_avg = conn.createStatement();
            stmt_carno = conn.createStatement();
            stmt_pos = conn.createStatement();
            stmt_insert = conn.createStatement();

            String avg_sql = "select kilometer from taxi_day_avg_length where time >= \'" + pre_time + "\' and time < \'" + now_time + "\'";
            ResultSet avg_rs = stmt_carno.executeQuery(avg_sql);
            String avg_length = "0";
            while(avg_rs.next())
                avg_length = avg_rs.getString("kilometer");

            String carno_sql = "select carno from " + start_table_name + " where time >= \'" + "2016-07-01" + "\' and time < \'" + now_time + "\' group by carno";
            ResultSet carno_rs = stmt_carno.executeQuery(carno_sql);

            while(carno_rs.next()) {
                String id  = carno_rs.getString("carno"); 
                String pos_sql = "select sum(kilometer) as total from " + start_table_name + " where carno=\'" + id + "\' and time >= \'" + pre_time + "\' and time < \'" + now_time + "\'";
                ResultSet position_rs = stmt_pos.executeQuery(pos_sql);
                position_rs.next();

                String total_length  = position_rs.getString("total"); 
                if (total_length == null)
                    total_length = "0";

                BigDecimal total_bd = new BigDecimal(total_length);
                BigDecimal avg_bd = new BigDecimal(avg_length);
                String under_standard = "0";
                if (avg_bd.compareTo(total_bd) == 1)
                    under_standard = "1";

                if (total_length.length() > 5)
                    total_length = total_length.substring(0, 6);

                try {
                    String insert_sql = "insert into " + destination_table_name + " values";
                    insert_sql += "(null,\'" + id + "\',\'" + total_length + "\',\'" + pre_time + "\',\'" + under_standard + "\')";
                    //System.out.println(insert_sql);
                    stmt_insert.executeUpdate(insert_sql);
                } catch (Exception e) {
                    System.out.println("一日行駛距離新增:錯誤-1");
                }
            }

        }catch(SQLException se){
            System.out.println("行駛距離查詢:錯誤-1");
            se.printStackTrace();
        }catch(Exception e){
            System.out.println("行駛距離查詢:錯誤-2");
            e.printStackTrace();
        }finally{
            try{
                if(stmt_carno!=null)
                    stmt_carno.close();
            }catch(SQLException se2){
                System.out.println("行駛距離查詢:錯誤-3");
            }// nothing we can do
            try{
                if(conn!=null)
                conn.close();
            }catch(SQLException se){
                System.out.println("行駛距離查詢:錯誤-4");
                se.printStackTrace();
            }//end finally try
        }//end try
    }


    void update_average_length(String pre_time, String now_time, String start_table_name, String destination_table_name) {
        Connection conn = null;
        Statement stmt_total = null;
        Statement stmt_car_count = null;
        Statement stmt_insert = null;


        try{
            Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(DB_URL,USER,PASS);

            stmt_total = conn.createStatement();
            stmt_car_count = conn.createStatement();
            stmt_insert = conn.createStatement();

            //----- total length of all taxi
            String total_sql = "select sum(kilometer) as total from " + start_table_name + " where time >= \'" + pre_time + "\' and time < \'" + now_time + "\'";
            ResultSet total_rs = stmt_total.executeQuery(total_sql);
            String total_length = "0";
            while(total_rs.next())
                total_length = total_rs.getString("total");

            //----- total number of car
            String car_count_sql = "select count(distinct carno) as num from taxi_hour_length where time >= \'" + pre_time + "\' and time < \'" + now_time + "\'";
            ResultSet car_count_rs = stmt_car_count.executeQuery(car_count_sql);
            car_count_rs.next();
            String car_count = car_count_rs.getString("num");

            if (total_length == null)
                total_length = "0";

            BigDecimal total_bd = new BigDecimal(total_length);
            BigDecimal count_bd = new BigDecimal(car_count);
            BigDecimal avg = total_bd.divide(count_bd, 3, RoundingMode.CEILING);

            try {
                String insert_sql = "insert into " + destination_table_name + " values";
                insert_sql += "(null,\'" + avg + "\',\'" + pre_time + "\')";
                //System.out.println(insert_sql);
                stmt_insert.executeUpdate(insert_sql);
            } catch (Exception e) {
                System.out.println("平均行駛距離新增:錯誤-1");
            }


        }catch(SQLException se){
            System.out.println("行駛距離查詢:錯誤-5");
            se.printStackTrace();
        }catch(Exception e){
            System.out.println("行駛距離查詢:錯誤-6");
            e.printStackTrace();
        }finally{
            try{
                if(stmt_total!=null)
                    stmt_total.close();
            }catch(SQLException se2){
                System.out.println("行駛距離查詢:錯誤-7");
            }// nothing we can do
            try{
                if(conn!=null)
                conn.close();
            }catch(SQLException se){
                System.out.println("行駛距離查詢:錯誤-8");
                se.printStackTrace();
            }//end finally try
        }//end try
    }

}
