/**
 * Created by nguyenlinh on 7/16/17.
 */
function showPopUp(title, text, time) {
	$.gritter.add({
		title: title,
		text: text || " ",
		time: time || 2000
	});
}