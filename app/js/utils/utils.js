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

function convertToFormData(data) {
	var form_data = new FormData();

	for (var key in data) {
		form_data.append(key, data[key]);
	}

	return form_data;
}
