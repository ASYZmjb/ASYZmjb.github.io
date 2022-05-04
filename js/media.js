function showMedia(o){
	var s;
	
	o = $.extend({
		width: 450,
		height: 390,
		id: ''
	}, o);
	
	if(/^qvod\:\/\//i.test(o.url)){
		//qvod
		s = qvodPlayer(o);
		document.write(s);
		return;
	}
	
	var ext = GetFileExt(o.url).toLowerCase();
	
	switch (ext){
	
	case '.rm':
	case '.ram':
	case '.rmvb':
	case '.ra':
		s = RMPlayer(o);
		break;
	case '.swf':
		s = FlashPlayer(o);
		break;
	case '.flv':
	case '.mp4':
		s = cmstopPlayer(o);
		break;
	default:
		s = MPlayer(o);
	}
	
	document.write(s);
}

function qvodPlayer(o){
	return '<object width="'+ o.width +'" height="'+ o.height +'" onerror="if(confirm(\''+ P8LANG.qvod_error +'\'))window.open(\'http://error2.qvod.com/error2.htm\')" classid="clsid:F3D0D36F-23F8-4682-A195-74C92B03D4AF" name="QvodPlayer" id="'+ o.id +'">\
		<param value="'+ o.url +'" name="URL" />\
		<param value="1" name="Autoplay"/>\
	</object>';
}

function FLVPlayer(o){
	return '\
	<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,124,0" width="' + o.width + '" height="' + o.height + '" id="'+ o.id +'">\
		<param name="movie" value="'+ P8CONFIG.RESOURCE +'/js/cmp/cmp.swf" />\
		<param name="quality" value="high" />\
		<param name="allowScriptAccess" value="always" />\
		<param name="allowFullScreen" value="true" />\
		<param name="flashvars" value="src='+ o.url +'&image='+ o.image +'&label='+ o.title +'" />\
		<embed src="'+ P8CONFIG.RESOURCE +'/js/cmp/cmp.swf" quality="high" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" width="' + o.width + '" height="' + o.height + '" allowScriptAccess="always" allowFullScreen="true" flashvars="src='+ o.url +'&image='+ o.image +'&label='+ o.title +'"></embed>\
	</object>';
}

function MPlayer(o){
	return '\
	<object id="'+ o.id +'" CLASSID="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6" border="0" codebase="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701" width="'+ o.width +'" height="'+ o.height +'" type="application/x-oleobject">\
		<param name="AutoStart" value="1" />\
		<param name="Balance" value="0" />\
		<param name="enabled" value="-1" />\
		<param name="EnableContextMenu" value="-1" />\
		<param name="url" value="'+ o.url +'" />\
		<param name="PlayCount" value="0" />\
		<param name="rate" value="1" />\
		<param name="currentPosition" value="0" />\
		<param name="currentMarker" value="0" />\
		<param name="defaultFrame" value="" />\
		<param name="invokeURLs" value="0" />\
		<param name="baseURL" value="" />\
		<param name="stretchToFit" value="1" />\
		<param name="volume" value="50" />\
		<param name="mute" value="0" />\
		<param name="uiMode" value="Full" />\
		<param name="windowlessVideo" value="0" />\
		<param name="fullScreen" value="0" />\
		<param name="enableErrorDialogs" value="-1" />\
		<param name="SAMIStyle" />\
		<param name="SAMILang" />\
		<param name="SAMIFilename" />\
		<embed src="'+ o.url +'" width="'+ o.width +'" height="'+ o.height +' type="application/x-mplayer2"></embed>\
	</object>';
}

