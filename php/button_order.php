<?php
	include("DBClass.php");
	$objDB = new DBClass();

	$GPSset = array();
	$sumGPS = 0;
	$sql = "";

	if (strcmp($_GET[table], "taxi_active_date") == 0)
		$sql = "select carno from taxi_active_date where  Time >= '".$_GET[pre_time]."' order by carno";
	else
		$sql = "select carno, a.total from (select carno, sum(".$_GET[order].") as total from ".$_GET[table]." where time >= '".$_GET[pre_time]."' group by carno) as a where a.total > 0 order by a.total desc;";



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


