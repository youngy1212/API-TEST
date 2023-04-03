
//ruQg4pza-3YsUgG4ZAv6kKwY8a6W70GGGIvldcNqnzw 키 
const API_KEY = "ruQg4pza-3YsUgG4ZAv6kKwY8a6W70GGGIvldcNqnzw"; 

//변수 선언
let articles = []; // API를 받아올 배열
let page = 1; 
let total_pages = 1;

//기본으로 들어갈 URL
let url = new URL( //전역변수로 선언 : 계속변경
    "https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10"
)

let menus = document.querySelectorAll(".menus button")
menus.forEach(menu => menu.addEventListener("click", (event)=> getNewsByTopic(event)))


//코드 리팩토링
//각 함수에서 필요한 url을 만든다 
//api 호출함수를 부른다
const getNews = async () => {
    try {
        let header = new Headers();
        header.append("x-api-key",API_KEY);

    //URL에 쿼리 더하기
    url.searchParams.set('page', page) //&page= 

    //자료를 받음
    let response = await fetch(url, { headers: header });
    //header로 정보 넘겨주기
    let data = await response.json();
    if(response.status == 200){
        if(data.total_hit == 0){
            console.log("A", data);
            page = 0;
            total_pages = 0;
            renderPagenation();
            throw new Error("검색된 결과값이 없습니다")
            //에러가 날 경우 여기서 멈추기 떄문에 아래는 실행X
        }

        console.log("B", data);
        articles = data.articles;
        console.log(articles);
        total_pages = data.total_pages; // 페이지네이션을 위한 값 설정
        page = data.page;
        render();
        renderPagenation(); 
    }else{
        page = 0;
        total_pages = 0;
        renderPagenation(); 
        throw new Error(data.message);
    }

    }catch(error){
        console.log("에러 : ", error.message)
        errorRender(error.message);
        page = 0;
        total_pages = 0;
        renderPagenation();
    }

   
    console.log("response : ",response);
    console.log("data : ",data);
};

const getLatestNews =  ()=>{
    //주소URL 
    url = new URL(
        `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`
      );
    page = 1; // 새로운 search 마다 1 로 리셋
    getNews();

};

const getNewsByTopic = async (event) => {
    //console.log("클릭됨", event.target.textContent); //taraget <butto>~~</butto> //내용만 : textcontent
    let topic = event.target.textContent.toLowerCase()
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`)
    //console.log(url);
    getNews();
}

const openSearchBox = () =>{
    let inputArea = document.getElementById("input-area");
    if(inputArea.style.display ==="inline"){
        inputArea.style.display = "none";
    }else{
        inputArea.style.display = "inline"
    }
};



const searchNews  = async() => {
    //1. 검색키워드 읽어오기
    let keyword = document.getElementById("search-input").value;
    page = 1;
    //2. url에 검색키워드 부치기
    url = new URL(
        `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`
      );
    getNews();
   
};

//join string으로 array를 바꿔줌

const render = () => {
    let newsHTML = "";

    newsHTML = articles.map((item)=>{ 
        return  `<div class="row news">
                    <div class="col-lg-4">
                        <img class="new-img-size" src="${item.media || 
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"                        
                        }">
                    </div>
                    <div class="col-lg-8">
                        <h2>${item.title}</h2>
                        <p>${item.summary == null || item.summary == "" ? "내용없음"
                            :item.summary.length > 200
                            ?item.summary.substring(0,200) + "..."
                            :item.summary
                        }</p>
                        <div>
                        ${item.rights || "no source"} * ${moment(item.published_data).fromNow()}
                        </div>
                    </div>
                </div>`
    }).join("");

    console.log(newsHTML);


    document.getElementById("new-board").innerHTML = newsHTML;
}





// let searchButton = document.getElementById("search-button")
// searchButton.addEventListener("click", getNewsBykeyword )
// getLatesNews();



const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0"
}

const openNav = () =>{
    document.getElementById("mySidenav").style.width = "250px"
}


/////////////////페이지 네이션
const renderPagenation = () => {
    // 1.1~5까지를 보여준다
    // 2.6~10을 보여준다 => last, first 가필요
    // 3.만약에 first가 6 이상이면 prev 버튼을 단다
    // 4.만약에 last가 마지막이 아니라면 next버튼을 단다
    // 5.마지막이 5개이하이면 last=totalpage이다
    // 6.페이지가 5개 이하라면 first = 1이다
    let pagenationHTML  = `` //htmlpage를 담아줄 변수

    //total_page : API 키 
    //page : API 키
    //page group
    let pageGrop = Math.ceil(page/5)
    //last 
    let last = pageGrop*5
    if (last > total_pages) {
        // 마지막 그룹이 5개 이하이면
        last = total_pages;
      }
    //first
    let first = last -4 <= 0? 1 : last -4; //첫그룹이 5이하면
    //first ~ last : 페이지 프린트
    if (first >= 6) {
        pagenationHTML = `<li class="page-item" onclick="pageClick(1)">
                            <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
                          </li>
                          <li class="page-item" onclick="pageClick(${page - 1})">
                            <a class="page-link" href='#js-bottom'>&lt;</a>
                          </li>`;
    }

    for(let i= first; i<= last; i++){
        pagenationHTML +=  `<li class="page-item ${page==i}? "active": "" ">
        <a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
    }


    if (last < total_pages) {
        pagenationHTML += `<li class="page-item" onclick="pageClick(${page + 1})">
                            <a  class="page-link" href='#js-program-detail-bottom'>&gt;</a>
                           </li>
                           <li class="page-item" onclick="pageClick(${totalPage})">
                            <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
                           </li>`;
      }
    

    document.querySelector(".pagination").innerHTML = pagenationHTML;

};



const moveToPage = (pageNum)=> {
    //클릭이벤트 세팅
    //이동하고싶은 페이지 알아오기
    page = pageNum
    //이동하고싶은 페이지를 가지고 api를 다시 호출
    
    window.scroll({top:0, behavior: "smooth"})
    getNews();

}

const errorRender = (message) => {
    let errorHTML = `<h3 class="alert alert-danger" role="alert">${message}</h3>`;
    document.getElementById("new-board").innerHTML = errorHTML;
}


getLatestNews(); //호출