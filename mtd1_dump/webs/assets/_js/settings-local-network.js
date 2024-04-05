


$(document).ready(function () {
	$('#accordion a.item').click(function () {
		window.top.name = '';
		$('#accordion li').children('ul').slideUp('fast');
		$("#accordion a").removeClass("active");
		$(this).addClass("active");
		$(this).siblings('ul').slideDown('fast');
		return false;
	});
});


$(window).load(function() {
    //firewall
    
    var accessClass = gvtMode.split('|')[0];
    /*if (accessClass == 'service02') {
        var firewall = document.getElementById("firewall");
        firewall.style.display = "none";
    }*/	//RM11739

	$('.configuracoes').trigger('click');

	// DHCP
	$('[name="radDhcpEn"]').on('click', function() {
		if ($('#radDhcpEn1').prop('checked'))
			$('.tr_dhcp,.tbl_dhcp').show();
		else
			$('.tr_dhcp,.tbl_dhcp').hide();

		if ($('#radDhcpDnsEn0').prop('checked'))
			$('.tr_custom_dns').hide();
	});
	loadDhcpConfig();
	loadDhcpLease();
	$.get('ajax_getvar.cmd?varName=gvtMode', function(ret) {
		accessClass = ret.split('|')[0];
		if (accessClass == 'service02') {
			$('#tab-01').find('*').prop('disabled', true);
			$('.service02').prop('disabled', false);
			$('.service02').find('*').prop('disabled', false);
		}
		else {
			$('[name=input_dns]').on('click', function() {
				if ($('#radDhcpDnsEn1').prop('checked'))
					$('.tr_custom_dns').show();
				else
					$('.tr_custom_dns').hide();
			});
		}
		$('#btnDhcpSave').on('click', function() {saveDhcpConfig();});
		$('#btnDhcpCancel').on('click', function() {loadDhcpConfig();});
		$('#btnDhcpReserve').on('click', function() {modifyDhcpStatic();});
	});

	$('.router').keypress(function(e) {
		if (e.which == 46) {
			$(this).next().select().focus();
			return false;
		}
	});

  //Port Mapping
  $('#tblPortMapping').find('tbody').find('tr').remove();
  if (64 <= numOfPortMappingForUpnp)
  {
    $('#warningPortMapping').find('strong').text(_0166);
    $('.tr_custom_portForwarding').show();
  }
  else
  {
    $('.tr_custom_portForwarding').hide();
  }
  
  var pm=$().getConvertedPortMapping(pppPortMappingList);
  $.each(pm, function(idx, val) {
    var item=null;
    var skipped=false;
    item='<tr>';
    $.each(val, function(idxInDetail, valInDetail) {
      switch(idxInDetail)
      {
        case 0: //omitted caused by it is IID
        case 7: //omitted caused by it is interface
          break;
        case 1:
          if(isPortMappingReserved(valInDetail)==true)
          {
            skipped=true;
          }
          item+='<td class="cinza">'+'<label>'+valInDetail+'</label>'+'</td>';
          break;
        case 2:
          var protocol=$('#selPortMappingProtocol>option'+'['+'value=\''+valInDetail+'\']').text();
          item+='<td class="center">'+'<label>'+protocol+'</label>'+'</td>';
          break;
        default:
          item+='<td class="center">'+'<label>'+valInDetail+'</label>'+'</td>';
          break;
      }
    });
    item+='<td class="center">';
    item+='<div class="actions">';
    item+='<a class="action edit" iid="'+(isGamesReserved(val[1])?'':val[0])+'"><img class="img-actions" src="../assets/_images/gateway/edit2.png"</a>';
    item+='<a class="action delete" intf="'+val[7]+'" iid="'+val[0]+'" name="'+val[1]+'"><img class="img-actions" src="../assets/_images/gateway/trash.png"</a>';
    item+='</div>';
    item+='</td>';
    item+='</tr>';
    if(skipped==false)
    {
      $('#tblPortMapping').find('tbody').append(item);
    }    
  });
  
  $('.edit').click(function() { editPortMapping($(this).attr('iid')); });
  $('.delete').click(function() { removePortMapping($(this).attr('intf'), $(this).attr('iid'), $(this).attr('name')); });
  
  cancelPortMapping();
  $('#aPortMappingCancel').click(function() { cancelPortMapping(); });
  $('#aPortMappingApply').click(function() { applyPortMapping(); });

  //DMZ host
  $('#aDmzHostCancel').click(function() { cancelDmzHost(); });
  $('#aDmzHostSave').click(function() { saveDmzHost(); });
  $('input[name="dmzHostState"]').change(function() { changeDmzHostState(); });
  displayDmzHost();

  
	// UPNP
	$('#radUpnpEn'+uPNP).prop('checked', true);
	$('#btnUpnpSave').on('click', function() {
		var loc = 'te_upnp.cmd?sessionKey='+ sessionKey;
		loc += '&enblUpnp=' + (($('#radUpnpEn1').prop('checked'))?'1':'0');
		//alert(loc);
		window.top.name = 'LAN:#tab-04';
		window.location = loc;
	});
	$('#btnUpnpCancel').on('click', function() {
		$('#radUpnpEn'+uPNP).prop('checked', true);
	});

  //DDNS
  $('#aDdnsCancel').click(function() { cancelDdnsCfg(); });
  $('#aDdnsSave').click(function() { saveDdnsCfg(); });
  $('input[name="ddnsState"]').change(function() { changeDdnsState(); });
    displayDdnsCfg();

});

