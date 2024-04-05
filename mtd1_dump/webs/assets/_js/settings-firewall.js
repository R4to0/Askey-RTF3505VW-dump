


$(window).load(function() {
    //firewall

    var accessClass = gvtMode.split('|')[0];
    /*if (accessClass == 'service02') {
        var firewall = document.getElementById("firewall");
        firewall.style.display = "none";
    }*/	//RM11739

	$('#accordion a.item').click(function () {
		window.top.name = '';
		$('#accordion li').children('ul').slideUp('fast');
		$('#accordion a').removeClass('active');
		$(this).addClass('active');
		$(this).siblings('ul').slideDown('fast');
		return false;
	});
	$('.configuracoes').trigger('click');

  $('#selFirewallAction').change(function () {
    $('#imgAction').html('<img src="../assets/_images/gateway/'+this.value+'.png" '+'alt="'+((this.value==null||this.value=="")?'undetermined':this.value)+'"'+'>');
  });

  $('#selFirewallProtocol').change(function () {
    if( $().isPortAvailable(this.value, false)==false )
    {
      $('#txtFirewallLocalPort').prop('disabled', true);
      $('#txtFirewallRemotePort').prop('disabled', true);
    }
    else
    {
      $('#txtFirewallLocalPort').prop('disabled', '');
      $('#txtFirewallRemotePort').prop('disabled', '');
    }
  });
  gFirewallInterfaceList=$().getPreloadedInterface(firewallInterfaceList);
  var idxList=$().getConvertedFirewallIndexList(firewallRuleIndexList);
  var tmpFwl=[];
  var rspCnt=0;
  if(firewallRuleIndexList=='')
  {
    gFirewallRuleList=[];
    showFirewall();
    $('#divFirewallQuantity').attr('title', '0');
    $('.setupWifiTable').show();
    $('#tblProgress').hide();
  }
  else
  {
    $.each(idxList, function(idx, val){
      var mutated=[val];
      var loc = 'gvt_firewall.cmd?action=show';
      loc += '&inst='+mutated.join(',');
      //loc += '&sessionKey='+sessionKey;
      //alert(loc);
      $.ajax({type:"GET", url:loc, async:true, success: function(result) {
        var response=[];
        var outer=result.split('&');
        for( var i=0; i<outer.length; i++ )
        {
          var inner=outer[i].split('=');
          switch( inner[0] )
          {
            //case 'sessionKey':
            //  sessionKey=inner[1];
            //  response['sessionKey']=sessionKey;
            //  break;
            case 'inst':
              response['inst']=inner[1].split(',');
              break;
            default:
              break;
          } //end for
        } //end for
        tmpFwl[idx]=response['inst'];
        rspCnt++;

        if(rspCnt>=idxList.length)
        {
          firewallRuleList=tmpFwl.join('|');
          var fwl=$().getConvertedFirewallRule(firewallRuleList);
          gFirewallRuleList=getViewableFirewallRule(gFirewallInterfaceList, fwl);
          showFirewall();
          $('#divFirewallQuantity').attr('title', fwl.length);
          $('.setupWifiTable').show();
          $('#tblProgress').hide();
        }
      }});
    });
  }

  cancelFirewall();
  $('#aFirewallCancel').click(function() { cancelFirewall(); });
  $('#aFirewallApply').click(function() { applyFirewall(); });
});


$(document).ready(function () {
	$('#divFirewallQuantity').attr('title', '0');
	$('.setupWifiTable').hide();
	$('#tblProgress').show();
	$('.configuracoes').trigger('click');
});

