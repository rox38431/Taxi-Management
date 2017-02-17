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

import java.nio.charset.Charset;

import java.util.Calendar;
import java.text.SimpleDateFormat;


public class fetch_taxi_raw
{
    static final String DB_URL = "---";
    static final String USER = "---";
    static final String PASS = "---";

    public static void main(String[] args) 
    {

        try {
            new fetch_taxi_raw().start();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private void start() throws Exception
    {
        //--------------------------------------------

        Map<String, Integer> hash_map = new HashMap<String, Integer>();
        URL url = new URL("---");
        URLConnection connection = url.openConnection();

        Document doc = parseXML(connection.getInputStream());
        NodeList descNodes = doc.getElementsByTagName("TaxiData");

        Integer index_count = new Integer(0);
        String[][] taxi_raw = new String[10000][9];
        String provider = "", carno = "", valid = "", lon = "", lat = "", angle = "", speed = "", carstatus = "", datetime = "";
        int find_new_data = 0;
        //---------------------------------------------

        Connection conn = null;
        Statement stmt = null;
        while (true)    {
            try{
                Class.forName("com.mysql.jdbc.Driver");
                conn = DriverManager.getConnection(DB_URL,USER,PASS);
                stmt = conn.createStatement();
            
                String sql;
                while (true)   {

                    for(int i=0; i<descNodes.getLength();i++)
                    {
                        carno = doc.getElementsByTagName("TaxiData").item(i).getAttributes().getNamedItem("CarNo").getNodeValue();        //車輛編號
                        valid = doc.getElementsByTagName("TaxiData").item(i).getAttributes().getNamedItem("Valid").getNodeValue();        //定位是否正確
                        datetime = doc.getElementsByTagName("TaxiData").item(i).getAttributes().getNamedItem("DateTime").getNodeValue();  //資料回傳時間


                        if (valid.equals("定位正常")) {    // 若定位不正確則丟棄該筆資料

                            Integer taxi_raw_index;
                            if (hash_map.get(carno) == null) {    // 過去未曾抓取過該台計程車的資料
                                taxi_raw_index = index_count;
                                Detect_New_Taxi(hash_map, taxi_raw, taxi_raw_index, doc, i);
                                index_count++;
                                find_new_data = 1;
                            }
                            else {    // 過去曾抓取過該台計程車資料
                                taxi_raw_index = hash_map.get(carno).intValue();
                                String old_taxi_time = taxi_raw[taxi_raw_index][8];

                                if (Latest_Data(old_taxi_time, datetime) == true) {
                                    Detect_New_Data(taxi_raw, taxi_raw_index, doc, i);
                                    find_new_data = 1;
                                }
                            }

                            
                            if (find_new_data == 1) {    // 將新抓取的資料插入資料庫

                                Avoid_UTF8(taxi_raw, taxi_raw_index);

                                sql = "insert into test_raw_data values(NULL, \'" + 
                                        taxi_raw[taxi_raw_index][1] + "\', \'" + 
                                        taxi_raw[taxi_raw_index][0] + "\', \'" + 
                                        taxi_raw[taxi_raw_index][2] + "\', \'" + 
                                        taxi_raw[taxi_raw_index][3] + "\', \'" + 
                                        taxi_raw[taxi_raw_index][4] + "\', \'" + 
                                        taxi_raw[taxi_raw_index][5] + "\', \'" + 
                                        taxi_raw[taxi_raw_index][6] + "\', \'" + 
                                        taxi_raw[taxi_raw_index][7] + "\', \'" + 
                                        taxi_raw[taxi_raw_index][8] + "\')";
                                stmt.executeUpdate(sql);
                                find_new_data = 0;
                            }
                            
                        }
                    }

                    try {
                        Thread.sleep(1000);                 // 1000 milliseconds is one second.
                    } catch(InterruptedException ex) {
                        System.out.print("計時器出錯");
                        Thread.currentThread().interrupt();
                    }

                    
                    try {
                        connection = url.openConnection();
                        doc = parseXML(connection.getInputStream());
                    } catch(InterruptedException ex) {
                        System.out.println("URL 連線出錯");
                    }

                    descNodes = doc.getElementsByTagName("TaxiData");

                }
                
            }catch(SQLException se){
                System.out.println("Mysql連線錯誤-1");
                se.printStackTrace();
            }catch(Exception e){
                System.out.println("Mysql連線錯誤-2");
                e.printStackTrace();
            }finally{
                try{
                    if(stmt!=null)
                        stmt.close();
                }catch(SQLException se2){
                    System.out.println("Mysql連線錯誤-3");
                }// nothing we can do
                try{
                    if(conn!=null)
                    conn.close();
                }catch(SQLException se){
                    System.out.println("Mysql連線錯誤-4");
                    se.printStackTrace();
                }//end finally try
            }//end try

            break;
        }
    }

    private void Detect_New_Taxi( Map<String,Integer> hash_map, String[][] taxi_raw, Integer taxi_raw_index, Document doc, Integer index) throws Exception {
        String provider = doc.getElementsByTagName("TaxiData").item(index).getAttributes().getNamedItem("Provider").getNodeValue();  //車商名稱
        String carno = doc.getElementsByTagName("TaxiData").item(index).getAttributes().getNamedItem("CarNo").getNodeValue();        //車輛編號
        String valid = doc.getElementsByTagName("TaxiData").item(index).getAttributes().getNamedItem("Valid").getNodeValue();        //定位是否正確
        String lon = doc.getElementsByTagName("TaxiData").item(index).getAttributes().getNamedItem("Lon").getNodeValue();            //經度
        String lat = doc.getElementsByTagName("TaxiData").item(index).getAttributes().getNamedItem("Lat").getNodeValue();            //緯度
        String angle = doc.getElementsByTagName("TaxiData").item(index).getAttributes().getNamedItem("Angle").getNodeValue();        //角度
        String speed = doc.getElementsByTagName("TaxiData").item(index).getAttributes().getNamedItem("Speed").getNodeValue();        //車速
        String carstatus = doc.getElementsByTagName("TaxiData").item(index).getAttributes().getNamedItem("CarStatus").getNodeValue();//狀態(載客, 休息等)
        String datetime = doc.getElementsByTagName("TaxiData").item(index).getAttributes().getNamedItem("DateTime").getNodeValue();  //資料回傳時間

        hash_map.put(carno, taxi_raw_index);       //hash map 中加入新計程車
        
        taxi_raw[taxi_raw_index][0] = provider;
        taxi_raw[taxi_raw_index][1] = carno;
        taxi_raw[taxi_raw_index][2] = valid;
        taxi_raw[taxi_raw_index][3] = lon;
        taxi_raw[taxi_raw_index][4] = lat;
        taxi_raw[taxi_raw_index][5] = angle;
        taxi_raw[taxi_raw_index][6] = speed;
        taxi_raw[taxi_raw_index][7] = carstatus;
        taxi_raw[taxi_raw_index][8] = datetime; 

    }

    private void Detect_New_Data(String[][] taxi_raw, Integer taxi_raw_index, Document doc, Integer index) throws Exception {
        String provider = doc.getElementsByTagName("TaxiData").item(index).getAttributes().getNamedItem("Provider").getNodeValue();  //車商名稱
        String carno = doc.getElementsByTagName("TaxiData").item(index).getAttributes().getNamedItem("CarNo").getNodeValue();        //車輛編號
        String valid = doc.getElementsByTagName("TaxiData").item(index).getAttributes().getNamedItem("Valid").getNodeValue();        //定位是否正確
        String lon = doc.getElementsByTagName("TaxiData").item(index).getAttributes().getNamedItem("Lon").getNodeValue();            //經度
        String lat = doc.getElementsByTagName("TaxiData").item(index).getAttributes().getNamedItem("Lat").getNodeValue();            //緯度
        String angle = doc.getElementsByTagName("TaxiData").item(index).getAttributes().getNamedItem("Angle").getNodeValue();        //角度
        String speed = doc.getElementsByTagName("TaxiData").item(index).getAttributes().getNamedItem("Speed").getNodeValue();        //車速
        String carstatus = doc.getElementsByTagName("TaxiData").item(index).getAttributes().getNamedItem("CarStatus").getNodeValue();//狀態(載客, 休息等)
        String datetime = doc.getElementsByTagName("TaxiData").item(index).getAttributes().getNamedItem("DateTime").getNodeValue();  //資料回傳時間
        
        taxi_raw[taxi_raw_index][0] = provider;
        taxi_raw[taxi_raw_index][1] = carno;
        taxi_raw[taxi_raw_index][2] = valid;
        taxi_raw[taxi_raw_index][3] = lon;
        taxi_raw[taxi_raw_index][4] = lat;
        taxi_raw[taxi_raw_index][5] = angle;
        taxi_raw[taxi_raw_index][6] = speed;
        taxi_raw[taxi_raw_index][7] = carstatus;
        taxi_raw[taxi_raw_index][8] = datetime; 
    }

    // 資料庫存取中文會亂碼，因此將中文預先轉成英文
    private void Avoid_UTF8(String[][] taxi_raw, Integer taxi_raw_index)   {
        if (taxi_raw[taxi_raw_index][0].equals("大文山"))
            taxi_raw[taxi_raw_index][0] = "teamA";
        else if (taxi_raw[taxi_raw_index][0].equals("新力達"))
            taxi_raw[taxi_raw_index][0] = "teamB";
        else 
            taxi_raw[taxi_raw_index][0] = "teamC";


        if (taxi_raw[taxi_raw_index][2].equals("定位正常"))
            taxi_raw[taxi_raw_index][2] = "correct_locate";
        else if (taxi_raw[taxi_raw_index][2].equals("定位中"))
            taxi_raw[taxi_raw_index][2] = "positioning";
        else
            taxi_raw[taxi_raw_index][2] = "error_locate";

        if (taxi_raw[taxi_raw_index][7].equals("登出"))
            taxi_raw[taxi_raw_index][7] = "logout";
        else if (taxi_raw[taxi_raw_index][7].equals("載客"))
            taxi_raw[taxi_raw_index][7] = "working";
        else if (taxi_raw[taxi_raw_index][7].equals("排班"))
            taxi_raw[taxi_raw_index][7] = "wait_work";
        else if (taxi_raw[taxi_raw_index][7].equals("前往"))
            taxi_raw[taxi_raw_index][7] = "go";
        else if (taxi_raw[taxi_raw_index][7].equals("未知"))
            taxi_raw[taxi_raw_index][7] = "unknown";
        else if (taxi_raw[taxi_raw_index][7].equals("休息"))
            taxi_raw[taxi_raw_index][7] = "rest";
        else if (taxi_raw[taxi_raw_index][7].equals("空車"))
            taxi_raw[taxi_raw_index][7] = "empty";
        else
            taxi_raw[taxi_raw_index][7] = "fixed";
    }

    // 確認抓取到的資料是否是最新的且非重複
    private boolean Latest_Data (String old_taxi_time, String new_taxi_time) throws Exception {
        if (old_taxi_time.equals(new_taxi_time) == true)    // 新資料時間與舊資料時間相同，確認為舊資料
            return false;

        Calendar cal_old = Calendar.getInstance();
        Calendar cal_new = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        cal_old.setTime(sdf.parse(old_taxi_time));
        cal_new.setTime(sdf.parse(new_taxi_time));

        long old_time = cal_old.getTimeInMillis();
        long new_time = cal_new.getTimeInMillis();

        if (old_time > new_time)    {   // 新資料時間比舊資時間料舊，確認為舊資料
            return false;
        }

        return true;
    }

    private Document parseXML(InputStream stream)
    throws Exception
    {
        DocumentBuilderFactory objDocumentBuilderFactory = null;
        DocumentBuilder objDocumentBuilder = null;
        Document doc = null;
        try
        {
            objDocumentBuilderFactory = DocumentBuilderFactory.newInstance();
            objDocumentBuilder = objDocumentBuilderFactory.newDocumentBuilder();

            doc = objDocumentBuilder.parse(stream);
            doc.getDocumentElement().normalize();
        }
        catch(Exception ex)
        {
            throw ex;
        }       

        return doc;
    }
}
