function goDetail(element, id ,e){
    var menuName = window.location.pathname.split('/')[1];
    var detailName = window.location.pathname.split('/')[2];
    console.log(id,detailName);

    var url = "/static/layout/blog/boardDetail.html";

    var blankUrl = url;

    $('#goForm').get(0).ID.value = id;
    window.localStorage.setItem('boardID', ID);
    $.ajax({
        //////content type 명시하지 않음
              type: "post",
              url : "http://localhost:3000/blog/getBlogDetail",
              async: false,
              data : {"id":params.get('ID')},
              success : function (data){
                console.log(data)
                $.each(data, function(i, item) {
                    const blogDetailObj ={
                        boardId : item.BoardID,
                        writter : item.Writter,
                        content : item.contents,
                        title : item.BoardTitle,
                        regdate: item.regdate,
                        good : item.good,
                        comment : item.comment,
                        views : item.views
                    }
                    console.log(blogDetailObj)
                    blogDetailArr.push(blogDetailObj)
                    
                });
              },
              error : function(e){
              }
    })
}