function loadDhcpConfig() {
	$('.invalid').next('span').remove();
	$('.invalid').removeClass('invalid');
	aryStrToObj(lanIp.split('.'), $('.txtLanIp'));
	aryStrToObj(lanMask.split('.'), $('.txtLanMask'));
	aryStrToObj(dhcpStart.split('.'), $('.txtDhcpStart'));
	aryStrToObj(dhcpEnd.split('.'), $('.txtDhcpEnd'));

	if (dhcpDns == '') {
		$('#radDhcpDnsEn0').prop('checked', true);
		$('.tr_custom_dns').hide();
	}
	else {
		if (lanIp == dhcpDns) {
			$('#radDhcpDnsEn0').prop('checked', true);
			$('.tr_custom_dns').hide();
		}
		else {
			$('#radDhcpDnsEn1').prop('checked', true);
			$('.tr_custom_dns').show();
		}
		var dns = dhcpDns.split(',');
		aryStrToObj(dns[0].split('.'), $('.txtDhcpDns1'));
		if (dns.length > 1)
			aryStrToObj(dns[1].split('.'), $('.txtDhcpDns2'));
		else
			aryStrToObj('...'.split('.'), $('.txtDhcpDns2'));
	}
	$('#txtLeaseTime').val(leaseTime);
	$('#radDhcpEn'+dhcpEnbl).prop('checked', true).trigger('click');

	$('.txtLanIp, .txtLanMask').on('change', function() {
		var lanip = aryObjToStr($('.txtLanIp'), '.');
		var mask  = aryObjToStr($('.txtLanMask'), '.');
		var start = aryObjToStr($('.txtDhcpStart'), '.');
		var end   = aryObjToStr($('.txtDhcpEnd'), '.');

		start = replaceNetID(lanip, start, mask);
		end   = replaceNetID(lanip, end  , mask);
		aryStrToObj(start.split('.'), $('.txtDhcpStart'));
		aryStrToObj(end.split('.')  , $('.txtDhcpEnd'));
	});
}

function saveDhcpConfig() {
	var ng = false;
	var loc = 'settings-local-network.cgi?sessionKey='+ sessionKey;

	var lan = aryObjToStr($('.txtLanIp'), '.');
	if (!isIPv4(lan)) {
		ng = true;
		invalidMsg($('.txtLanIp'), _0172);
	}
	else {
		invalidMsg($('.txtLanIp'), '');
		loc += '&ethIpAddress='+ lan;
	}

	var mask = aryObjToStr($('.txtLanMask'), '.');
	if (!isIPv4Mask(mask)) {
		ng = true;
		invalidMsg($('.txtLanMask'), _0293);
	}
	else {
		invalidMsg($('.txtLanMask'), '');
		loc += '&ethSubnetMask='+ mask;
	}

	var dhcpEn = ($('#radDhcpEn1').prop('checked'))?'1':'0';
	loc += '&enblDhcpSrv='+ dhcpEn;
	if (dhcpEn == '0') {
		if (ng) return false;
		window.location = loc;
	}

	var ip = {start:'.txtDhcpStart', end:'.txtDhcpEnd', dns1:'.txtDhcpDns1', dns2:'.txtDhcpDns2'};
	if ($('#radDhcpDnsEn0').prop('checked') == true) {
		$(ip.dns1).val(''); $(ip.dns2).val('');
	}
	for (var n in ip) {
		var ipstr = aryObjToStr($(ip[n]), '.');
		if (ipstr == '...') ipstr = '';
		if (isIPv4(ipstr) || (ipstr=='' && (n=='dns1' || n=='dns2'))) {
			invalidMsg($(ip[n]), '');
			ip[n] = ipstr;
		}
		else {
			ng = true;
			invalidMsg($(ip[n]), _0172);
		}
	}

	var tm = $('#txtLeaseTime').val();
	if (isNaN(tm) || parseInt(tm)<1) {
		ng = true;
		invalidMsg($('#txtLeaseTime'), _0294);
	}
	else {
		invalidMsg($('#txtLeaseTime'), '');
		tm = parseInt(tm)*60;
	}

	if (ng)
	{
		invalidMsg($('#txtWarning'), _0295);
		return false;
	}
	var dns = ip.dns1;
	if (ip.dns2 != '') dns += ','+ip.dns2;

	loc += '&dhcpEthStart='+ ip.start;
	loc += '&dhcpEthEnd='+ ip.end;
	loc += '&lanHostDns='+ dns;
	loc += '&dhcpLeasedTime=' + tm;

	//alert(loc);
	window.location = loc;
}

