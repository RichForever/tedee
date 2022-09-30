document.addEventListener("DOMContentLoaded", function () {

  const apiUrl = "https://tedee.com/wp-json/wp/v2/posts?_fields=id,date,link,title,author&per_page=4";
  const authorUrl = "https://tedee.com/wp-json/wp/v2/users/";

  async function getLatestPosts() {

    const response = await fetch(apiUrl, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data

  }

  async function getPostAuthor(id) {
    const response = await fetch(authorUrl + id, {
      method: 'GET'
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const author = await response.json()
    return author    
  }

  getLatestPosts().then(data => {
    
      let postsContainer = document.getElementById("widget__posts")
      for (let post of data) {
        const { id, author, date, link, title } = post;
        const authorData = getPostAuthor(author).then((author) => {
          const {name: authorName, link: authorLink} = author;
                  const postMarkup = `
        <div class="widget__post" id="post-${id}">
            <a href="${link}" class="widget__post--title">
                <h3>${title.rendered}</h3>
            </a>
            <div class="widget__post--meta">
                <p>by <a href="${authorLink}">${authorName}</a> | <span class="widget__post--date">${date}</span></p>
            </div>
        </div>        
        `; 
          postsContainer.innerHTML += postMarkup;
        });      
   
        // postsContainer.appendChild(postMarkup)  
        
      }
  })

});
