
$(document).ready(function () {
	$('#divLogout').hide();
	if (window.top.location.pathname != '/') {
		$('.col-192').hide();
		$('.col-722').attr('style', 'margin-left:96px');
	}

	$('#accordion a.item').click(function () {
		window.top.name = '';
		$('#accordion li').children('ul').slideUp('fast');
		$('#accordion a').removeClass('active');
		$(this).addClass('active');
		$(this).siblings('ul').slideDown('fast');
		return false;
	});
});


$(window).load(function()
{
    //firewall
    var gvtMode = '<%ejGetOther(devInfo, gvtMode)%>';
    var accessClass = gvtMode.split('|')[0];
    /*if (accessClass == 'service02') {
        var firewall = document.getElementById("firewall");
        firewall.style.display = "none";
    }*/	//RM11739

	if ('<%ejGet(curUserName)%>' == 'xxx') {
		invalidMsg($('#txtUser'), '<%ejGetOther(webLang, 0038)%>');
	}
	$('#txtUser').focus();

	$('#txtUser,#txtPass').keypress(function(e) {
		if (e.which == 13) doLogin();
	});

	var bruteTime = '<%ejGet(bruteTime)%>';
	if (bruteTime > 0) {
		$('#txtUser,#txtPass').attr('disabled', true);
		$('#btnLogin').hide();
		invalidMsg($('#txtPass'), '<%ejGetOther(webLang, 0039)%> '+ bruteTime +' <%ejGetOther(webLang, 0040)%>'+ (bruteTime>1?'s':'') +' <%ejGetOther(webLang, 0041)%>');
		cid = setInterval(countDown, 1000);
	}
	function countDown() {
		bruteTime--;
		invalidMsg($('#txtPass'), '<%ejGetOther(webLang, 0039)%> '+ bruteTime +' <%ejGetOther(webLang, 0040)%>'+ (bruteTime>1?'s':'') +' <%ejGetOther(webLang, 0041)%>');
		if (bruteTime <= 0) {
			clearInterval(cid);
			$('#txtUser,#txtPass').attr('disabled', false);
			$('#btnLogin').show();
			invalidMsg($('#txtUser'), '');
			invalidMsg($('#txtPass'), '');
			$('#txtUser').focus();
		}
	}
    
    function doLogin()
    {
	    $('[name=loginUsername]').val($('#txtUser').val());
	    $('[name=loginPassword]').val($('#txtPass').val());
	    $('form').trigger('submit');
    }

    $( "#btnLogin" ).click(function() {
		    doLogin();
	    });
});

