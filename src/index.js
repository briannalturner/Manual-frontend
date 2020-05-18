document.addEventListener("DOMContentLoaded", () => {
    localStorage.clear()
    fetchNewPosts()
    landingPage()

    createLoginModal()
    createNewUserModal()
    createEventListenersOnPage()
    
})

function createEventListenersOnPage() {
    let homeBtn = document.getElementById('home-page')
    homeBtn.addEventListener("click", landingPage)

    let loginForm = document.getElementById('login-form')
    loginForm.addEventListener("submit", loginHandler)

    let createUserRequest = document.getElementById('create-new-user')
    createUserRequest.addEventListener("click", createUserHandler)

    let allUserBtn = document.getElementById('all-users')
    allUserBtn.addEventListener("click", fetchAllUsers)

    let allPostBtn = document.getElementById('all-posts')
    allPostBtn.addEventListener("click", fetchAllPosts)
}

function createLoginModal() {
    let loginModal = document.getElementById("myModal");
    let btn = document.getElementById("login-button");
    let span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
        loginModal.style.display = "block";
    }
    span.onclick = function() {
        loginModal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == loginModal) {
          loginModal.style.display = "none";
        }
    }
}

function createNewUserModal() {
    let createUserModal = document.getElementById("createUserModal");
    let createUserbtn = document.getElementById("create-new-user");
    let createSpan = document.getElementsByClassName("close")[1];
    let form = document.getElementById('new-user-form')
    form.addEventListener("submit", saveNewUser)
    
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
}

function saveNewUser(event) {
    let firstName = event.target.create_first_name.value
    let lastName = event.target.create_last_name.value
    let age = event.target.create_age.value
    let username = event.target.create_username.value
    let password = event.target.create_password.value
    let bio = event.target.create_bio.value
    let image = event.target.create_image.value
    let userContainer = document.getElementsByClassName('users-container')[0]


    let payload = {first_name: firstName, last_name: lastName, age: age, username: username, password_digest: password, bio: bio, image: image}

    fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(payload)
    }).then(resp => resp.json()).then(user => {
        setLoggedIn(user)
        userContainer.append(createUserDiv(user))
    })

    event.target.reset()
    event.target.parentNode.parentNode.style.display = "none";
    let btn = document.getElementById("login-button");
    btn.hidden = true
}

function createNewPostModal() {
    let createPostModal = document.getElementById("createPostModal");
    let createPostbtn = document.getElementById("new-post");
    let createSpan = document.getElementsByClassName("close")[2];
    let form = document.getElementById('create_post_form')
    form.addEventListener("submit", newPostHandler)
        
    createPostbtn.onclick = function() {
        if (localStorage.id !== null && localStorage.id !== undefined) {
            createPostModal.style.display = "block";
        } else {
            let loginModal = document.getElementById("myModal");
            let span = document.getElementsByClassName("close")[0];
    
            loginModal.style.display = "block";
    
            span.onclick = function() {
                loginModal.style.display = "none";
            }
            window.onclick = function(event) {
                if (event.target == loginModal) {
                loginModal.style.display = "none";
                }
            }
        }
    }
    createSpan.onclick = function() {
        createPostModal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == createPostModal) {
        createPostModal.style.display = "none";
        }
    }
}

function newPostHandler(event) {
    event.preventDefault()
    let body = event.target.create_body.value
    let subject = event.target.create_subject.value
    let url = event.target.create_url.value
    let postsContainer = document.getElementsByClassName('posts-container')[0]

    let payload = {user_id: localStorage.id, body: body, subject: subject, image: url}

    fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(payload)
    }).then(resp => resp.json()).then(post => {
        postsContainer.append(makePostCard(post))
        fetchNewPosts()
    })
    event.target.reset()
    event.target.parentNode.parentNode.style.display = "none";
    let btn = document.getElementById("login-button");
    btn.hidden = true
}