function loadDhcpStatic() {
	//dhcpStatic = '<iid1>/<Host1>/<MAC1>/<IP1>|<iid2>/<Host2>/<MAC2>/<IP2>';
	$.get('ajax_getvar.cmd?varName=dhcpStatic', function(dhcpStatic) {
		$('#thDhcpStatic').find('img').remove();
		if (dhcpStatic == '') return;

		var staticip = dhcpStatic.split('|');
		for (var i=0; i<staticip.length; i++) {
			// info = [iid, host, mac, ip]
			var info = staticip[i].split('/');
			if (info[1]=='' || info[1]=='(null)') info[1] = '&nbsp;';

			var tr = '<tr class="staticip" iid="'+ info[0] +'" mac="'+ info[2] +'">';
			tr += '<td class="'+ ((i%2)?'cinza2 ':'cinza') +'">'+ macToHost(info[2]) +'</td>';
			tr += '<td class="'+ ((i%2)?'cinza2 ':'') +'center">'+ info[2] +'</td>';
			tr += '<td class="'+ ((i%2)?'cinza2 ':'') +'center">'+ info[3] +'</td>';
			tr += '<td class="'+ ((i%2)?'cinza2 ':'') +'center"><div class="actions">';
			tr += '    <a class="action aDhcpEdit" iid="'+ info[0] +'"><img class="img-actions" src="../assets/_images/gateway/edit2.png"/></a>';
			tr += '    <a class="action aDhcpDel"  iid="'+ info[0] +'"><img class="img-actions" src="../assets/_images/gateway/trash.png"/></a>';
			tr += '</div></td>';
			tr += '</tr>';

			$('#tblDhcpStatic tbody').append(tr);
		}

		$('.aDhcpEdit').on('click', function() {
			var iid = $(this).attr('iid');
			var td = $('.staticip[iid="'+ iid +'"]').find('td');

			invalidMsg($('#txtStaticMac'), '');
			$('#selStaticHost').val('').attr('host', $(td[0]).text());
			$('#txtStaticMac').val($(td[1]).text());
			aryStrToObj($(td[2]).text().split('.'), $('.txtStaticIp'));
			$('#spnDhcpReserve').text(_0143).attr('iid', iid).attr('edit', $(td[1]).text());
			$('#thDhcpStatic').text(_0167);
		});

		$('.aDhcpDel').on('click', function() {
			var loc = 'ajax_setvar.cmd?sessionKey='+ sessionKey;
			loc += '&varName=delDhcpStatic';
			loc += '&varValue='+ $(this).attr('iid');
			$.get(loc, function(ret) {
				//alert(ret);
				window.top.name = 'LAN:#tab-01';
				window.location.reload();
			});
		});
	});
}

var dhcpLease; // <iid1>/<Host1>/<MAC1>/<IP1>/<Time1>/<Source1>|<iid2>/<Host2>/<MAC2>/<IP2>/<Time2>/<Source2>
function macToHost(mac) {
	var ary = dhcpLease.split('/'+ mac + '/');
	return (ary.length>1) ? ary[0].split('/').pop() : '';
}
function loadDhcpLease() {
	$.get('ajax_getvar.cmd?varName=dhcpLease', function(ret) {
		$('#thDhcpLease').find('img').remove();
		dhcpLease = ret;
		if (dhcpLease != '') {
			var leaseip = dhcpLease.split('|');
			for (var i=0; i<leaseip.length; i++) {
				// info = [iid, host, mac, ip, time]
				var info = leaseip[i].split('/');
				if (info[1]=='' || info[1]=='(null)') info[1] = '&nbsp;';
				
				//B##17532,20190507,Tank,Not to shown when leasetime is 0.
				if(info[4] != '0')
				{
					var tr = '<tr class="trLease" iid="'+ info[0] +'">';
					tr += '<td class="'+ ((i%2)?'cinza2':'cinza') +  '">'+ info[1] +'</td>';
					tr += '<td class="'+ ((i%2)?'cinza2 ':'') +'center">'+ info[2] +'</td>';
					tr += '<td class="'+ ((i%2)?'cinza2 ':'') +'center">'+ info[3] +'</td>';
					tr += '<td class="'+ ((i%2)?'cinza2 ':'') +'center">'+ parseInt(info[4]/60) +' min</td>';
					tr += '</tr>';
					$('#tblDhcpLease tbody').append(tr);

					if (info[1] == '&nbsp;') info[1] = info[2];
					var opt = '<option value="'+ info[0] +'">'+ info[1] +'</option>';
					$('#selStaticHost').append(opt);
				}
			}

			$('#selStaticHost').val('');
			$('#selStaticHost').on('change', function() {
				var td = $('.trLease[iid="'+ $(this).val() +'"]').find('td');
				invalidMsg($('#txtStaticMac'), '');
				$('#selStaticHost').attr('host', $('#selStaticHost').find('option:selected').html());
				$('#txtStaticMac').val($(td[1]).text());
				aryStrToObj($(td[2]).text().split('.'), $('.txtStaticIp'));
				$('.txtStaticIp').last().select().focus();
				$('#spnDhcpReserve').text(_0168).attr('iid', '').attr('edit', '');
				$('#thDhcpStatic').text(_0169);
			});
		}

		loadDhcpStatic();
		$('#thDhcp').find('img').remove();
	});
}

