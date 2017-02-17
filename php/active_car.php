<?php
	include("DBClass.php");
	$objDB = new DBClass();

	$GPSset = array();
	$sumGPS = 0;
	$lat = "";
	$lon = "";
	$speed = "";

	$sql = "select carno from taxi_rawdata where  Time >= '".$_GET[pre_time]."' group by carno order by carno";


	$rs = $objDB->Recordset($sql);
	$row = $objDB->GetRows($rs);
	$dataCount = $objDB->RecordCount($rs);

	
	for($i=0; $i<$dataCount; $i++)
	{
		$GPSset[$sumGPS] = array($row[$i]['carno']);
		$sumGPS++;
	}


	echo json_encode($GPSset);

?>