function editFirewall(chnId, ruleId)
{
  //alert("edit\t"+chnId+"\t"+ruleId+"");
  $.each(gFirewallRuleList, function(idx, val){
    if(val.chnId==chnId && val.ruleId==ruleId)
    {
      $('#ttlFirewall').prop("chnId", chnId);
      $('#ttlFirewall').prop("ruleId", ruleId);
      $('#txtFirewallName').val(val.name);
      $('#txtFirewallLocalPort').val(val.localPort);
      $('#txtFirewallRemotePort').val(val.remotePort);
      $('#txtFirewallLocalAddress').val(val.localAddress.length==0?'*':val.localAddress);
      $('#txtFirewallRemoteAddress').val(val.remoteAddress.length==0?'*':val.remoteAddress);
      $('#lblFirewallOperation').text('Edit an existing rule');
      $('#selFirewallProtocol').val(val.protocol);
      $('#selFirewallProtocol').change();
      if($('#selFirewallAction > option'+'[value='+val.action+']').length==0)
      {
        $.each(hiddenViewableAction, function(idxInDetail, valInDetail){
          $('#selFirewallAction').append( $('<option/>').attr('disabled', true).attr('value', valInDetail.img).text(valInDetail.str) );
        });
      }
      else
      {
        var found=false;
        $.each(hiddenViewableAction, function(idxInDetail, valInDetail){
          if(valInDetail.img==val.action)
          {
            found=true;
            return false; //the same as break
          }
        });
        if(found==false)
        {
          $.each(hiddenViewableAction, function(idxInDetail, valInDetail){
            $('#selFirewallAction > option'+'[value='+valInDetail.img+']').remove();
          });
        }
      }
      $('#selFirewallAction').val(val.action);
      $('#selFirewallAction').change();
      $('#aFirewallApply').find('span').text(_0068);

      invalidMsg( $('#txtFirewallRemoteAddress'), '' );
      invalidMsg( $('#txtFirewallLocalAddress'), '' );
      invalidMsg( $('#txtFirewallRemotePort'), '' );
      invalidMsg( $('#txtFirewallLocalPort'), '' );
      return false; //the same as break
    }
  });
}

function removeFirewall(chnId, ruleId)
{
  var loc = 'gvt_firewall.cmd?action=delete';
  var mutated=[ruleId];
  loc += '&inst='+mutated.join(',');
  loc += '&sessionKey='+sessionKey;
  //alert(loc);
  $.ajax({type:"GET", url:loc, async:false, success: function(result){
    //alert(result);
    window.top.location.reload();
  }});
}

function upgradeFirewall(chnId, ruleId)
{
  adjustFirewall( chnId, ruleId, true);
}

function downgradeFirewall(chnId, ruleId)
{
  adjustFirewall( chnId, ruleId, false);
}

function cancelFirewall()
{
  $('#ttlFirewall').prop("chnId", '');
  $('#ttlFirewall').prop("ruleId", '');
  $('#txtFirewallName').val('');
  $('#txtFirewallLocalPort').val('');
  $('#txtFirewallRemotePort').val('');
  $('#txtFirewallLocalAddress').val('');
  $('#txtFirewallRemoteAddress').val('');
  $('#selFirewallProtocol').val('All');
  $('#selFirewallProtocol').change();
  $.each(hiddenViewableAction, function(idx, val){
    $('#selFirewallAction > option'+'[value='+val.img+']').remove();
  });
  $('#selFirewallAction').val('acptRemote');
  $('#selFirewallAction').change();
  $('#aFirewallApply').find('span').text(_0114);
  $('#lblFirewallOperation').text(_0115);
}