function modifyDhcpStatic() {
	var ng = false;
	var host = $('#selStaticHost').attr('host');
	if (host == '&nbsp;') host = '';
	if (isXSS(host) || /[/|]/.test(host)) {
		ng = true;
		invalidMsg($('#selStaticHost'), _0170);
	}
	else {
		invalidMsg($('#selStaticHost'), '');
	}

	var mac = $('#txtStaticMac').val();
	if (!isMacAddr(mac)) {
		ng = true;
		invalidMsg($('#txtStaticMac'), _0171);
	}
	else {
		invalidMsg($('#txtStaticMac'), '');
		mac = mac.replace('-', ':').toUpperCase();
		$('#txtStaticMac').val(mac);
	}

	var ip = aryObjToStr($('.txtStaticIp'), '.');
	if (!isIPv4(ip)) {
		ng = true;
		invalidMsg($('.txtStaticIp'), _0172);
	}
	else if (strIP2Num(ip)<strIP2Num(dhcpStart) || strIP2Num(ip)>strIP2Num(dhcpEnd)) {
		ng = true;
		invalidMsg($('.txtStaticIp'), _0173);
	}
	else {
		invalidMsg($('.txtStaticIp'), '');
	}

	var edit = $('#spnDhcpReserve').attr('edit');
	var dup = $('.staticip').find('td:eq(1):contains("'+ mac +'")');
	if (dup.length > 0) {
		if (mac=='' || dup.parent('tr').attr('mac')!=edit) {
			invalidMsg($('#txtStaticMac'), _0223);
			return false;
		}
	}

	if (ng) return false;
	var loc = 'ajax_setvar.cmd?sessionKey='+ sessionKey;
	loc += '&varName=modDhcpStatic';
	loc += '&varValue='+ $('#spnDhcpReserve').attr('iid');
	loc += '/'+ encodeURIComponent(host);
	loc += '/'+ mac +'/'+ ip;
	$.get(loc, function(ret) {
		//alert(ret);
		window.top.name = 'LAN:#tab-01';
		window.location.reload();
	});
}

function isGamesReserved(desc)
{
  return desc.indexOf(GAMES_PREPENDED_DESCRIPTION)==0?true:false;
}

function isManageableDevice(addr)
{
  var found=false;
  var devList=$().getConvertedManageableDevice(mngHostList);
  $.each(devList, function(idx, val){
    if(val==addr)
    {
      found=true;
      return false; //the same as break
    }
  });

  if (!found) {
    devList=$().getConvertedManageableDevice(virtualHostList);
    $.each(devList, function(idx, val){
      if(val==addr)
      {
        found=true;
        return false; //the same as break
      }
    });
  }
  return found;
}

function isPortMappingReserved(desc)
{
  return desc.indexOf('GVT_PINHOLE')>=0?true:false;
}

function isPortMappingRanging(eps, epe, ips)
{
  var epsr=(eps>0&&eps<65536)?true:false;
  var eper=(epe>=0&&epe<65536)?true:false;
  var epr=((eps<=epe)||(epe==0))?true:false;
  var ipsr=(ips>0&&ips<65536)?true:false;
  var ipr=(((epe-eps)>0&&((epe-eps)+ips)<65536)||((epe-eps)==0)||(epe==0))?true:false;
  return (epsr==true&&eper==true&&epr==true&&ipsr==true&&ipr==true)?true:false;
}

function isPortMappingDuplicated(intf, name, iid)
{
  iid = typeof iid !== 'undefined' ? iid : ''; //i.e. default value
  //alert(([intf, name, iid]).join('\n'));
	var found=false;
  var chk=[$().getConvertedPortMapping(pppPortMappingList)];
  for( var i=0; i<chk.length; i++)
  {
    var existing=chk[i];
  	for( var j=0; j<existing.length; j++ )
  	{
  		if( existing[j][7]==intf && existing[j][1]==name && existing[j][0]!=iid )
  		{
  			found=true;

  			break;
  		}
  	} //end for
  } //end for
	return found;
}

