// IPv4 functions
function isIPv4(str)
{
    if (str=='0.0.0.0' || str=='255.255.255.255') return false;
    return /^(([01]?\d\d?|2[0-4]\d|25[0-5])[.]?){4}$/.test(str) &&
           /^\d{1,3}(\.\d{1,3}){3}$/.test(str);
}

function isIPv4Mask(str)
{
    if (str=='0.0.0.0' || str=='255.255.255.255') return true;
    if (!isIPv4(str)) return false;

    var ipnum = strIP2Num(str);
    while ((ipnum&0x80000000) != 0) ipnum <<= 1;
    return (ipnum == 0);
}

function strIP2Num(str)
{
    var ip = str.split('.');
    return (ip[0]<<24) | (ip[1]<<16) | (ip[2]<<8) | ip[3];
}

function numIP2Str(ipnum)
{
    return (ipnum>>>24).toString() +'.'+ (ipnum>>>16&0xff) +'.'+ (ipnum>>>8&0xff) +'.'+ (ipnum&0xff);
}

function replaceNetID(src, dst, msk)
{
    if (!isIPv4(src) || !isIPv4(dst) || !isIPv4Mask(msk)) return '';

    var srcnum = strIP2Num(src);
    var dstnum = strIP2Num(dst);
    var msknum = strIP2Num(msk);

    dstnum = (msknum & srcnum) | (~msknum & dstnum);
    return numIP2Str(dstnum);
}

function getNetID(ip, msk)
{
    if (!isIPv4(ip) || !isIPv4Mask(msk)) return '';

    var ipnum = strIP2Num(ip);
    var msknum = strIP2Num(msk);

    return numIP2Str(msknum & ipnum);
}

function getFirstIP(ip, msk)
{
    if (!isIPv4(ip) || !isIPv4Mask(msk)) return '';

    var ipnum = strIP2Num(ip);
    var msknum = strIP2Num(msk);
    var firstip = (ipnum & msknum) + 1;
    return numIP2Str(firstip);
}

function isDomainName(str)
{
    return /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}$/i.test(str);
}

function alertSpecial(msg) {
    msg = $('<span/>').html(msg).text();
    alert(msg);
}

function confirmSpecial(msg) {
    msg = $('<span/>').html(msg).text();
    return confirm(msg);
}

function htmlEncode(value) {
    return $('<span/>').text(value).html();
}

function htmlDecode(value) {
    return $('<span/>').html(value).text();
}

function isXSS(val)
{
    var pattern = /<[^>]*>/;
    if(pattern.test(val))
        return true;
    else
        return false;
}

function isNumber(value)
{
	return /^\d+$/.test(value);
}

function isMacAddr(val)
{
	return /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/i.test(val);
}

function wifiQRCode(ssid, psk, auth, hide)
{
    var encodedSSID = ssid.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/:/g, '\\:').replace(/'/g, '\\\'').replace(/"/g, '\\"').replace(/\./g, '\\\.');
    var encodedPSK  =  psk.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/:/g, '\\:').replace(/'/g, '\\\'').replace(/"/g, '\\"').replace(/\./g, '\\\.');
    var str;
    if (auth=='wpa2_a' || auth=='wpa2_ta' || auth=='wpawpa2') {
        str = 'WIFI:T:WPA;S:'+encodedSSID+';P:'+encodedPSK+';';
    }
    else if (auth == 'wep') {
        str = 'WIFI:T:WEP;S:'+encodedSSID+';P:'+encodedPSK+';';
    }
    else {
        str = 'WIFI:T:nopass;S:'+encodedSSID+';P:'+encodedPSK+';';
    }
    str += (hide=='1') ? 'H:true;' : ';';
    str = utf16to8(str);
    return str;
}

function utf16to8(str)
{
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        }
    }
    return out;
}

function getCookie(name)
{
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
}