function RMPlayer(o){
	var json = $.toJSON(o).replace(/"/g, '\'');
	
	return '\
	<object id="'+ o.id +'" classid="clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA" width="' + o.width + '" height="' + o.height + '" onerror="RMPlayer_error('+ json +')">\
		<param name="_ExtentX" value="4445">\
		<param name="_ExtentY" value="3334">\
		<param name="AUTOSTART" value="-1">\
		<param name="SHUFFLE" value="0">\
		<param name="PREFETCH" value="0">\
		<param name="NOLABELS" value="-1">\
		<param name="SRC" value="rtsp://'+ o.url +'">\
		<param name="CONTROLS" value="Imagewindow,StatusBar,ControlPanel">\
		<param name="CONSOLE" value="clip1">\
		<param name="LOOP" value="0">\
		<param name="NUMLOOP" value="0">\
		<param name="CENTER" value="0">\
		<param name="MAINTAINASPECT" value="0">\
		<param name="BACKGROUNDCOLOR" value="#000000">\
		<embed src="'+ o.url +'" width="' + o.width + '" height="' + o.height + '" controls="ImageWindow,StatusBar,ControlPanel" autostart="true" console="Clip1" nolabels="true" type="audio/x-pn-realaudio-plugin"></embed>\
	</object>';
}

function RMPlayer_error(o){
	var obj = $('object[classid="clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA"][id="'+ o.id +'"]');
	//replace with qvod
	obj.replaceWith($(qvodPlayer(o)));
}

function FlashPlayer(o){
	var flashvars = '';
	if(typeof o.flashvars == 'string'){
		flashvars = o.flashvars;
	}else{
		var comma = '';
		for(var i in o.flashvars){
			flashvars += comma + encodeURIComponent(i) + '='+ encodeURIComponent(o.flashvars[i]);
			comma = '&';
		}
	}
	
	return '\
	<object id="'+ o.id +'" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0" width="' + o.width + '" height="' + o.height + '" align="middle">\
		<param name="allowScriptAccess" value="sameDomain" />\
		<param name="movie" value="'+ o.url +'" />\
		<param name="quality" value="high">\
		<param name="wmode" value="transparent">\
		<param name="flashvars" value="'+ flashvars +'" />\
		<param name="allowFullScreen" value="true" />\
		<embed wmode="transparent" src="'+ o.url +'" allowfullscreen="true" flashvars="'+ flashvars +'" quality="high" bgcolor="#ffffff" width="' + o.width + '" height="' + o.height + '" name="var" align="middle" allowScriptAccess="sameDomain" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />\
	</object>';
}

function cmstopPlayer(o){

var flashvars = '';
	if(typeof o.flashvars == 'string'){
		flashvars = o.flashvars;
	}else{
		var comma = '';
		for(var i in o.flashvars){
			flashvars += comma + encodeURIComponent(i) + '='+ encodeURIComponent(o.flashvars[i]);
			comma = '&';
		}
	}
	flashvars +='onPlay=onPlayJS&onPause=onPauseJS&onPlayed=onPlayedJS&onPlayerReady=onPlayerReadyJS&onEndFinish=onEndFinishJS&file='+ o.url +'&vid='+ o.id;
	if(typeof(o.image)!='undefined')flashvars +='&coverImg='+o.image;
	
	return '\
	<object id="player_'+ o.id +'" width="' + o.width + '" height="' + o.height + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" type="application/x-shockwave-flash">\
		<param name="movie" value="'+ P8CONFIG.RESOURCE +'/js/ctoplayer/player.swf" />\
		<param name="flashvars" value="'+ flashvars +'" />\
		<param name="allowFullScreen" value="true" />\
		<param name="allowScriptAccess" value="always" />\
		<param name="wmode" value="Transparent" />\
		<embed id="cmstop_embed" src="'+ P8CONFIG.RESOURCE +'/js/ctoplayer/player.swf" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" wmode="Transparent" width="' + o.width + '" height="' + o.height + '" flashvars="'+ flashvars +'"></embed>\
	</object>';

}

function GetFileExt(fileurl){
	var s = fileurl.toString().replace(/(\?|#).*/g, '');
	var i = s.length;
	
	for ( var j=i;j>0;j-- )
	{
		if ( s.charAt(j)=='.' )
		{
			return s.substring(j,i);
		}
	}
	return '';
}