function applyFirewall()
{
  var chnId=$('#ttlFirewall').prop('chnId');
  var ruleId=$('#ttlFirewall').prop('ruleId');
  var isEditing=(chnId!=''&&ruleId!='')?true:false;

  var currentName=$('#txtFirewallName').val();
  var currentProtocol=$('#selFirewallProtocol').val();
  var currentLocalPort=$('#txtFirewallLocalPort').val();
  var currentRemotePort=$('#txtFirewallRemotePort').val();
  var currentLocalAddress=$('#txtFirewallLocalAddress').val();
  var currentRemoteAddress=$('#txtFirewallRemoteAddress').val();
  var currentAction=$('#selFirewallAction option:selected').val();

  var currentRemotePortBegin=null;
  var currentRemotePortEnd=null;
  var currentRemotePortQty=currentRemotePort.split(':').length;
  switch(currentRemotePortQty)
  {
    case 2:
      currentRemotePortBegin=currentRemotePort.split(':')[0];
      currentRemotePortEnd=currentRemotePort.split(':')[1];
      break;
    case 1:
    default:
      currentRemotePortBegin=currentRemotePort;
      break;
  } //end switch case

  var currentLocalPortBegin=null;
  var currentLocalPortEnd=null;
  var currentLocalPortQty=currentLocalPort.split(':').length;
  switch(currentLocalPortQty)
  {
    case 2:
      currentLocalPortBegin=currentLocalPort.split(':')[0];
      currentLocalPortEnd=currentLocalPort.split(':')[1];
      break;
    case 1:
    default:
      currentLocalPortBegin=currentLocalPort;
      break;
  } //end switch case
  
  var fmterr=false;
  invalidMsg( $('#txtFirewallName'), '' );
  invalidMsg( $('#txtFirewallRemoteAddress'), '' );
  invalidMsg( $('#txtFirewallLocalAddress'), '' );
  invalidMsg( $('#txtFirewallRemotePort'), '' );
  invalidMsg( $('#txtFirewallLocalPort'), '' );
  if(isFirewallReserved(currentName)==true)
  {
    invalidMsg( $('#txtFirewallName'), _0116 );
    fmterr=true;
  }  
  if( isXSS(currentName) || (currentName).indexOf('|')>0 || (currentName).indexOf(',')>0 )
  {
    invalidMsg( $('#txtFirewallName'), _0116 );
    fmterr=true;
  }
  if( currentRemoteAddress!='*' && !isValidAddress(currentRemoteAddress, "Remote") )
  {
    invalidMsg( $('#txtFirewallRemoteAddress'), _0117 );
    fmterr=true;
  }
  if( currentLocalAddress!='*' && !isValidAddress(currentLocalAddress, "Local") )
  {
    invalidMsg( $('#txtFirewallLocalAddress'), _0117 );
    fmterr=true;
  }
  if( $().isPortAvailable(currentProtocol, false)==true &&
    !(( currentRemotePortQty==2&&isNumber(currentRemotePortBegin)==true&&isNumber(currentRemotePortEnd)==true&&((currentRemotePortBegin<7547&&currentRemotePortEnd<7547)||(currentRemotePortBegin>7547&&currentRemotePortEnd>7547))) ||
    ( currentRemotePortQty==1 && isNumber(currentRemotePortBegin)==true&& currentRemotePortBegin!=7547) ||
    currentRemotePortBegin.length==0 )
  )
  {
    invalidMsg( $('#txtFirewallRemotePort'), _0118 );
    fmterr=true;
  }
  if( $().isPortAvailable(currentProtocol, false)==true &&
    !(( currentLocalPortQty==2&&isNumber(currentLocalPortBegin)==true&&isNumber(currentLocalPortEnd)==true&&((currentLocalPortBegin<7547&&currentLocalPortEnd<7547)||(currentLocalPortBegin>7547&&currentLocalPortEnd>7547))) ||
    ( currentLocalPortQty==1 && isNumber(currentLocalPortBegin)==true&&currentLocalPortBegin!=7547) ||
    currentLocalPortBegin.length==0 )
  )
  {
    invalidMsg( $('#txtFirewallLocalPort'), _0118 );
    fmterr=true;
  }
  var remoteAddressVer=(currentRemoteAddress=='*')?(-1):(getVersionBelongs(currentRemoteAddress));
  var localAddressVer=(currentLocalAddress=='*')?(-1):(getVersionBelongs(currentLocalAddress));
  var compatiableVer=(remoteAddressVer!=0&&currentLocalAddress!=0)&&
    ((remoteAddressVer==localAddressVer)||(remoteAddressVer==-1)||(localAddressVer==-1));
  var compromiseVer=-1;
  if( fmterr==false && compatiableVer==false )
  {
    invalidMsg( $('#txtFirewallRemoteAddress'), _0119 );
    invalidMsg( $('#txtFirewallLocalAddress'), _0119 );
    fmterr=true;
  }
  else
  {
    if((remoteAddressVer==localAddressVer)) compromiseVer=remoteAddressVer;
    else if(localAddressVer==-1) compromiseVer=remoteAddressVer;
    else compromiseVer=localAddressVer;
  }
  
  if(fmterr==true)
  {
    return;
  }

  var translatedAction=null;
  var translatedSrcIntf=null;
  var translatedDstIntf=null;
  var isFromLan=null;
  switch(currentAction)
  {
    case "acptLocal":
      translatedAction="Accept";
      translatedSrcIntf=$().getPreloadedInterfaceObject(gFirewallInterfaceList, "LAN");
      translatedDstIntf=$().getPreloadedInterfaceObject(gFirewallInterfaceList, "WAN");
      isFromLan=true;
      break;
    case "acptRemote":
      translatedAction="Accept";
      translatedSrcIntf=$().getPreloadedInterfaceObject(gFirewallInterfaceList, "WAN");
      translatedDstIntf=$().getPreloadedInterfaceObject(gFirewallInterfaceList, "LAN");
      isFromLan=false;
      break;
    case "rjctLocal":
      translatedAction="Drop";
      translatedSrcIntf=$().getPreloadedInterfaceObject(gFirewallInterfaceList, "LAN");
      translatedDstIntf=$().getPreloadedInterfaceObject(gFirewallInterfaceList, "WAN");
      isFromLan=true;
      break;
    case "rjctRemote":
      translatedAction="Drop";
      translatedSrcIntf=$().getPreloadedInterfaceObject(gFirewallInterfaceList, "WAN");
      translatedDstIntf=$().getPreloadedInterfaceObject(gFirewallInterfaceList, "LAN");
      isFromLan=false;
      break;
    case "acptBoth":
      translatedAction="Accept";
      translatedSrcIntf='';
      translatedDstIntf='';
      isFromLan=false;
      break;
    case "rjctBoth":
      translatedAction="Drop";
      translatedSrcIntf='';
      translatedDstIntf='';
      isFromLan=false;
      break;
    default:
      break;
  } //end switch case

  var translatedSrcPort=null;
  var translatedSrcPortRangeMax=null;
  var translatedSrcAddress=null;
  var translatedDstPort=null;
  var translatedDstPortRangeMax=null;
  var translatedDstAddress=null;

  if(isFromLan==true) //i.e. from LAN
  {
    translatedSrcPort=currentLocalPortBegin;
    translatedSrcPortRangeMax=currentLocalPortEnd;
    translatedSrcAddress=(currentLocalAddress=='*')?'':currentLocalAddress;
    translatedDstPort=currentRemotePortBegin;
    translatedDstPortRangeMax=currentRemotePortEnd;
    translatedDstAddress=(currentRemoteAddress=='*')?'':currentRemoteAddress;
  }
  else //i.e. from WAN
  {
    translatedSrcPort=currentRemotePortBegin;
    translatedSrcPortRangeMax=currentRemotePortEnd;
    translatedSrcAddress=(currentRemoteAddress=='*')?'':currentRemoteAddress;
    translatedDstPort=currentLocalPortBegin;
    translatedDstPortRangeMax=currentLocalPortEnd;
    translatedDstAddress=(currentLocalAddress=='*')?'':currentLocalAddress;
  }

  var translatedSrcIp=null;
  var translatedSrcMask=null;
  var slashSrc=translatedSrcAddress.indexOf('/');
  if(slashSrc>=0)
  {
    translatedSrcIp=translatedSrcAddress.substring(0, slashSrc);
    translatedSrcMask=translatedSrcAddress.substring(slashSrc);
  }
  else
  {
    translatedSrcIp=translatedSrcAddress;
    translatedSrcMask='';
  }
  var translatedDstIp=null;
  var translatedDstMask=null;
  var slashDst=translatedDstAddress.indexOf('/');
  if(slashDst>=0)
  {
    translatedDstIp=translatedDstAddress.substring(0, slashDst);
    translatedDstMask=translatedDstAddress.substring(slashDst);
  }
  else
  {
    translatedDstIp=translatedDstAddress;
    translatedDstMask='';
  }

  var DEFAULT_ENABLE=1;
  //var prependedDesc=(currentName.indexOf(FIREWALL_PREPENDED_DESCRIPTION)==0?(currentName):(FIREWALL_PREPENDED_DESCRIPTION+currentName));
  var prependedDesc=currentName;
  var mutated=[
    DEFAULT_ENABLE,
    prependedDesc,
    translatedAction,
    translatedDstIntf,
    translatedSrcIntf,
    compromiseVer,
    translatedDstIp,
    translatedSrcIp,
    $().getConvertedProtocol(currentProtocol, false),
    $().isPortAvailable(currentProtocol, false)==false?(-1):(translatedDstPort),
    $().isPortAvailable(currentProtocol, false)==false?(-1):(translatedDstPortRangeMax),
    $().isPortAvailable(currentProtocol, false)==false?(-1):(translatedSrcPort),
    $().isPortAvailable(currentProtocol, false)==false?(-1):(translatedSrcPortRangeMax),
    translatedDstMask,
    translatedSrcMask
  ];
  if(isEditing==true)
  {
    mutated.unshift(ruleId); //prepend
    var loc = 'gvt_firewall.cmd?action=update';
    loc += '&inst='+mutated.join(',');
    loc += '&sessionKey='+sessionKey;
    //alert(loc);
    $.ajax({type:"GET", url:loc, async:false, success: function(result){
      //alert(result);
      window.top.location.reload();
    }});
  }
  else
  {
    var loc = 'gvt_firewall.cmd?action=create';
    loc += '&inst='+mutated.join(',');
    loc += '&sessionKey='+sessionKey;
    //alert(loc);
    $.ajax({type:"GET", url:loc, async:false, success: function(result){
      //alert(result);
      window.top.location.reload();
    }});
  }
}