function isPortMappingOverlapped(intf, vrtsrv, prot, eps, epe, ips, iid)
{
  iid = typeof iid !== 'undefined' ? iid : ''; //i.e. default value
  //alert(([intf, vrtsrv, prot, eps, epe, ips, iid]).join('\n'));
	var oeps=eps;
	var oepe=(epe==0)?(oeps):(epe);
	var oips=ips;
	var oipe=(oepe>=oeps)?(oepe-oeps+oips):(oips);
	var found=false;
	var overlapped=false;
  var different=false;

  var prevent=[
    ['', 'TCP', '7547', '7547', '7547', '', '', intf]
  ];
  var chk=[prevent, $().getComparablePortMapping(pppPortMappingList)];

  for( var i=0; i<chk.length; i++)
  {
    var existing=chk[i];
  	for( var j=0; j<existing.length; j++ )
  	{
  		if( existing[j][7]==intf )
  		{
  			found=true;

        var needCheck=false;
        needCheck=(existing[j][1]==prot)?(true):((existing[j][1]=='BOTH'||prot=='BOTH')?true:false);
        if(needCheck==false)
        {
          continue;
        }
        needCheck=(iid==existing[j][0]&&iid!='')?false:true; //i.e. self
        if(needCheck==false)
        {
          continue;
        }
  
  			var ceps=parseInt(existing[j][2]);
  			var cepe=(parseInt(existing[j][3])==0)?(ceps):(parseInt(existing[j][3]));
  			var cips=parseInt(existing[j][4]);
  			var cipe=(cepe>=ceps)?(cepe-ceps+cips):(cips);
  			//alert("ORG:\t"+oeps+" "+oepe+" "+oips+" "+oipe+"\n"+"CMP:\t"+ceps+" "+cepe+" "+cips+" "+cipe+" "+"["+j+"]"+"\t"+intf);
  			if( (oeps<=ceps && oepe>=cepe) || (oeps>=ceps && oeps<=cepe) || (oepe<=cepe && oepe>=ceps) )
  			{
  				overlapped=true;
          different=(existing[j][5]==vrtsrv)?false:true;
  				break;
  			}
  		}
  	} //end for
  } //end for
  var ret ={state:(found==true&&overlapped==true)?true:false, different:(different)};
	return ret;
}

