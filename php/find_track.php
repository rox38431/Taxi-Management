<?php
	include("DBClass.php");
	$objDB = new DBClass();

	//$date = $_POST['date'];
	$GPSset = array();
	$sumGPS = 0;
	$lat = "";
	$lon = "";

	$sql = "select * from taxi_on_fly_track where carno = '".$_GET['find_carno']."' and time >= '".$_GET['find_time']." 00:00:00' and time < '".$_GET['find_time']." 23:59:59' order by time,recordid";
	
	$rs = $objDB->Recordset($sql);
	$row = $objDB->GetRows($rs);
	$dataCount = $objDB->RecordCount($rs);

		
	for($i=0; $i<$dataCount; $i++)
	{
		$GPSset[$sumGPS] = array($row[$i]['CarNo'], $row[$i]['lat'], $row[$i]['lon'], $row[$i]['Time']);
		$sumGPS++;
	}


	echo json_encode($GPSset);

?>


