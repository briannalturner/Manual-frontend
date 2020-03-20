document.addEventListener("DOMContentLoaded", fetchNewPosts)

function fetchNewPosts() {
    fetch("http://localhost:3000/posts").then(resp => resp.json())
        .then(posts => forEach(post => renderPost(post)))
}

function renderPost(post) {
    console.log(post)
}