<?php
	include("DBClass.php");
	$objDB = new DBClass();

	$InfoSet = array();
	$AvgInfoSet = array();
	$sumGPS = 0;
	$lat = "";
	$lon = "";
	$speed = "";

	$sql = "select * from taxi_day_time where carno='".$_GET[find_carno]."' and time >= '".$_GET[pre_time]."' and time < '".$_GET[now_time]."' order by recordid";
	$sql2 = "select * from taxi_day_avg_time where time >= '".$_GET[pre_time]."' and time < '".$_GET[now_time]."' order by recordid";

	$rs = $objDB->Recordset($sql);
	$row = $objDB->GetRows($rs);
	$dataCount = $objDB->RecordCount($rs);

	$rs2 = $objDB->Recordset($sql2);
	$row2 = $objDB->GetRows($rs2);
	$dataCount2 = $objDB->RecordCount($rs2);

	
	for($i=0; $i<$dataCount; $i++)
	{
		$InfoSet[$sumGPS] = array($row[$i]['Carno'], $row[$i]['Time'], $row[$i]['Hour'], $row[$i]['underStandard'], $row2[$i]['Hour']);
		$sumGPS++;
	}

	echo json_encode($InfoSet);

?>


