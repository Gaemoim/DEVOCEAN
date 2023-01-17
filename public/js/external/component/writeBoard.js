const writeBoardform = document.getElementById('writeBoardform')
const newBoardTitle = document.getElementById("BoardTitle")
const newBoardTag = document.getElementById("sub_info_tag")
const newBoardUser = document.getElementById("sub_info_user")
const testHtmlform = document.getElementById("testHtmlform")
const editor = new toastui.Editor({
  el: document.querySelector('#editor'),
  previewStyle: 'vertical',
  height: '500px',
  initialValue: '안녕하세요. 코딩노잼입니다.'
});



writeBoardform.addEventListener('submit', (e) =>{
    e.preventDefault() //글자 안 사라지게함

    addNewboarder()
})

function addNewboarder(){
    const boardContentToHtml = editor.getHTML();
    console.log(editor.getHTML());
    var boardData = {"title":newBoardTitle.value,"writter":newBoardUser.value,"content":boardContentToHtml};
    console.log(boardData);
    $.ajax({
        //////content type 명시하지 않음
              type: "post",
              url : "http://localhost:3000/api/blog/addNewBoarder",
              async: false,
              data : boardData,
              success : function (data){
                console.log(data)
                if (data== true ) {
                  alert( "글쓰기가 완료되었습니다." );
                  window.location = document.referrer;
                }
                
              },
              error : function(e){
                console.log(data)
              }
    })
    // location.href = "../blog.html";
}

let HtmlArr = []

