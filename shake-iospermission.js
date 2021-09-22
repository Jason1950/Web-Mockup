        // ********************************************** //
        //                                                //
        //               permission check                 //
        //                                                //
        // ********************************************** //

        
        function iosGrantedTips(){
            var ua = navigator.userAgent.toLowerCase(); //判斷移動端裝置，區分android，iphone，ipad和其它
            if(ua.indexOf("like mac os x") > 0){ //判斷蘋果裝置
                // 正則判斷手機系統版本
                var reg = /os [\d._]*/gi ;
                var verinfo = ua.match(reg) ;
                var version = (verinfo+"").replace(/[^0-9|_.]/ig,"").replace(/_/ig,".");
                var arr=version.split(".");
                console.log(arr[0]+"."+arr[1]+"."+arr[2]) //獲取手機系統版本
                if (arr[0]>12&&arr[1]>2) {  //對13.3以後的版本處理,包括13.3
                    DeviceMotionEvent.requestPermission().then(permissionState => {
                        if (permissionState === 'granted') { //已授權
                            shakeInit() //搖一搖
                        } else if(permissionState === 'denied'){// 開啟的連結不是https開頭
                            alert("當前IOS系統拒絕訪問動作與方向。請退出微信，重新進入活動頁面獲取許可權。")
                        }
                    }).catch((err)=>{
                        alert("使用者未允許許可權")
                        //======這裡可以防止重複授權，需要改動，因為獲取許可權需要點選事件才能觸發，所以這裡可以改成某個提示框===//
                        console.log("由於IOS系統需要手動獲取訪問動作與方向的許可權，為了保證搖一搖正常執行，請在訪問提示中點選允許！")
                        ios13granted();
                    });
                }else{  //13.3以前的版本
                    alert("蘋果系統13.3以前的版本")
                }
            }
        }
        function ios13granted() {
            if (typeof DeviceMotionEvent.requestPermission === 'function') {
                DeviceMotionEvent.requestPermission().then(permissionState => {
                    if (permissionState === 'granted') {
                        shakeInit() //搖一搖
                    } else if(permissionState === 'denied'){// 開啟的連結不是https開頭
                        alert("當前IOS系統拒絕訪問動作與方向。請退出微信，重新進入活動頁面獲取許可權。")
                    }
                }).catch((error) => {
                    alert("請求裝置方向或動作訪問需要使用者手勢來提示")
                })
            } else {
                // 處理常規的非iOS 13+裝置
                alert("處理常規的非iOS 13+裝置")
            }
        }