const addMemoform = document.getElementById('sec-area-list01')

let blogArr=[]

window.onload = function (){

    searchBlog()
    renderBlog()

    blogArr=[]
};



function searchBlog(){
    $.ajax({
        //////content type 명시하지 않음
              type: "post",
              url : "http://localhost:3000/blog/getBlogList",
              async: false,
              data : "a",
              success : function (data){
                console.log(data)
                $.each(data, function(i, item) {
                    const blogObj ={
                        boardId : item.board_id,
                        writter : item.writter,
                        content : item.content,
                        title : item.title,
                        regdate: item.regdate,
                        good : item.good,
                        comment : item.comment,
                        views : item.views
                    }
                    blogArr.push(blogObj)
                    // dbArr.push(item)
                    
                });
              },
              error : function(e){
              }
    })
}

function renderBlog(){
    
    const movieHtml = blogArr.map((blog) => {
        return `
        <li>
            <div>
                <a href="#none" class="m_view">
                    <h3>${blog.title}</h3>
                </a>
                <div class="sec-box">
                    <a href="#none" class="sec-img">
                        <img src="http://localhost:3000/static/assets/background.png" data-commlist="AI Fellowship">
                    </a>
                    <div class="sec-cont">
                        <h3 class="title" data-commlist="AI Fellowship">${blog.title}</h3>
                        <p class="desc"  data-commlist="AI Fellowship">${blog.content} </p>
                        <div class="tag">
                            <span class="color0" style="cursor:point">#test</span>
                        </div>
                        <div class="author-area">
                            <span class="author">
                                <strong>
                                    <image src="http://localhost:3000/static/assets/background.png" alt></image>
                                </strong>
                                <em>test</em>
                            </span>
                            <span class="date area-image">${blog.regdate}</span>
                            <span class="view area-image">${blog.views}</span>
                            <span class="good area-image">${blog.good}</span>
                            <span class="comment area-image">${blog.comment}</span>
                        </div>
                    </div>
                    
                </div>
                
            </div>
        </li>
            `
    }).join('');
    addMemoform.innerHTML = movieHtml

}