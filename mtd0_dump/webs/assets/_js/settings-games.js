

$(document).ready(function () {
	$('#accordion a.item').click(function () {
		window.top.name = '';
		$('#accordion li').children('ul').slideUp('fast');
		$('#accordion a').removeClass('active');
		$(this).addClass('active');
		$(this).siblings('ul').slideDown('fast');
		return false;
	});

  showGames();
  cancelGames();
  $('#aGamesCancel').click(function() { cancelGames(); });
  $('#aGamesApply').click(function() { applyGames(); });
});


$(window).load(function() {
    //firewall

    var accessClass = gvtMode.split('|')[0];
    /*if (accessClass == 'service02') {
        var firewall = document.getElementById("firewall");
        firewall.style.display = "none";
    }*/	//RM11739

	$('.configuracoes').trigger('click');
});

function isGamesReserved(desc)
{
  return desc.indexOf(GAMES_PREPENDED_DESCRIPTION)==0?true:false;
}

function cancelGames()
{
  $('#txtPortMappingInternalClient').val('');
}


function applyGames()
{
  var fmterr=false;
  if( !isIPv4($('#txtPortMappingInternalClient').val()) )
  {
    invalidMsg( $('#txtPortMappingInternalClient'), _0117 );
    fmterr=true;
  }
  if(fmterr==true)
  {
    return;
  }
  invalidMsg( $('#txtPortMappingInternalClient'), '' );
  var addr=$('#txtPortMappingInternalClient').val();

  var gameIndex=$('#selGames').val();
  var games=$().getPredefinedGames();
  var selectedGame=games[gameIndex];
  var selectedName=selectedGame[0];
  var selectedPortMapping=selectedGame[1];

  var ifname="";
  var intf=$().getConvertedInterface(pppPortMappingIntf);
  if(intf.length>0 && intf[0].length>=2 && intf[0][1].length>0 ) ifname=intf[0][1];

  var synerr=false; //synthesis error
  $.each(selectedPortMapping, function(idx, val) {
    var ovl=isPortMappingOverlapped(ifname, addr, val[0], val[1], val[2], val[1]);
    if(ovl.state==true)
    {
      synerr=true;
      return false; //the same as break
    }
  });
  if(synerr==true)
  {
    invalidMsg( $('#selGames'), _0149 );
    return;
  }
  else
  {
    invalidMsg( $('#selGames'), '' );
  }
  var net=(getNetID(lanIp, lanMask)==getNetID(addr, lanMask)?true:false)&&(lanIp!=addr)&&(!isManageableDevice(addr));
  if(net==false)
  {
    invalidMsg( $('#txtPortMappingInternalClient'), _0150);
    return;
  }
  else
  {
    invalidMsg( $('#txtPortMappingInternalClient'), '' );
  }

  var desc=GAMES_PREPENDED_DESCRIPTION+selectedName;
  $.each(selectedPortMapping, function(idx, val) {
    var prot=val[0];
    var pestart=val[1];
    var perange=val[2];
    var pi=val[1];
    var en='T';
    var remoteaddr='';
    var mutated=[desc, prot, addr, pestart, perange, pi, en, ifname, remoteaddr];

    var loc = 'te_ppp_pm.cmd?action=create';
    loc += '&inst='+mutated.join(',');
    loc += '&sessionKey='+sessionKey;
    //alert(loc);
    $.ajax({type:"GET", url:loc, async:false, success: function(reply){
      var response=[];
      var outer=reply.split('&');
      for( var i=0; i<outer.length; i++ )
      {
        var inner=outer[i].split('=');
        switch( inner[0] )
        {
          case 'sessionKey':
            sessionKey=inner[1];
            response['sessionKey']=sessionKey;
            break;
          case 'inst':
            response['inst']=inner[1];
            break;
          default:
            break;
        } //end for
      } //end for
      return response;
    }});
  });
  window.top.location.reload();
}

function removeGames(name, intf)
{
  var firstIid=null;
  var pm=$().getConvertedPortMapping(pppPortMappingList);
  $.each(pm, function(idx, val) {
    if( val[7]==intf && val[1]==name )
    {
      firstIid=val[0];
      return false; //the same as break
    }
  });
  var loc = 'te_ppp_pm.cmd?action=delete';
  loc += '&id='+firstIid;
  if(intf!=null) loc += '&intf='+intf;
  loc += '&sessionKey='+sessionKey;
  //alert(loc);
  $.ajax({type:"GET", url:loc, async:false, success: function(result){
    window.top.location.reload();
  }});  
}

function changeGames()
{
  invalidMsg( $('#selGames'), '' ); 
}

