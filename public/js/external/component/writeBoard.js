const writeBoardform = document.getElementById('writeBoardform')
const newBoardTitle = document.getElementById("BoardTitle")
const newBoardTag = document.getElementById("sub_info_tag")
const newBoardUser = document.getElementById("sub_info_user")
const newBoardContent = document.getElementById("BoardContent")
const showTestHtmlBtn = document.getElementById("showHtmlModeBtn")
const WirteModeBtn = document.getElementById("writeModeBtn")
const testHtmlform = document.getElementById("testHtmlform")



writeBoardform.addEventListener('submit', (e) =>{
    e.preventDefault() //글자 안 사라지게함

    addNewboarder()
})

function addNewboarder(){
    toMarkdown()
    const boardContentToHtml = HtmlArr[0]
    var boardData = {"title":newBoardTitle.value,"writter":newBoardUser.value,"content":boardContentToHtml};
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

let HtmlArr = []

showTestHtmlBtn.addEventListener("click", showTestHtml);
WirteModeBtn.addEventListener("click", writeMode);



function showTestHtml(){
  
  toMarkdown();

  renderHtml();
  HtmlArr = []
}

function toMarkdown(){
  HtmlArr = []
  $.ajax({
    type: "POST",
    dataType: "html",
    processData: false,
    url: "https://api.github.com/markdown/raw",
    data: newBoardContent.value,
    contentType: "text/plain",
    success: function(data){
        console.log(data);
        HtmlArr.push(data);
    }, 
    error: function(jqXHR, textStatus, error){
        console.log(jqXHR, textStatus, error);
    }
  });
  
}

function renderHtml(){
  const TestHtml = HtmlArr.map((test) => {
    return `<div>${test}</div>`
  }).join('');
  testHtmlform.innerHTML = TestHtml
  testHtmlform.style.display = "inline"
  newBoardContent.style.display = "none"
}

function writeMode(){
  testHtmlform.style.display = "none"
  newBoardContent.style.display = "inline"
}