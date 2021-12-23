let webDomain = 'https://site.av8888.net';

function webRecord(type)
{
    $.post(webDomain+"/record/index",{type:type},function(rs){},'json');
    //if(type == 'nopay')
    //window.location.href="./index.html";
}

function infoUrl(type,id)
{
	window.location.href="./info.html?type="+type+"&id="+id
}

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

/*
   时间倒计时
   TimeDown.js
   */
   function TimeDown(id, value) {
  
	//倒计时的总秒数
	var totalSeconds = parseInt(value / 1000);

	//取模（余数）
	var modulo = totalSeconds % (60 * 60 * 24);
	//小时数
	var hours = Math.floor(modulo / (60 * 60));
	modulo = modulo % (60 * 60);
	//分钟
	var minutes = Math.floor(modulo / 60);
	//秒
	var seconds = modulo % 60;

	hours = hours.toString().length == 1 ? '0' + hours : hours;
	minutes = minutes.toString().length == 1 ? '0' + minutes : minutes;
	seconds = seconds.toString().length == 1 ? '0' + seconds : seconds;

	//输出到页面
	document.getElementById(id).innerHTML = "<span>" + hours + "</span>:" + '<span>' + minutes + '</span>' + ":" + '<span>' + seconds + '</span>';
	//延迟一秒执行自己
	if(hours == "00" && minutes == "00" && parseInt(seconds)-1<0){

	}else{
		setTimeout(function () {
		TimeDown(id, value-1000);
		}, 1000)
	}

	}
	
	/**
 * 获取当前 URL 二级域名
 * 如果当前是 IP 地址，则直接返回 IP Address
 */
function getSubdomain() {
  var s = window.location.host;
  var h = s.split(".")[0];
  return h;
}