const writeBoardform = document.getElementById('writeBoardform')
const newBoardTitle = document.getElementById("BoardTitle")
const newBoardTag = document.getElementById("sub_info_tag")
const newBoardUser = document.getElementById("sub_info_user")
const newBoardContent = document.getElementById("BoardContent")


writeBoardform.addEventListener('submit', (e) =>{
    e.preventDefault() //글자 안 사라지게함

    addNewboarder()
})

function addNewboarder(){
    var boardData = {"title":newBoardTitle.value,"writter":newBoardUser.value,"content":newBoardContent.value};
    console.log(boardData);
    $.ajax({
        //////content type 명시하지 않음
              type: "post",
              url : "http://localhost:3000/blog/addNewBoarder",
              async: false,
              data : boardData,
              success : function (data){
                console.log(data)
                
              },
              error : function(e){
                console.log(data)
              }
    })
    // location.href = "../blog.html";
}