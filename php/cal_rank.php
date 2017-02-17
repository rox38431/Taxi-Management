<?php
	include("DBClass.php");
	$objDB = new DBClass();

	$GPSset = array();
	$sumGPS = 0;

	$sql = "select carno, sum(".$_GET[type].") as total from ".$_GET[table_name]." where time >= '".$_GET[pre_week]."' group by carno order by total desc";
	$rs = $objDB->Recordset($sql);
	$row = $objDB->GetRows($rs);
	$dataCount = $objDB->RecordCount($rs);

	for($i=0; $i<$dataCount; $i++)
	{
		if (strcmp($row[$i]['carno'], $_GET[find_carno]) == 0)	{
			if (strcmp($row[$i]['carno'], "0") == 0)
				$GPSset[0] = array(0, $dataCount);
			else
				$GPSset[0] = array($i + 1, $dataCount);
		}
	}


	$sql = "select carno, sum(".$_GET[type].") as total from ".$_GET[table_name]." where time >= '".$_GET[pre_month]."' group by carno order by total desc";
	$rs = $objDB->Recordset($sql);
	$row = $objDB->GetRows($rs);
	$dataCount = $objDB->RecordCount($rs);

	for($i=0; $i<$dataCount; $i++)
	{
		if (strcmp($row[$i]['carno'], $_GET[find_carno]) == 0)	{
			if (strcmp($row[$i]['carno'], "0") == 0)
				$GPSset[1] = array(0, $dataCount);
			else
				$GPSset[1] = array($i + 1, $dataCount);
		}
	}


	$sql = "select carno, sum(".$_GET[type].") as total from ".$_GET[table_name]." where time >= '".$_GET[pre_three_month]."' group by carno order by total desc";
	$rs = $objDB->Recordset($sql);
	$row = $objDB->GetRows($rs);
	$dataCount = $objDB->RecordCount($rs);

	for($i=0; $i<$dataCount; $i++)
	{
		if (strcmp($row[$i]['carno'], $_GET[find_carno]) == 0)	{
			if (strcmp($row[$i]['carno'], "0") == 0)
				$GPSset[2] = array(0, $dataCount);
			else
				$GPSset[2] = array($i + 1, $dataCount);
		}
	}


	echo json_encode($GPSset);

?>


