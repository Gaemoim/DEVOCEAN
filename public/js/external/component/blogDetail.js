const urlParam = window.location.search; //url 파라미터
var params = new URLSearchParams(urlParam);
const addBlogform = document.getElementById('mainBlogContent')

let blogDetailArr = []

window.onload = function() {
    searchBlogDetail();
    renderBlogDetail();
    blogDetailArr = []
}

function searchBlogDetail(){
    
    var idData = {"id":params.get('ID')};
    console.log(idData);

    $.ajax({
        //////content type 명시하지 않음
              type: "post",
              url : "http://localhost:3000/blog/addNewBoarder",
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

function renderBlogDetail(){
    const blogDetailHtml = blogDetailArr.map((blog) => {
        console.log(blog.regdate)
        return `
        <div class="sub-sec-view-title">
            <h2>title</h2>
            <div class="view-info">
                <span class="author">
                    <strong>
                        <image src="http://localhost:3000/static/assets/background.png" alt></image>
                    </strong>
                    <em>${blog.writter}</em>
                </span>
                <span class="date">${blog.regdate}</span>
                <span class="view area-image">${blog.views}</span>
                <span class="good area-image">${blog.good}</span>
                <span class="comment area-image">${blog.comment}</span>
            </div>
        </div>
        <div class="sub-sec-content">
            <a>${blog.content}<a>  
        </div>
            `
    }).join('');
    addBlogform.innerHTML = blogDetailHtml
}
