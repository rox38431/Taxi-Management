<?php
	include("DBClass.php");
	$objDB = new DBClass();

	$date = $_POST['date'];
	$GPSset = array();
	$sumGPS = 0;
	$lat = "";
	$lon = "";
	$speed = "";

	$sql = "select * from rawdata_gotaxiking where time > '2016-03-15' and time < '2016-03-16' and carno = '0279' order by time;";

	$rs = $objDB->Recordset($sql);
	$row = $objDB->GetRows($rs);
	$dataCount = $objDB->RecordCount($rs);

	
	for($i=0; $i<$dataCount; $i++)
	{
		$GPSset[$sumGPS] = array($row[$i]['lat'], $row[$i]['lon'], $row[$i]['Time']);
		$sumGPS++;
	}


	echo json_encode($GPSset);

?>