function applyPortMapping()
{
  var fmterr=false;

  if (80 <= numOfPortMappingForStatic)
  {
    $('#lblPortMappingFormat').find('strong').text(_0174);
    return;
  }

  //[GVT] Port forward should not be allowed for STB from the GUI
  var manageableDevice = manageableDeviceList.split(',');
  for( var i=0; i<manageableDevice.length; i++ )
  {
    if (manageableDevice[i] == $('#txtPortMappingInternalClient').val())
    {
      $('#lblPortMappingFormat').find('strong').text(_0292);
      return;
    }
  }

  if( isXSS($('#txtPortMappingDescription').val()) || ($('#txtPortMappingDescription').val()).indexOf('/')>0 || ($('#txtPortMappingDescription').val()).indexOf(',')>0 )
  {
    fmterr=true;
  }
  else if( ($('#txtPortMappingRemoteHost').val()).length>0 && !isIPv4($('#txtPortMappingRemoteHost').val()) )
  {
    fmterr=true;
  }
  else if( !isIPv4($('#txtPortMappingInternalClient').val()) )
  {
    fmterr=true;
  }
  else if( !isNumber($('#txtPortMappingInternalPort').val()) )
  {
    fmterr=true;
  }
  else if( !( ( (($('#txtPortMappingExternalPort').val()).split(':').length==2)&&isNumber(($('#txtPortMappingExternalPort').val()).split(':')[0])==true&&isNumber(($('#txtPortMappingExternalPort').val()).split(':')[1])==true ) ||
    (isNumber($('#txtPortMappingExternalPort').val())==true))
  )
  {
    fmterr=true;
  }

  if(fmterr==true)
  {
    $('#lblPortMappingFormat').find('strong').text(_0176);
    return;
  }
  else
  {
    $('#lblPortMappingFormat').find('strong').text('');
  }
  
  var en='T';
  var addr=$('#txtPortMappingInternalClient').val();
  var pi=$('#txtPortMappingInternalPort').val();
  var pe=$('#txtPortMappingExternalPort').val();
  var pestart=(pe.indexOf(':')>0)?(pe.split(':')[0]):(pe);
  var perange=(pe.indexOf(':')>0)?(pe.split(':')[1]):('0');
  var prot=null;
  switch($('#selPortMappingProtocol').val())
  {
    case 'TCP': prot='TCP'; break;
    case 'UDP': prot='UDP'; break;
    default: prot='BOTH'; break;
  } //end switch case
  var desc=$('#txtPortMappingDescription').val();
  var remoteaddr=$('#txtPortMappingRemoteHost').val();

  var net=(getNetID(lanIp, lanMask)==getNetID(addr, lanMask)?true:false)&&(lanIp!=addr);
  var wan=(getNetID(lanIp, lanMask)!=getNetID(remoteaddr, lanMask))?true:false;
  if(net==false || wan==false)
  {
    $('#lblPortMappingFormat').find('strong').text(_0172);
    return;
  }
  else
  {
    $('#lblPortMappingFormat').find('strong').text('');
  }

  var synerr=false; //synthesis error
  do
  {
    var iid=$('#ttlPortMapping').prop('instance');
    var isEditing=(iid=='')?false:true;
    if(isEditing==true)
    {
      var intf=$('#ttlPortMapping').prop('interface');

      var prependedDesc=(desc.indexOf(PPP_PORT_MAPPING_PREPENDED_DESCRIPTION)==0?(desc):(PPP_PORT_MAPPING_PREPENDED_DESCRIPTION+desc));
      var prg=isPortMappingRanging(parseInt(pestart), parseInt(perange), parseInt(pi));
      var ovl=isPortMappingOverlapped(intf, addr, prot, pestart, perange, pi, iid);
      var dup=isPortMappingDuplicated(intf, prependedDesc, iid);
      var rsv=isPortMappingReserved(desc)||isGamesReserved(desc);
      if(prg==false||ovl.state==true||dup==true||rsv==true)
      {
        synerr=true;
        break;
      }
      var mutated=[iid, prependedDesc, prot, addr, pestart, perange, pi, en, intf, remoteaddr];

      var loc = 'te_ppp_pm.cmd?action=update';
      loc += '&inst='+mutated.join(',');
      loc += '&sessionKey='+sessionKey;
      //alert(loc);
      $.ajax({type:"GET", url:loc, async:false, success: function(result){
        window.top.name = 'LAN:#tab-02';
        window.location.reload();
      }});
    }
    else
    {
      var ifname="";
      var intf=$().getConvertedInterface(pppPortMappingIntf);
      if(intf.length>0 && intf[0].length>=2 && intf[0][1].length>0 ) ifname=intf[0][1];

      var prependedDesc=(desc.indexOf(PPP_PORT_MAPPING_PREPENDED_DESCRIPTION)==0?(desc):(PPP_PORT_MAPPING_PREPENDED_DESCRIPTION+desc));
      var prg=isPortMappingRanging(parseInt(pestart), parseInt(perange), parseInt(pi));
      var ovl=isPortMappingOverlapped(ifname, addr, prot, pestart, perange, pi);
      var dup=isPortMappingDuplicated(ifname, prependedDesc);
      var rsv=isPortMappingReserved(desc)||isGamesReserved(desc);
      if(prg==false||ovl.state==true||dup==true||rsv==true)
      {
        synerr=true;
        break;
      }
      var mutated=[prependedDesc, prot, addr, pestart, perange, pi, en, ifname, remoteaddr];

      var loc = 'te_ppp_pm.cmd?action=create';
      loc += '&inst='+mutated.join(',');
      loc += '&sessionKey='+sessionKey;
      //alert(loc);
      $.ajax({type:"GET", url:loc, async:false, success: function(result){
        window.top.name = 'LAN:#tab-02';
        window.location.reload();
      }});
    }
  } while(false);

  if(synerr==true)
  {
    $('#lblPortMappingFormat').find('strong').text(_0177);
    return;
  }
  else
  {
    $('#lblPortMappingFormat').find('strong').text('');
  }
}

function cancelPortMapping()
{
  $('#lblPortMappingFormat').find('strong').text('');
  $('#ttlPortMapping').prop("instance", '');
  $('#ttlPortMapping').prop("interface", '');
  $('#txtPortMappingDescription').val('');
  $('#selPortMappingProtocol').val('');
  $('#txtPortMappingExternalPort').val('');
  $('#txtPortMappingInternalPort').val('');
  $('#txtPortMappingRemoteHost').val('');
  $('#txtPortMappingInternalClient').val('');
  $('#aPortMappingApply').find('span').text(_0114);
}

function editPortMapping(iid)
{
  $('#ttlPortMapping').prop("instance", iid);
  $('#aPortMappingApply').find('span').text(_0068);
  var found=false;
  var pm=$().getConvertedPortMapping(pppPortMappingList);
  $.each(pm, function(idx, val) {
    if( val[0]==iid )
    {
      $('#txtPortMappingDescription').val(val[1]);
      $('#selPortMappingProtocol').val(val[2]);
      $('#txtPortMappingExternalPort').val(val[3]);
      $('#txtPortMappingInternalPort').val(val[4]);
      $('#txtPortMappingRemoteHost').val(val[5]);
      $('#txtPortMappingInternalClient').val(val[6]);;
      $('#ttlPortMapping').prop("interface", val[7]);
      found=true;

      return false; //the same as break
    }
  });
  if(found==false)
  {
    cancelPortMapping();
  }
}

function removePortMapping(intf, iid)
{
  var loc = 'te_ppp_pm.cmd?action=delete';
  loc += '&id='+iid;
  if(intf!=null) loc += '&intf='+intf;
  loc += '&sessionKey='+sessionKey;
  //alert(loc);
  $.ajax({type:"GET", url:loc, async:false, success: function(result){
    window.top.name = 'LAN:#tab-02';
    window.location.reload();
  }});
}

