
let news = []
let menus = document.querySelectorAll(".menus button")
menus.forEach(menu => menu.addEventListener("click", (event)=> getNewsByTopic(event)))
let searchButton = document.getElementById("search-button")


const getLatesNews = async ()=>{
    //주소URL 
    let url= new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`);
    //header로 정보 넘겨주기
    let header = new Headers({"x-api-key":"ruQg4pza-3YsUgG4ZAv6kKwY8a6W70GGGIvldcNqnzw"})
    //자료를 받음
    let response = await fetch(url, {headers: header});
    let data = await response.json();
    news = data.articles
    
    console.log(data);
    console.log(news);

    render();

};

const getNewsByTopic = async (event) => {
    //console.log("클릭됨", event.target.textContent); //taraget <butto>~~</butto> //내용만 : textcontent
    let topic = event.target.textContent.toLowerCase()
    let url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`)
    //console.log(url);
    let header = new Headers({"x-api-key":"ruQg4pza-3YsUgG4ZAv6kKwY8a6W70GGGIvldcNqnzw"})
    let response = await fetch(url, {headers: header});
    let data = await response.json();
    news=data.articles
    render()
}

const getNewsBykeyword = async() => {
    //1. 검색키워드 읽어오기
    let keyword = document.getElementById("search-input").value;

    //2. url에 검색키워드 부치기
    let url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`)

    //3. 헤더준비
    let header = new Headers({"x-api-key":"ruQg4pza-3YsUgG4ZAv6kKwY8a6W70GGGIvldcNqnzw"})

    //4. url부르기
    let response = await fetch(url, {headers: header});
    //5. 데이터 가져오기
    let data = await response.json();
    //6. 데이터 보여주기
    news=data.articles
    render()
}

//join string으로 array를 바꿔줌

const render = () => {
    let newsHTML = "";

    newsHTML = news.map((item)=>{ 
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
    }).join('');

    console.log(newsHTML);


    document.getElementById("new-board").innerHTML = newsHTML;
}

searchButton.addEventListener("click", getNewsBykeyword )
getLatesNews();

//ruQg4pza-3YsUgG4ZAv6kKwY8a6W70GGGIvldcNqnzw 키 

const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0"
}

const openNav = () =>{
    document.getElementById("mySidenav").style.width = "250px"
}

const openSearchBox = () =>{
    let inputArea = document.getElementById("input-area");
    if(inputArea.style.display ==="inline"){
        inputArea.style.display = "none";
    }else{
        inputArea.style.display = "inline"
    }
}