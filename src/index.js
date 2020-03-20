document.addEventListener("DOMContentLoaded", () => {
    fetchNewPosts()
    let homeBtn = document.getElementById('home-page')
    homeBtn.addEventListener("click", landingPage)
    landingPage()
})

function fetchNewPosts() {
    fetch("http://localhost:3000/posts/?_limit=3").then(resp => resp.json())
        .then(posts => posts.forEach(post => renderPost(post)))
}

function renderPost(post) {
    let postContainer = document.getElementsByClassName('suggested-posts')[0]
    postContainer.classList.add('row')

    // adding bootstrap column class
    let columnDiv = document.createElement('div')
    columnDiv.classList.add('col')
    postContainer.append(columnDiv)

    // creating card
    let card = document.createElement('div')
    card.classList.add('card')
    card.style.width = "90%"
    card.addEventListener("click", () => showPost(post))

    // if post has an image, add it
    if (post.image != null){
        let image = document.createElement('img')
        image.src = post.image
        image.classList.add('card-image-top')
        image.classList.add('card-images')
        card.append(image)
    }

    // creating text inside card
    let cardBody = document.createElement('div')
    cardBody.classList.add('card-body')

    let postTitle = document.createElement('h5')
    postTitle.innerText = post.subject
    cardBody.append(postTitle)

    let postBody = document.createElement('p')
    postBody.classList.add('card-text')
    postBody.innerText = post.body.substr(0, 75) + '...'
    cardBody.append(postBody)

    // adding everything together
    card.append(cardBody)
    columnDiv.append(card)
}

function showPost(post) {
    console.log('click')
    // creating postContainer
    let postContainer = document.createElement('span')
    let showContainer = findShowContainer()
    let mainContainer = findMainContainer()
    mainContainer.innerHTML = ""
    showContainer.innerHTML = ""
    mainContainer.classList.remove('parallax')
    showContainer.append(postContainer)
    postContainer.classList.add('show-content')

    // adding content to postContainer
    let postTitle = document.createElement('h2')
    postTitle.innerText = post.subject
    postContainer.append(postTitle)

    let postContent = document.createElement('p')
    postContent.innerText = post.body
    postContainer.append(postContent)
}

function landingPage() {
    let showContainer = findShowContainer()
    let mainContainer = findMainContainer()
    mainContainer.innerHTML = ""
    showContainer.innerHTML = ""
    mainContainer.classList.add('parallax')
}

function findMainContainer() {
    return document.getElementsByClassName('main-container')[0]
}
function findShowContainer() {
    return document.getElementsByClassName('show-container')[0]
}