function adjustFirewall(chnId, ruleId, up)
{
  var mutated=[ruleId, up==true?1:0];
  var loc = 'gvt_firewall.cmd?action=adjust';
  loc += '&inst='+mutated.join(',');
  loc += '&sessionKey='+sessionKey;
  //alert(loc);
  $.ajax({type:"GET", url:loc, async:false, success: function(result){
    //alert(result);
    window.top.location.reload();
  }});
}

function isFirewallReserved(desc)
{
  return desc.indexOf('GVT_PINHOLE')>=0?true:false;
}

function setFirewallDefaultPolicy(policy)
{
  var loc = 'gvt_firewall.cmd?action=setDefaultPolicy';
  loc += '&policy='+policy;
  loc += '&sessionKey='+sessionKey;
  //alert(loc);
  $.ajax({type:"GET", url:loc, async:false, success: function(result){
    //alert(result);
    window.top.location.reload();
  }});
}

function setFirewallEchoEnable(enabled)
{
  var loc = 'gvt_firewall.cmd?action=setEchoEnable';
  loc += '&enable='+enabled;
  loc += '&sessionKey='+sessionKey;
  //alert(loc);
  $.ajax({type:"GET", url:loc, async:false, success: function(result){
    //alert(result);
    window.top.location.reload();
  }});
}

