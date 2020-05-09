// elements required in global scope
const postsContainer = document.getElementById('posts-container');
const input = document.querySelector('.input');
const btn = document.getElementById('submit-button');
const title = document.querySelector('.title');
const loading = document.querySelector('.loader');
const searchWrapper = document.querySelector('.search-wrapper');

console.log("Designed & Developed by me (Cameron Shaw)!");


// listen for keypress and clicks from user
input.addEventListener('keypress', enterPressed);
btn.addEventListener('click', user);

// make sure key pressed is the Enter key
function enterPressed() {
    if (event.key === "Enter") {
        btn.click();
    }
}

function user() {
    // if search has already been called remove divs and start over
    if(postsContainer.childNodes[0]){ 
        postsContainer.querySelectorAll('*').forEach(n => n.remove()) 
    }

    let searchQuery = input.value; 
    // if input box is empty return
    if(searchQuery == "") {
        return;
    } else {
        showLoading(searchQuery);
        title.innerHTML = "Search";        
        input.value = "";
        return; 
    }   
}

// show loader while search results are loading
function showLoading(searchQuery) {

    // hide content and show loader
    loading.classList.add('show');
    searchWrapper.classList.add('hide');

    // remove loader and then show loaded content
    setTimeout(() => {
        loading.classList.remove('show');
        setTimeout(() => {
            showResults(searchQuery);   
        }, 300)
    }, 1000);
}

function showResults(searchQuery) {
    var url = "https://en.wikipedia.org/w/api.php"; 
    let userInput = input;

    // different pieces that make up the url to fetch
    var params = {
        action: "query",
        prop: "extracts",
        exsentences: "3",
        exlimit: "max",
        exintro: "true",
        explaintext: "true",
        generator: "search",
        gsrsearch: "",
        format: "json"
    };
    url = url + "?origin=*";

    // set users search query to parameter in url
    params.gsrsearch = searchQuery;

    // join params into the url string
    Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});
    
    fetchMeUrl(url);
}

function fetchMeUrl(url) {
    fetch(url)
    // get url and then return the data
    .then(function(response){ 
        return response.json();
    })
    .then(function(response) {
        var searchData = response.query.pages;
        var results = Object.keys(searchData); 

        // for each search result create and append info in a div
        results.forEach(function (page) {
            const postEl = document.createElement('div');
            postEl.classList.add('post');
            postEl.innerHTML = `
            <div class="post-info">
                <h2 class="post-title"><code>${searchData[page].title}</code></h2>
                <p class="post-body"><code>${searchData[page].extract}</code</p>
            </div>`;

            postsContainer.appendChild(postEl);
        })
        searchWrapper.classList.remove('hide');

    })
    // throw an error if no response from url
    .catch(function(error){
        console.log(error);
        title.innerHTML = "No results found, try again";
        searchWrapper.classList.remove('hide');
    });
}