function displayDmzHost()
{
  var dmzHostState=(dmzHostEnable=='GVT')?((dmzHostAddress=='')?false:true):((dmzHostEnable=='on')?true:false);
  $('input[name="dmzHostState"][value="'+ ((dmzHostState)?'on':'off') +'"]').prop('checked', true);

  if(dmzHostState==true)
  {
    $('#txtDmzHostAddress').val(dmzHostAddress);
    $('#txtDmzHostAddress').prop('disabled', false);
  }
  else
  {
    if(dmzHostEnable!='GVT')
      {$('#txtDmzHostAddress').val(dmzHostAddress);}
    else
      {$('#txtDmzHostAddress').val('');}
    $('#txtDmzHostAddress').prop('disabled', true);
  }
  invalidMsg( $('#txtDmzHostAddress'), '' );
}

function saveDmzHost()
{
  var addr=$('#txtDmzHostAddress').val();
  var currentDmzHostState=$('input[name="dmzHostState"]:checked').val();
  var net=(getNetID(lanIp, lanMask)==getNetID(addr, lanMask)?true:false)&&(lanIp!=addr)&&(!isManageableDevice(addr));
  var offEmpty=(currentDmzHostState=='off' && addr=='')?true:false;

  if ((dmzHostEnable!='GVT')?(net==true || offEmpty==true):( (currentDmzHostState=='on' && net==true) || (currentDmzHostState=='off') ))
  {
    invalidMsg( $('#txtDmzHostAddress'), '' );
    if(dmzHostEnable=='GVT' && currentDmzHostState=='off') addr = '';

    var loc = 'ajax_setvar.cmd?sessionKey='+ sessionKey;
    loc += '&varName=saveDmzHost';
    loc += '&varValue='+ addr;
    $.get(loc, function(ret) {
      //alert(ret);
      window.top.name = 'LAN:#tab-03';
      if(dmzHostEnable=='GVT')
      {
        window.location.reload();
      }
    });

    if(dmzHostEnable!='GVT')
    {
      var loc = 'ajax_setvar.cmd?sessionKey='+ sessionKey;
      loc += '&varName=saveDmzEnable';
      loc += '&varValue='+ currentDmzHostState;
      $.get(loc, function(ret) {
        //alert(ret);
        window.top.name = 'LAN:#tab-03';
        window.location.reload();
      });
    }
  }
  else
  {
    invalidMsg( $('#txtDmzHostAddress'), _0172);
    return;
  }
}

function cancelDmzHost()
{
  displayDmzHost();
}

function changeDmzHostState()
{
  var currentDmzHostState=$('input[name="dmzHostState"]:checked').val();
  $('#txtDmzHostAddress').prop('disabled', (currentDmzHostState=='on')?false:true);
}

jQuery.fn.extend({
  getConvertedInterface: function(raw) {
    var intf=[];
    var outer=raw.split(";");
    for(var i=0; i<outer.length; i++ )
    {
      intf[i]=[];
      var inner=outer[i];
      inner=inner.split(',');
      for( var j=0; j<inner.length; j++ )
      {
        intf[i][j]=inner[j];
      } //end for
    } //end for
    return intf;
  }
});

jQuery.fn.extend({
  getComparablePortMapping: function(pmList) {
    var converted=[];
    var convertedTmp=pmList.split("/");
    $.each(convertedTmp, function(idx, val) {
      if(val.length>0)
      {
        var pmItem=val.split(",");
        var iid=pmItem[0];
        var name=pmItem[1];
        var protocol=pmItem[2];
        var remote=pmItem[4];
        var internal=pmItem[3];
        var eps=pmItem[5];
        var epe=pmItem[6];
        var ips=pmItem[7];
        var en=pmItem[8]=='T'?true:false;
        var intf=pmItem[9];

        var item=[iid, protocol, eps, epe, ips, internal, remote, intf];
        converted.push( item );
      }
    });
    
    return converted;
  }
});

jQuery.fn.extend({
  getConvertedPortMapping: function(pmList) {
    var converted=[];
    var convertedTmp=pmList.split("/");
    $.each(convertedTmp, function(idx, val) {
      if(val.length>0)
      {
        var pmItem=val.split(",");
        var iid=pmItem[0];
        var name=pmItem[1];
        var protocol=null;
        switch(pmItem[2].toUpperCase())
        {
          case "TCP": protocol="TCP"; break;
          case "UDP": protocol="UDP"; break;
          default: protocol="All";
        }
        var remote=pmItem[4];
        var internal=pmItem[3];
        var eps=pmItem[5];
        var epe=pmItem[6];
        var ips=pmItem[7];
        var en=pmItem[8]=='T'?true:false;
        var intf=pmItem[9];
        var pr=(epe=='0'||epe==eps)?(eps):(eps+":"+epe);
        var item=[iid, name, protocol, pr, ips, remote, internal, intf];
        converted.push( item );
      }
    });
    
    return converted;
  }
});