function showFirewall()
{
  $.each( $('input[name="rdoDefaultPolicy"]'), function(idx, val){
    if( $(val).val()==firewallDefaultPolicy )
    {
      $(val).prop('checked', true);
    }
    else
    {
      $(val).prop('checked', false);
    }
  });
  $('input[name="rdoDefaultPolicy"]').change(function(){
    setFirewallDefaultPolicy($(this).val());
  });

  $.each( $('input[name="rdoEchoEnable"]'), function(idx, val){
    if( $(val).val()==firewallEchoEnable )
    {
      $(val).prop('checked', true);
    }
    else
    {
      $(val).prop('checked', false);
    }
  });
  $('input[name="rdoEchoEnable"]').change(function(){
    setFirewallEchoEnable($(this).val());
  });

  $('#tblFirewallRule').find('tbody').find('tr').remove();
  $.each(gFirewallRuleList, function(idx, val) {
    var item='<tr>';
	if(val.name != 'Accept traffic from LAN to HSI WAN') //F##17438,20190516,Tank,When rule name is 'Accept traffic from LAN to HSI WAN' not to shown.
	{
    item+='<td class="cinza">'+'<label>'+val.name+'</label>'+'</td>';
    var protocol=$('#selFirewallProtocol>option'+'['+'value=\''+val.protocol+'\']').text();
    item+='<td class="center">'+'<label>'+protocol+'</label>'+'</td>';
    item+='<td class="center">'+'<label>'+($().isPortAvailable(val.protocol, false)==false?"":val.localPort)+'</label>'+'</td>';
    item+='<td class="center">'+'<label>'+((val.localAddress.length==0)?('*'):(getFormattedAddress(val.localAddress)))+'</label>'+'</td>';
    item+='<td class="center"><img class="" src="../assets/_images/gateway/'+val.action+'.png"'+'alt="'+(val.action==null?'undetermined':val.action)+'"'+'></td>';
    item+='<td class="center">'+'<label>'+((val.remoteAddress.length==0)?('*'):(getFormattedAddress(val.remoteAddress)))+'</label>'+'</td>';
    item+='<td class="center">'+'<label>'+($().isPortAvailable(val.protocol, false)==false?"":val.remotePort)+'</label>'+'</td>';

    item+='<td class="center">';
    item+='<div class="actions">';
    item+='<a class="action edit"   chnId="'+val.chnId+'" ruleId="'+val.ruleId+'"><img class="img-actions" src="../assets/_images/gateway/edit2.png"</a>'+'&nbsp;';
    item+='<a class="action delete" chnId="'+val.chnId+'" ruleId="'+val.ruleId+'"><img class="img-actions" src="../assets/_images/gateway/trash.png"</a>'+'&nbsp;';
    item+='<a class="action up" chnId="'+val.chnId+'" ruleId="'+val.ruleId+'"><img class="img-actions-arrow"src="../assets/_images/gateway/arrow_up.png"</a>'+'&nbsp;';
    item+='<a class="action down" chnId="'+val.chnId+'" ruleId="'+val.ruleId+'"><img class="img-actions-arrow"src="../assets/_images/gateway/arrow_down.png"</a>';
    item+='</div>';
    item+='</td>';
    item+='</tr>';
    if(isFirewallReserved(val.name)==false)
    {
      $('#tblFirewallRule').find('tbody').append(item);
    }    
	}
  });
  
  $('.up').click(function() { upgradeFirewall($(this).attr('chnId'), $(this).attr('ruleId')); });
  $('.edit').click(function() { editFirewall($(this).attr('chnId'), $(this).attr('ruleId')); });
  $('.delete').click(function() { removeFirewall($(this).attr('chnId'), $(this).attr('ruleId')); });
  $('.down').click(function() { downgradeFirewall($(this).attr('chnId'), $(this).attr('ruleId')); });
  
}

