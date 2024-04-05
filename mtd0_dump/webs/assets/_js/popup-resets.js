
function btnaAccept()
{
	parent.$.get(loc,function(ret){});
	parent.$.fancybox.close();
}

function btnaDeny()
{
  parent.$.fancybox.close();
}

// bind button, move inline here
$(document).ready(function() {
    $("#btnaAccept").click(function() {
        btnaAccept();
    });

    $("#btnaDeny").click(function() {
        btnaDeny(this);
    });
});