// write your code here
// finding image container and image card

const imgContainer = document.querySelector('.image-container')
const cardEl = document.querySelector('.image-card')


//creating the state

const state = {
    images: []
}

//Getting images from server

function getImgFromServer() {
    return fetch("http://localhost:3000/images")
        .then(function (resp) {
            return resp.json()
        })

}


// Making crud at server

function updateLikesOnServer(image) {
    return fetch(`http://localhost:3000/images/${image.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            likes: image.likes
        })
    }).then((resp) => resp.json());
}

function createCommentOnServer(imageId, content) {
    return fetch("http://localhost:3000/comments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            imageId: imageId,
            content: content
        })
    }).then(function (resp) {
        return resp.json();
    });
}

function deleteComentsFromServer(id) {
    return fetch(`http://localhost:3000/comments/${id}`, {
        method: "DELETE"
    });
}

function deleteImagesFromServer(id) {
    return fetch(`http://localhost:3000/images/${id}`, {
        method: "DELETE"
    });
}


//Creating image container

function renderImgContainer() {
    imgContainer.innerHTML = ''
    for (const container of state.images) {
        const articleEl = document.createElement('article')
        articleEl.setAttribute('class', 'image-card')

        const h2TextEl = document.createElement('h2')
        h2TextEl.textContent = container.title

        const imageEl = document.createElement('img')
        imageEl.setAttribute('class', 'image')
        imageEl.setAttribute('src', container.image)

        const deleteImgBtn = document.createElement('button')
        deleteImgBtn.textContent = 'X'
        deleteImgBtn.addEventListener('click', function () {
            state.images = state.images.filter((target) => target !== container)
            deleteImagesFromServer(container.id)
            render()
        })

        const likesDivEl = document.createElement('div')
        likesDivEl.setAttribute('class', 'likes-section')

        const spanEL = document.createElement('span')
        spanEL.setAttribute('class', 'likes')
        spanEL.textContent = container.likes

        const LikeButtonEl = document.createElement('button')
        LikeButtonEl.setAttribute('class', 'like-button')
        LikeButtonEl.textContent = '♥'
        LikeButtonEl.addEventListener('click', function () {
            container.likes++
            updateLikesOnServer(container)
            render()
        })

        const comentUlEl = document.createElement('ul')
        comentUlEl.setAttribute('class', 'comments')

        for (const comment of container.comments) {
            const comentLiEl = document.createElement('li')
            comentLiEl.textContent = comment.content

            const deleteBtn = document.createElement('button')
            deleteBtn.textContent = 'delete'
            deleteBtn.addEventListener('click', function () {


                container.comments = container.comments.filter((target) => target !== comment)
                deleteComentsFromServer(comment.id)
                render()
            })
            comentLiEl.append(deleteBtn)
            comentUlEl.append(comentLiEl)
        }

        const commentFormSection = document.createElement('form')
        commentFormSection.setAttribute('class', 'comment-form')

        const comentInputEl = document.createElement('input')
        comentInputEl.setAttribute('class', 'comment-input')
        comentInputEl.setAttribute('type', 'text')
        comentInputEl.setAttribute('name', 'comment')
        comentInputEl.setAttribute('placeholder', 'Add a comment')

        const cometBtnPost = document.createElement('button')
        cometBtnPost.setAttribute('class', 'comment-button')
        cometBtnPost.setAttribute('type', 'submit')
        cometBtnPost.textContent = 'Post'

        commentFormSection.addEventListener('submit', function (event) {
            event.preventDefault()

            const content = commentFormSection.comment.value
            createCommentOnServer(container.id, content).then(
                function (commentsFromServer) {
                    container.comments.push(commentsFromServer)
                    render()
                    commentFormSection.reset()
                })
        })
        likesDivEl.append(spanEL, LikeButtonEl)
        commentFormSection.append(comentInputEl, cometBtnPost)
        articleEl.append(h2TextEl, imageEl, likesDivEl, comentUlEl, commentFormSection, deleteImgBtn)
        imgContainer.append(articleEl)
    }
}

//Render image container and the server 

function render() {
    renderImgContainer()
}
getImgFromServer().then(function (imgDataFromServer) {
    state.images = imgDataFromServer
    render()
})
render()