function invalidMsg(obj, msg)
{
	if (msg == '') {
		if ($(obj).hasClass('invalid')) {
			$(obj).removeClass('invalid');
			$(obj).last().next('span').remove();
		}
	}
	else if ($(obj).hasClass('invalid')) {
		$(obj).last().next('span').html(msg);
		$(obj).first().select().focus();
	}
	else {
		$(obj).addClass('invalid');
		$(obj).last().after('<span class="vmsg error">'+ msg +'</span>');
		$(obj).first().select().focus();
	}
}

function toDDHHMMSS(sec)
{
	var time    = parseInt(sec);
	var days    = parseInt(time/86400);
	var hours   = ('0'+ parseInt(time/3600) % 24).substr(-2);
	var minutes = ('0'+ parseInt(time/60) % 60).substr(-2);
	var seconds = ('0'+ time % 60).substr(-2);

	return days +':'+ hours +':'+ minutes +':'+ seconds;
}

function aryStrToObj(strAry, objAry) {
	if (strAry.length != objAry.length) return false;

	objAry.each(function(idx, val) {
		$(this).val(strAry[idx]);
	});
	return true;
}

function aryObjToStr(objAry, strSep) {
	var ret=[];
	objAry.each(function(idx, val) {ret.push($(this).val());});
	return ret.join(strSep);
}

function checkSSIDValid(str) {
	var singlebyte = /[\x20-\x7e]/;
	var doublebyte = /[\xb4\xb7\xb8\xc0\xc1\xc2\xc3\xc7\xc8\xc9\xca\xcc\xcd\xce\xd1\xd2\xd3\xd5\xd6\xd9\xda\xdb\xdc\xe0\xe1\xe2\xe3\xe7\xe8\xe9\xea\xec\xed\xee\xf1\xf2\xf3\xf5\xf6\xf9\xfa\xfb\xfc]/;
	var triplebyte = /[\x80\u20ac]/;
	var length = 0;
	if (str.length > 0) {
		for (var i=0; i<str.length; i++) {
			var chr = str.charAt(i);
			if (singlebyte.test(chr))
				length+=1;
			else if (doublebyte.test(chr))
				length+=2;
			else if (triplebyte.test(chr))
				length+=3;
			else {
				//alertSpecial('&iexcl;SSID contiene caracteres no v&aacute;lidos!');
				return false;
			}
		}
	}

	if (length==0 || length>32) {
		//alertSpecial('SSID no v&aacute;lido. &iexcl;Longitud m&iacute;nima permitida es de 1 caracteres y &iexcl;longitud m&aacute;xima permitida es de 32 caracteres!');
		return false;
	}
	return true;
}

function wscPincheck(str) {
	var PIN = parseInt(str);
	var accum = 0;

	if (isNaN(str) || (str.length!=4 && str.length!=8))
		return false;

	if (str.length == 8) {
		accum += 3 * (parseInt(PIN / 10000000) % 10);
		accum += 1 * (parseInt(PIN / 1000000) % 10);
		accum += 3 * (parseInt(PIN / 100000) % 10);
		accum += 1 * (parseInt(PIN / 10000) % 10);
		accum += 3 * (parseInt(PIN / 1000) % 10);
		accum += 1 * (parseInt(PIN / 100) % 10);
		accum += 3 * (parseInt(PIN / 10) % 10);
		accum += 1 * (parseInt(PIN / 1) % 10);

		if (0 == (accum % 10))
			return true;
	}
	else if (str.length == 4)
		return true;

	return false;
}

function dumpObj(arr, level) {
	var dumped_text = "";
	if (!level) level = 0;

	var level_padding = "";
	for (var j=0; j<level+1; j++) level_padding += "    ";

	if (typeof(arr) == 'object') {
		for (var item in arr) {
			var value = arr[item];

			if (typeof(value) == 'object') { 
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += dumpObj(value, level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else {
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}

//star:20100825 IPV6_RELATED
function isIPv6(str)  
{
if (str.match(/:/g) == null) return false;
return str.match(/:/g).length<=7  
&&/::/.test(str)  
?/^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i.test(str)  
:/^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(str);  
}

