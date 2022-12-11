function goDetail(element, id ,e){
    var menuName = window.location.pathname.split('/')[1];
    var detailName = window.location.pathname.split('/')[2];
    console.log(menuName,detailName);

    var url = "/static/layout/blog/boardDetail.html";

    var blankUrl = url;

    $('#goForm').get(0).ID.value = id;
    $('#goForm').get(0).boardType.value = boardType;
    $('#goForm').attr("action",url);
    $('#goForm').attr("method",'GET');
    $('#goForm').submit()
}