function getViewableFirewallRule(intfList, ruleList)
{
  var itemList=[];
  $.each(ruleList, function(idx, val) {
    var item=
    {
      "chnId":null,
      "ruleId":null,
      "enabled":null,
      "order":null,
      "name":null,
      "action":null,
      "protocol":null,
      "version":null,
      "localAddress":null,
      "remoteAddress":null,
      "localPort":null,
      "remotePort":null
    };
    item.chnId=val[0];
    item.ruleId=val[1];
    item.enabled=val[2];
    item.order=val[3];
    item.name=val[4];
    item.action=getViewableFirewallAction( intfList, val[5], val[7], val[8], val[9], val[10], val[11], val[12] );
    item.protocol=$().getConvertedProtocol(val[20], true);
    item.version=val[13];
    var param=getViewableFirewallParameter(item.action,
      val[14],
      val[15],
      val[17],
      val[18],
      (parseInt(val[22])==-1?(""):(val[22]))+(parseInt(val[23])==-1?(""):(":"+val[23])),
      (parseInt(val[25])==-1?(""):(val[25]))+(parseInt(val[26])==-1?(""):(":"+val[26]))
    );
    if(param!=null)
    {
      item.remoteAddress=param[0];
      item.localAddress=param[1];
      item.remotePort=param[2];
      item.localPort=param[3];
    }
    else
    {
      item.remoteAddress=val[14];
      item.localAddress=val[17];
      item.remotePort=(parseInt(val[22])==-1?(""):(val[22]))+(parseInt(val[23])==-1?(""):(":"+val[23]));
      item.localPort=(parseInt(val[25])==-1?(""):(val[25]))+(parseInt(val[26])==-1?(""):(":"+val[26]));
    }

    itemList.push(item);
  });

  return itemList;
}

