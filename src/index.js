document.addEventListener("DOMContentLoaded", () => {
    fetchNewPosts()
    let homeBtn = document.getElementById('home-page')
    homeBtn.addEventListener("click", landingPage)
    landingPage()

    var modal = document.getElementById("myModal");
    var btn = document.getElementById("login-button");
    var span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
        modal.style.display = "block";
    }
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
    }

    var createUserModal = document.getElementById("createUserModal");
    var createUserbtn = document.getElementById("create-new-user");
    var createSpan = document.getElementsByClassName("close")[1];
    
    createUserbtn.onclick = function() {
        createUserModal.style.display = "block";
    }
    createSpan.onclick = function() {
        createUserModal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == createUserModal) {
          createUserModal.style.display = "none";
        }
    }
    
    let loginForm = document.getElementById('login-form')
    loginForm.addEventListener("submit", loginHandler)

    let createUserRequest = document.getElementById('create-new-user')
    createUserRequest.addEventListener("click", createUserHandler)

    let allUserBtn = document.getElementById('all-users')
    allUserBtn.addEventListener("click", fetchAllUsers)

})

function fetchNewPosts() {
    fetch("http://localhost:3000/posts/?_limit=4").then(resp => resp.json())
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

// function logged_in() {
//     fetch()
//     console.log(sessionStorage.setItem('key', 'value'))
// }

function loginHandler(event) {
    let username = event.target.username_input.value
    let password = event.target.password_input.value

    let loggedInName = document.getElementById('logged-in-as')
    loggedInName.innerText = username
    event.target.reset()
    event.target.parentNode.parentNode.style.display = "none";
    let btn = document.getElementById("login-button");
    btn.hidden = true
}

function fetchAllUsers() {
    fetch('http://localhost:3000/users').then(resp => resp.json())
        .then(users => renderAllUsers(users))
}

function renderAllUsers(users) {
    let mainContainer = findMainContainer()
    let showContainer = findShowContainer()
    let userContainer = document.createElement('div')
    userContainer.classList.add('show-content')

    showContainer.innerHTML = ""
    mainContainer.innerHTML = ""
    mainContainer.classList.remove('parallax')

    users.forEach(user => userContainer.append(createUserDiv(user)))
    showContainer.append(userContainer)
}

function createUserDiv(user) {
    let div = document.createElement('div')
    let fullName = document.createElement('h5')
    let age = document.createElement('p')
    let username = document.createElement('p')
    let ageUsernameSpan = document.createElement('span')
    ageUsernameSpan.append(age, username)
    div.append(fullName, ageUsernameSpan)

    fullName.innerText = user.first_name + " " + user.last_name
    age.innerText = "Age: " + user.age
    username.innerText = "Username: " + user.username

    return div
}

function createUserHandler(event) {
    let modal = document.getElementById("myModal");
    modal.style.display = "none"

    let createForm = document.getElementById('createUserModal')
}