jQuery.fn.extend({
  getConvertedManageableDevice: function(mngDevList) {
    var converted=[];
    var convertedTmp=mngDevList.split("|");
    $.each(convertedTmp, function(idx, val) {
      if(val.length>0)
      {
        var mngDevItem=val.split("/");
        var item=mngDevItem[3];
        converted.push( item );
      }
    });
    
    return converted;
  }
});

//DDNS -- start
function displayDdnsCfg()
{
	//ddnsInfo = '<enable>|<hostname>|<user>|<password>|<provider>|<status>';
	var ddns = ddnsInfo.split('|');
	ddns[1] = htmlDecode(ddns[1]);
	ddns[2] = htmlDecode(ddns[2]);
	ddns[3] = htmlDecode(ddns[3]);

	//Enable/Disable
    $('#idDdnsState[value='+ddns[0]+'],#idDdnsState[value='+ddns[0]+']').click();

	//Provider
	if (ddns[4] == '0') //DynDNS
	{
        $('#idDdnsProvider>option[value=dyndns]').prop('selected',true);
	}
	else if (ddns[4] == '1') //NO-IP
	{
        $('#idDdnsProvider>option[value=no-ip]').prop('selected',true);
	}

	$('#idDdnsHostName').val(ddns[1]);
	$('#idDdnsUsername').val(ddns[2]);
	$('#idDdnsPwd').val(ddns[3]);
}

function saveDdnsCfg()
{
	var loc = 'ddnsmngr.cmd?action=modify_gvt';
	var ddnsState = $('input[name="ddnsState"]:checked').val();
	var ng = false;

	//Provider
	if ($('#idDdnsProvider').val() == "dyndns")
		loc += '&service=0';
	else if ($('#idDdnsProvider').val() == "no-ip")
		loc += '&service=1';

	//Enable/Disable
	if ( ddnsState == false ) {
		loc += '&enable=0';
		if ($('#idDdnsUsername').val() == '')
			loc += '&username=(null)';
		if ($('#idDdnsPwd').val() == '')
			loc += '&password=(null)';
		if ($('#idDdnsHostName').val() == '')
			loc += '&hostname=(null)';
	}
	else
	{
		loc += '&enable=1';

		//Username
		if ($('#idDdnsUsername').val() == '') {
			invalidMsg( $('#idDdnsUsername'), _0178 );
			ng = true;
		}
		else if (isXSS($('#idDdnsUsername').val())) {
			invalidMsg( $('#idDdnsUsername'), 'Cross-site Scripting (XSS)' );
			ng = true;
		}
		else {
			invalidMsg( $('#idDdnsUsername'), '' );
			loc += '&username=' + encodeURIComponent($('#idDdnsUsername').val());
		}

		//Password
		if ($('#idDdnsPwd').val() == '') {
			invalidMsg( $('#idDdnsPwd'), _0179 );
			ng = true;
		}
		else if (isXSS($('#idDdnsPwd').val())) {
			invalidMsg( $('#idDdnsPwd'), 'Cross-site Scripting (XSS)' );
			ng = true;
		}
		else {
			invalidMsg($('#idDdnsPwd'), '');
			loc += '&password=' + encodeURIComponent($('#idDdnsPwd').val());
		}

		//Host Name
		if ($('#idDdnsHostName').val() == '') {
			invalidMsg( $('#idDdnsHostName'), _0180 );
			ng = true;
		}
		else if (isXSS($('#idDdnsHostName').val())) {
			invalidMsg($('#idDdnsHostName'), 'Cross-site Scripting (XSS)');
			ng = true;
		}
		else {
			invalidMsg($('#idDdnsHostName'), '');
			loc += '&hostname=' + encodeURIComponent($('#idDdnsHostName').val());
		}
	}

	if (ng) return false;

	loc += '&sessionKey=' + sessionKey;
	$.get(loc, function(ret) {
		//alert(ret);
		window.top.name = 'LAN:#tab-05';
		window.location.reload();
	});
}

function cancelDdnsCfg()
{
  displayDdnsCfg();
}

function changeDdnsState()
{
  var currDdnsState = $('input[name="ddnsState"]:checked').val();
  if(currDdnsState == '1')
  {
    $('#idDdnsProvider').prop('disabled', false);
    $('#idDdnsUsername').prop('disabled', false);
    $('#idDdnsPwd').prop('disabled', false);
    $('#idDdnsHostName').prop('disabled', false);
  }
  else
  {
    $('#idDdnsProvider').prop('disabled', true);
    $('#idDdnsUsername').prop('disabled', true);
    $('#idDdnsPwd').prop('disabled', true);
    $('#idDdnsHostName').prop('disabled', true);
  };
}

//DDNS - end
