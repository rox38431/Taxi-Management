#計程車管理系統

---
##1. 開發緣由 

近幾年優步(Uber)進入台灣，其利用了結合手機應用程式的方式，讓使用者可以方便快速的叫車和搭車，進而使得台灣的計程車車商面臨了前所未有的危機。若是車隊管理人能及時的得到目前各個駕駛的行駛資訊，並且將得到的行駛資訊加以分析，用以檢討個人在工作上的效率，或是加以探討如何讓計程車的使用率更加有效的利用，如此都能使得台灣本地的計程車獲得更多的優勢。


##2. 版面配置

頁面主要由三個區塊構成，分別是

(1) 最左方：計程車編號按鈕列表，可供使用者指定某台特定計程車

(2) 中間：以曲線圖表示行駛里程與行駛時間，並且以不同顏色區分整體與個人的行駛狀態

(3) 最右方：以地圖顯示目前各計程車的位置，或是查看某計程車的行駛軌跡

![home page](https://github.com/rox38431/Taxi_Management/blob/master/Demo_IMAGE/page.png)


##3. 功能介紹

###(1)即時位置

當一進入網頁，即可從地圖上看到目前所有活動中的計程車位置，點擊計程車後，可觀看該車的編號

![taxi pos](https://github.com/rox38431/Taxi_Management/blob/master/Demo_IMAGE/present_pos.png)

而計程車以不同顏色表示不同狀態

(1)若該計程車目前是正常活動的在行駛，則以黃色圖標的計程車來標記

(2)若是該計程車以經連續十分鐘以上未活動，停滯於某一點，則以黑色計程車圖標來標記

(3)而當使用者點擊了做左方計程車編號列表的某一台計程車，且該台計程車目前正在活動，則將該計程車標為紅色

![taxi sign color](https://github.com/rox38431/Taxi_Management/blob/master/Demo_IMAGE/mark.png)

###(2)行駛資訊

提供行駛距離與行駛時間的分析，並且將個人與車隊比較

圖表中紅色表示為整體車隊，綠色則為個人，下為行駛里程與行駛里程的圖表

![info](https://github.com/rox38431/Taxi_Management/blob/master/Demo_IMAGE/info.png)

除了圖表之外，為了可顯示更詳細資訊，因此另外以表格或是放大圖表的方式呈現

![text info](https://github.com/rox38431/Taxi_Management/blob/master/Demo_IMAGE/text_info.png)

![bigger info](https://github.com/rox38431/Taxi_Management/blob/master/Demo_IMAGE/bar.png)

###(3)行駛軌跡

使用者可透過萬年曆選擇某計程車任意一天的行駛軌跡，並顯示在地圖上

![taxi track](https://github.com/rox38431/Taxi_Management/blob/master/Demo_IMAGE/taxi_track.png)

下方的五個按鈕可幫助凸顯某一時段的軌跡

![button color](https://github.com/rox38431/Taxi_Management/blob/master/Demo_IMAGE/button_color.png)

![taxi track color](https://github.com/rox38431/Taxi_Management/blob/master/Demo_IMAGE/track_color.png)