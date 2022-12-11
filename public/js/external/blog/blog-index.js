function searchParam(key) {
    return new URLSearchParams(location.search).get(key);
  };

function goSubIndex(type) {
    var url = "/static/layout/blog/index.html" ;
	$('#goForm').get(0).subIndex.value = type;
	$('#goForm').get(0).searchData.value = '';
    //$('#goForm').get(0).idList.value = '';



	$('#goForm').attr("action",url);
	$('#goForm').attr("method",'GET');
	$('#goForm').submit();
}