function getViewableFirewallParameter(translatedAction, dstAddr, dstMask, srcAddr, srcMask, dstPort, srcPort)
{
  switch(translatedAction)
  {
    case "acptLocal":
    case "rjctLocal":
      return [dstAddr+((dstAddr.length>0&&dstMask.length>0)?dstMask:""), srcAddr+((srcAddr.length>0&&srcMask.length>0)?srcMask:""), dstPort, srcPort];
    case "acptBoth":
    case "rjctBoth":
    case "acptRemote":
    case "rjctRemote":
      return [srcAddr+((srcAddr.length>0&&srcMask.length>0)?srcMask:""), dstAddr+((dstAddr.length>0&&dstMask.length>0)?dstMask:""), srcPort, dstPort];
    default:
      return null;
  } //end switch case
}

function getViewableFirewallAction(intfList, action, dstIntf, dstIntfEx, dstIntfAll, srcIntf, srcIntfEx, srcIntfAll)
{
  //"rjctLocal", "rjctRemote", "rjctBoth", "acptLocal", "acptRemote", "acptBoth"
  if(dstIntf!=undefined && srcIntf!=undefined && dstIntf.length>0 && srcIntf.length>0)
  {
    var isFromLan=null;
    switch($().getPreloadedInterfaceType(intfList, srcIntf))
    {
      case "WAN":
        isFromLan=false;
        break;
      case "LAN":
        isFromLan=true;
        break;
      default:
        return null;
    } //end switch case
    switch(action)
    {
      case "Accept":
        return isFromLan==true?"acptLocal":"acptRemote";
        break;
      case "Drop":
      default:
        return isFromLan==true?"rjctLocal":"rjctRemote";
    } //end switch case
  }
  else if(dstIntf!=undefined && srcIntf!=undefined && dstIntf.length==0 && srcIntf.length==0)
  {
    switch(action)
    {
      case "Accept":
        return "acptBoth";
        break;
      case "Drop":
      default:
        return "rjctBoth";
    } //end switch case
  }
  else
  {
    return null;
  }
}


function isValidAddress(cidr, accessSide)
{
  if(cidr.length==0) return false;

  var slash=cidr.indexOf('/');
  var rst4=false;
  var rst6=false;
  if(slash>0)
  {
    var addr=cidr.substring(0, slash);
    var mask=cidr.substring(slash+1);
    rst4=(isIPv4(addr))&&(isNumber(mask)&&parseInt(mask, 10)>=0&&parseInt(mask, 10)<=32);
    if (rst4 == true) {
      var lanSide = (getNetID(addr, numIP2Str(0xffffffff<<(32-mask)))==getNetID(lanIp, lanMask));
      if ( (accessSide=="Remote" && lanSide) || (accessSide=="Local" && !lanSide) )
        rst4 = false;
    }
    rst6=(rst4==false)&&(isIPv6(addr))&&(isNumber(mask)&&parseInt(mask, 10)>=0&&parseInt(mask, 10)<=128);
  }
  else
  {
    rst4=isIPv4(cidr);
    var lanSide = (getNetID(cidr, lanMask)==getNetID(lanIp, lanMask));
    if ( (accessSide=="Remote" && lanSide) || (accessSide=="Local" && !lanSide) )
      rst4 = false;
    rst6=(rst4==false)&&isIPv6(cidr);
  }
  return rst4||rst6;
}

function getVersionBelongs(cidr)
{
  var ver=0;
  if(cidr.length==0) return ver;

  var slash=cidr.indexOf('/');
  var rst4=false;
  var rst6=false;
  if(slash>0)
  {
    var addr=cidr.substring(0, slash);
    var mask=cidr.substring(slash+1);
    rst4=(isIPv4(addr))&&(isNumber(mask)&&parseInt(mask, 10)>=0&&parseInt(mask, 10)<=32);
    if(rst4==true)
    {
      ver=4;
    }
    else
    {
      rst6=(rst4==false)&&(isIPv6(addr))&&(isNumber(mask)&&parseInt(mask, 10)>=0&&parseInt(mask, 10)<=128);
      if(rst6==true)
      {
        ver=6;
      }
      else
      {
        ver=0; //invalid
      }
    }
  }
  else
  {
    rst4=isIPv4(cidr);
    if(rst4==true)
    {
      ver=4;
    }
    else
    {
      rst6=(rst4==false)&&isIPv6(cidr);
      if(rst6==true)
      {
        ver=6;
      }
      else
      {
        ver=0; //invalid
      }
    }
  }
  return ver;
}

