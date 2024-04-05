

function btnaAgree() {

	loc += '&varName=bridgedMode&varValue='+parent.$('#op_mode').val();
	parent.$.get(loc, function(ret) {
		if (ret != 'OK') {
			parent.$('#btnCancel').trigger('click');
			invalidMsg(parent.$('#op_mode'), _0272);
		}
		else
			invalidMsg(parent.$('#op_mode'), '');

		btnaCancel();
	});
}

function btnaCancel() {
	parent.$.fancybox.close();
}

// bind button, move inline here
$(document).ready(function() {
    $("#btnaAgree").click(function() {
        btnaAgree();
    });

    $("#btnaCancel").click(function() {
        btnaCancel(this);
    });
});
