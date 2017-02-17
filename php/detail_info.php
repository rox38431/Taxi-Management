<?php
	include("DBClass.php");
	$objDB = new DBClass();

	$GPSset = array();
	$sumGPS = 0;


	$sql = "select taxi_day_time.Time, taxi_day_time.carno, taxi_day_time.Hour, taxi_day_length.kilometer from taxi_day_time inner join taxi_day_length on taxi_day_time.carno='".$_GET[find_car]."' and taxi_day_time.Time = taxi_day_length.Time and  taxi_day_time.carno = taxi_day_length.carno  and taxi_day_time.Time > '".$_GET[pre_time]."'";


	$rs = $objDB->Recordset($sql);
	$row = $objDB->GetRows($rs);
	$dataCount = $objDB->RecordCount($rs);

	
	for($i=0; $i<$dataCount; $i++)
	{
		$GPSset[$sumGPS] = array($row[$i]['Time'], $row[$i]['carno'], $row[$i]['Hour'], $row[$i]['kilometer']);
		$sumGPS++;
	}


	echo json_encode($GPSset);

?>