function getFormattedAddress(addr)
{
  if(getVersionBelongs(addr)==6)
  {
    if(addr.length<=18)
    {
      return addr;
    }
    else
    {
      var doubleColon=addr.indexOf('::');
      if(doubleColon!=-1)
      {
        var front=addr.substring(0, doubleColon);
        var rear=addr.substring(doubleColon);
        return front+'<br/>'+rear;
      }
      else
      {
        var segment=addr.split(':');
        var SEGMENT_PER_LINE=3;
        var segmented=[];
        for(var i=0; i<Math.ceil(8/SEGMENT_PER_LINE); i++)
        {
          segmented.push('');
        } //end for
        for(var j=0; j<segment.length; j++)
        {
          segmented[Math.floor(j/SEGMENT_PER_LINE)]+=segment[j];
          if(j!=(segment.length-1))
          {
            segmented[Math.floor(j/SEGMENT_PER_LINE)]+=':';
          }
        } //end for
        return segmented.join('<br/>');
      }
    }
  }
  else
  {
    return addr;
  }
}

jQuery.fn.extend({
  getConvertedFirewallIndexList: function(raw) {
    var ruleList=[];
    if(raw.length>0)
    {
      var outer=raw.split("|");
      for(var i=0; i<outer.length; i++ )
      {
        ruleList[i]=outer[i];
      } //end for
    }
    return ruleList;
  }
});

jQuery.fn.extend({
  getConvertedFirewallRule: function(raw) {
    var ruleList=[];
    if(raw.length>0)
    {
      var outer=raw.split("|");
      for(var i=0; i<outer.length; i++ )
      {
        ruleList[i]=[];
        var inner=outer[i];
        inner=inner.split(',');
        for( var j=0; j<inner.length; j++ )
        {
          ruleList[i][j]=inner[j];
        } //end for
      } //end for
    }
    return ruleList;
  }
});

jQuery.fn.extend({
  isPortAvailable: function(prot, isNumber) {
    var available=false;
    if(isNumber==true)
    {
      switch(prot)
      {
        case -1:
        case 1:
          available=false;
          break;
        default:
          available=true;
          break;
      } //end switch case
    }
    else
    {
      switch(prot)
      {
        case "ICMP":
          available=false;
          break;
        default:
          available=true;
          break;
      } //end switch case
    }
    return available;
  }
});

jQuery.fn.extend({
  getConvertedProtocol: function(raw, isNumber) {
    var prot=[
      {"name":"All", "number":-1},
      {"name":"ICMP", "number":1},
      {"name":"TCP", "number":6},
      {"name":"UDP", "number":17}
    ];
    var found=null;
    $.each(prot, function(idx, val){
      if(isNumber==true)
      {
        if(val.number==raw)
        {
          found=val.name;
          return false; //the same as break
        }
      }
      else
      {
        if(val.name==raw)
        {
          found=val.number;
          return false; //the same as break
        }
      }
    });
    return found;
  }
});

jQuery.fn.extend({
  getPreloadedInterfaceObject: function(intfList, intf) {
    var found=null;
    $.each(intfList, function(idx, val){
      if(intf==val.type)
      {
        found=val.object;
        return false; //the same as break
      }
    });
    return found;
  }
});

jQuery.fn.extend({
  getPreloadedInterfaceType: function(intfList, intf) {
    var found=null;
    $.each(intfList, function(idx, val){
      if(intf==val.object)
      {
        found=val.type;
        return false; //the same as break
      }
    });
    return found;
  }
});

jQuery.fn.extend({
  getPreloadedInterface: function(raw) {
    var intfList=[];
    var outer=raw.split(",");
    if(outer.length>=2)
    {
      intfList.push( {"type":"WAN", "object":outer[0]} );
      intfList.push( {"type":"LAN", "object":outer[1]} );
    }
    return intfList;
  }
});