function fetchNewPosts() {
    fetch("http://localhost:3000/posts").then(resp => resp.json())
        .then(posts => {
            posts = posts.slice(-4)
            let postContainer = document.getElementsByClassName('suggested-posts')[0]
            postContainer.innerHTML = ""
            posts.forEach(post => renderPost(post))
        })
}

function renderPost(post) {
    let postContainer = document.getElementsByClassName('suggested-posts')[0]
    postContainer.classList.add('row')

    // adding bootstrap column class
    let columnDiv = document.createElement('div')
    columnDiv.classList.add('col')
    postContainer.append(columnDiv)

    // creating card
    let card = createPostCard(post)
    columnDiv.append(card)
}

function createPostCard(post) {
    let card = document.createElement('div')
    card.classList.add('card')
    card.style.width = "90%"
    card.addEventListener("click", () => showPost(post))

    // console.log(post)
    // if post has an image, add it
    if (post.image !== null){
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

    return card
}

function showPost(post) {
    // creating postContainer
    let postContainer = document.createElement('span')
    let showContainer = findShowContainer()
    let mainContainer = findMainContainer()
    showContainer.innerHTML = ""
    mainContainer.innerHTML = ""
    mainContainer.classList.remove('parallax')
    showContainer.append(postContainer)
    showContainer.classList.add('show-content')

    // console.log(post.user)
    // adding content to postContainer
    let postTitle = document.createElement('h2')
    let postAuthor = document.createElement('h5')
    postAuthor.innerText = post.user.first_name + " " + post.user.last_name
    postTitle.innerText = post.subject
    postContainer.append(postTitle, postAuthor)

    let hr = document.createElement('hr')
    commentsContainer = addComments(post)

    let postContent = document.createElement('p')
    postContent.innerText = post.body
    postContainer.append(postContent, hr, commentsContainer)
}

function addComments(post) {
    let commentForm = document.createElement('form')
    let textArea = document.createElement('textarea')
    let submitBtn = document.createElement('button')
    submitBtn.innerText = "Post"
    submitBtn.classList.add('btn-secondary', 'rounded')
    submitBtn.type = "submit"
    submitBtn.style.marginBottom = "15px"
    textArea.style.marginBottom = "15px"
    textArea.id = "text_area"
    textArea.placeholder = "write a comment..."
    textArea.classList.add('form-control','col-md-5')
    commentForm.append(textArea, submitBtn)

    commentForm.addEventListener("submit", () => newCommentHandler(post))

    let commentsContainer = document.createElement('div')
    commentsContainer.id = "comments-container"
    let commentHeader = document.createElement('h4')
    commentHeader.innerText = "Comments"
    commentsContainer.append(commentHeader, commentForm)
    post.comments.forEach(comment => commentsContainer.append(renderComment(comment)))
    return commentsContainer
}

function renderComment(comment) {
    let commentLi = document.createElement('div')

    commentLi.innerHTML = `
        <div class="card mb-3" style="max-width: 540px;">
            <div class="row no-gutters">
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-text" style="font-size: 16px">@${comment.user.username}</h5>
                        <p class="card-text" style="font-size: 13px">${comment.body}</p>
                    </div>
                </div>
            </div>
        </div>
    `
    commentLi.addEventListener("click", () => showUser(comment.user))

    return commentLi
}

function newCommentHandler(post) {
    if (localStorage.id !== null && localStorage.id !== undefined) {
        let comment_body = event.target.text_area.value
        let user_id = localStorage.id
        let post_id = post.id
        let payload = {body: comment_body, user_id: user_id, post_id: post_id}

        fetch('http://localhost:3000/comments', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(resp => resp.json())
        .then(comment => {
            let commentsContainer = document.getElementById('comments-container')
            commentsContainer.append(renderComment(comment))
        })

        event.target.reset()
    } else {
        let loginModal = document.getElementById("myModal");
        let span = document.getElementsByClassName("close")[0];

        loginModal.style.display = "block";

        span.onclick = function() {
            loginModal.style.display = "none";
        }
        window.onclick = function(event) {
            if (event.target == loginModal) {
            loginModal.style.display = "none";
            }
        }
    }
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
    showContainer = document.getElementsByClassName('show-container')[0]
    showContainer.classList.remove('show-content')
    return showContainer
}

function loginHandler(event) {
    let username = event.target.username_input.value
    let password = event.target.password_input.value

    let deleteNode = event.target.parentNode.parentNode

    fetch("http://localhost:3000/users").then(resp => resp.json())
    .then(usersArray => {
        let user = usersArray.filter(user => {
            return user.username == username && user.password_digest == password
        })[0]
        if (user !== undefined){
            setLoggedIn(user)
            deleteNode.style.display = "none";
            let btn = document.getElementById("login-button");
            btn.hidden = true
            let loggedInName = document.getElementById('logged-in-as')
            loggedInName.innerText = user.first_name + " " + user.last_name
            loggedInName.addEventListener("click", () => showUser(user))
        } else {
            alert("We couldn't find a user with those credentials")
            event.target.reset()
        }
    })
}

function setLoggedIn(user) {
    let loggedInName = document.getElementById('logged-in-as')
    loggedInName.innerText = user.first_name + " " + user.last_name
    loggedInName.addEventListener("click", () => showUser(user))
    localStorage.setItem('id', user.id);
    localStorage.setItem('username', user.username);
}

function fetchAllUsers() {
    fetch('http://localhost:3000/users').then(resp => resp.json())
        .then(users => renderAllUsers(users))
}

function renderAllUsers(users) {
    let mainContainer = findMainContainer()
    let showContainer = findShowContainer()
    let userContainer = document.createElement('div')
    let header = document.createElement('h1')

    header.innerText = "Explore Users"
    header.style.margin = '10px'
    header.classList.add('center')

    showContainer.innerHTML = ""
    mainContainer.innerHTML = ""
    mainContainer.classList.remove('parallax')
    userContainer.classList.add('card-columns')
    userContainer.classList.add('users-container')
    userContainer.style.paddingTop = '15px'

    users.forEach(user => userContainer.append(createUserDiv(user)))
    mainContainer.append(header, userContainer)
}

function createUserDiv(user) {
    let userCard = document.createElement('div')

    userCard.innerHTML = `
        <div class="card">
            <div class="card-header">@${user.username}</div>
            <div class="card-body">
                <span>
                    <div>
                        <img class="show-user-picture" src="${user.image}">
                    </div>
                    <hr>
                    <div id="post-body">
                        <h5 class="card-title"">${user.first_name} ${user.last_name}</h5>
                        <p class="card-text">${user.bio}</p>
                    </div>
                </span>
            </div>
        </div>
    `
    userCard.addEventListener("click", () => showUser(user))
    return userCard 
}

function createUserHandler(event) {
    let modal = document.getElementById("myModal");
    modal.style.display = "none"

    let createForm = document.getElementById('createUserModal')
}

function fetchAllPosts() {
    fetch("http://localhost:3000/posts").then(resp => resp.json())
        .then(posts => renderPosts(posts))
}

function renderPosts(posts) {
    let mainContainer = findMainContainer()
    let showBox = findShowContainer()
    let postsContainer = document.createElement('div')
    
    mainContainer.classList.remove('parallax')
    postsContainer.classList.add('card-columns')
    postsContainer.classList.add('posts-container')
    postsContainer.style.paddingTop = '15px'
    showBox.innerHTML =""
    mainContainer.innerHTML = ""

    let header = document.createElement('h1')
    let p = document.createElement('p')
    header.innerText = "Explore Posts"
    p.innerHTML = `
        or <a href="#" id="new-post">write a new one</a>
    `
    p.addEventListener("click", createNewPostModal)
    header.style.marginLeft = '10px'
    header.style.marginRight = '10px'
    header.style.marginTop = '10px'
    p.style.marginRight = '10px'
    p.style.marginLeft = '20px'

    header.classList.add('center')
    
    posts.forEach(post => {
        postsContainer.append(makePostCard(post))
    })
    
    mainContainer.append(header, p, postsContainer)
    createNewPostModal()
}

function makePostCard(post) {
    let card = document.createElement('div')

    card.innerHTML = `
        <div class="card">
            <div class="card-header">Posted ${post.created_at.substring(0,10)}</div>
            <div class="card-body">
                <span>
                    <div>
                        <img class="post-card-images" src="${post.image}">
                    </div>
                    <hr>
                    <div id="post-body">
                        <h5 class="card-title"">${post.subject}</h5>
                        <p class="card-text">${post.body.substr(0,200)}...</p>
                    </div>
                </span>
            </div>
        </div>
    `
    console.log(post)
    card.addEventListener("click", () => showPost(post))
    return card
}

function showUser(user) { 
    // creating userContainer
    let userContainer = document.createElement('span')
    let showContainer = findShowContainer()
    let mainContainer = findMainContainer()
    userContainer.innerHTML = ""
    showContainer.innerHTML = ""
    mainContainer.innerHTML = ""
    mainContainer.classList.remove('parallax')
    showContainer.append(userContainer)
    showContainer.classList.add('show-content')

    let fullName = user.first_name + " " + user.last_name
    let postsLength
    if (user.posts !== undefined || user.posts !== null) {
        postsLength = user.posts.length
    } else {
        postsLength = 0
    }

    let container = document.createElement('div')
    container.innerHTML = `
        <div class="card mb-3">
            <img src="${user.image}" class="card-img-top show-user-picture" alt="...">
            <div class="card-body">
                <h5 class="card-title">${fullName}</h5>
                <p class="card-text">${user.bio}</p>
                <p class="card-text"><small class="text-muted">${postsLength} posts</small></p>
            </div>
        </div>
    `

    if (user.id == localStorage.id) {
        let span = document.createElement('span')
        span.classList.add('row')
        span.style.marginLeft = '5px'
        let editBtn = document.createElement('button')
        editBtn.innerText = "Edit Profile"
        editBtn.classList.add('btn-secondary', 'rounded')
        editBtn.style.margin = '5px'
        editBtn.addEventListener("click", () => editUserHandler(user))
        span.append(editBtn)

        container.append(span)
    }

    userContainer.append(container)
}

function editUserHandler(user) {
    let updateUserModal = document.getElementById("updateUserModal");
    let updateSpan = document.getElementsByClassName("close")[1];
    let form = document.getElementById('update-user-form')
    form.addEventListener("submit", () => saveUpdatedUser(user))
    form.update_username.value = user.username
    form.update_password.value = user.password_digest
    form.update_bio.value = user.bio
    form.update_first_name.value = user.first_name
    form.update_last_name.value = user.last_name
    form.update_age.value = user.age
    form.update_image.value = user.image

    
    updateUserModal.style.display = "block";
    updateSpan.onclick = function() {
        updateUserModal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == updateUserModal) {
          updateUserModal.style.display = "none";
        }
    }
}

function saveUpdatedUser(user) {
    let firstName = event.target.update_first_name.value
    let lastName = event.target.update_last_name.value
    let age = event.target.update_age.value
    let username = event.target.update_username.value
    let password = event.target.update_password.value
    let bio = event.target.update_bio.value
    let image = event.target.update_image.value


    let payload = {first_name: firstName, last_name: lastName, age: age, username: username, password_digest: password, bio: bio, image: image}

    fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(payload)
    }).then(resp => resp.json()).then(user => {
        setLoggedIn(user)
        showUser(user)

    })

    event.target.reset()
    event.target.parentNode.parentNode.style.display = "none";
}