function showGames()
{
  $('#tblGames').find('tbody').find('tr').remove();
  var gpm=$().getConvertedGames(pppPortMappingList);
  $.each(gpm, function(idx, val) {
    var item=null;
    var skipped=isGamesReserved(val[0])==true?false:true;
    item+='<tr>';
    $.each(val, function(idxInDetail, valInDetail) {
      switch(idxInDetail)
      {
        case 2: //omitted caused by it is interface
          break;
        default:
          item+='<td class="cinza center">'+'<label>'+valInDetail+'</label>'+'</td>';
          break;
      }
    });
    item+='<td class="center">';
    item+='<div class="actions">';
    item+='<a class="action delete" name="'+val[0]+'" intf="'+val[2]+'" ><img class="img-actions" src="../assets/_images/gateway/trash.png"</a>';
    item+='</div>';
    item+='</td>';
    item+='</tr>';
    if(skipped==false)
    {
      $('#tblGames').find('tbody').append(item);
    }
  });  
  
  $('.delete').click(function() { removeGames($(this).attr('name'), $(this).attr('intf')); });

  var games=$().getPredefinedGames();
  $.each(games, function(idx, val) {
    $('#selGames').append($("<option></option>").attr("value", idx).text(val[0]));
  });
  $('#selGames').attr('onChange', 'changeGames()');
  var PREFERRED_GAME="Age of Empires II";
  $.each( $('#selGames option'), function(idx, val){
    if( val.text==PREFERRED_GAME )
    {
      $('#selGames').val(val.value);
      return false; //the same as break
    }
  });
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

jQuery.fn.extend({
  getPredefinedGames: function() {
    //outer array member: name
    //inner array member: protocol, external port begin, external port range
    var original=null;
    try{
      original=GetGameList();
    } catch(err) {
      alert(err.message);
    }
    var games=[];
    if(original!=null && original.length>0)
    {
      var identicalPort=0;
      $.each(original, function(idx, val){
        var flatports=[];
        var gameItem=val.split("/");
        var name=gameItem[0].slice(1, -1).replace("/", " ").replace(",", " ");
        if( gameItem[1]==gameItem[2] )
        {
          identicalPort++;
          flatports.push({ "protocol":"BOTH", "ports":gameItem[1].slice(1, -1) });
        }
        else
        {
          flatports.push({ "protocol":"TCP", "ports":gameItem[1].slice(1, -1) });
          flatports.push({ "protocol":"UDP", "ports":gameItem[2].slice(1, -1) });
        }
        var ports=[];
        $.each(flatports, function(idxInDetail, valInDetail){
          var abbrports=valInDetail.ports.split(",");
          $.each(abbrports, function(idxInMoreDetail, valInMoreDetail){
            var pe=$.trim(valInMoreDetail);
            var eps=(pe.indexOf('-')>0)?($.trim(pe.split('-')[0])):(pe);
            var epe=(pe.indexOf('-')>0)?($.trim(pe.split('-')[1])):(pe);
            ports.push([valInDetail.protocol, eps, epe]);
          });
        });
        //alert(ports.join("\n")); //debug only
        var translatedGameItem=[ name, ports ];
        games.push(translatedGameItem);

        //if(identicalPort>=3) return false; //debug only
      });
      //alert(identicalPort); //debug only
    }
    else
    {
      //a sample
      games=
      [
        [
          "Age of Empires II",
          [
            ["TCP", 2300, 2400],
            ["TCP", 47624, 47624],
            ["UDP", 2300, 2400]
          ]
        ],
        [
          "StarCraft II",
          [
            ["TCP", 80, 80],
            ["TCP", 1119, 1120],
            ["TCP", 3724, 3724],
            ["TCP", 6113, 6113],
            ["UDP", 80, 80],
            ["UDP", 1119, 1120],
            ["UDP", 3724, 3724],
            ["UDP", 6113, 6113]
          ]
        ]
        //it might be optimized
      ];
    }
    return games;
  }
});


jQuery.fn.extend({
  getConvertedGames: function(pmList) {
    var converted=[];
    var convertedTmp=pmList.split("/");
    $.each(convertedTmp, function(idx, val) {
      if(val.length>0)
      {
        var pmItem=val.split(",");
        var name=pmItem[1];
        var internal=pmItem[3];
        var intf=pmItem[9];
        var item=[name, internal, intf];

        var found=false;
        $.each(converted, function(idxInDetail, valInDetail) {
          if( valInDetail[0]==name )
          {
            found=true;
            return false; //the same as break
          }
        });
        
        if(found==false)
        {
          converted.push( item );
        }
      }
    });
    
    return converted;
  }
});

