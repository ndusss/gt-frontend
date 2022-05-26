const commentsList = document.getElementById("comments--container");
const formMainComment = document.getElementById("form-main-comment");
const inputMainComment = document.getElementById("input-main-comment");
const buttonMainComment = document.getElementById("btn-submit-main-comment");

const API_URL = `https://ghost-task-backend.herokuapp.com`;

// Convert time to `4 minutes ago`, `2 years ago`, and so on
const printTime = (num, time) => {
  return `${num} ${num === 1 ? time : `${time}s`} ago`
}

const timeSince = (date) => {
  let secondsDate = new Date(date) - 1000;
  let seconds = Math.floor((new Date() - secondsDate) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    let num = Math.floor(interval);
    return printTime(num, "year");
  }

  interval = seconds / 2592000;
  if (interval > 1) {
    let num = Math.floor(interval);
    return printTime(num, "month");
  }

  interval = seconds / 86400;
  if (interval > 1) {
    let num = Math.floor(interval);
    if (num === 1) return "Yesterday";
    return num + " days ago";
  }

  interval = seconds / 3600;
  if (interval > 1) {
    let num = Math.floor(interval);
    return printTime(num, "hour");
  }

  interval = seconds / 60;
  if (interval > 1) {
    let num = Math.floor(interval);
    return printTime(num, "minute");
  }

  let num = Math.floor(seconds);
  return printTime(num, "second");
}

// Random Number
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// SHOW COMMENTS

// GET User
const fetchUserById = async (userId) => {
  let name = null, imageUrl = null;
  await fetch(`https://dummyjson.com/users/${userId}`)
    .then((res) => res.json())
    .then(data => {
      name = `${data.firstName} ${data.lastName}`;
      imageUrl = data.image;
    })
    .catch((error) => console.error('Error: ',error));
  return [name, imageUrl];
}

// GET All Comments
const fetchAllComments = async () => {
  const fetchData = await fetch(`${API_URL}/comment`, {
    method: 'GET',
    credentials: 'include'
  })
    .then((res) => res.json())
    .then(data => data)
    .catch((error) => console.error('Error: ',error));
  return fetchData;
}

const commentComponent = (commenterData, commentData) => {
  let name = commenterData ? commenterData[0] : 'Name';
  let imageURL = commenterData ? commenterData[1] : 'https://randomuser.me/api/portraits/women/17.jpg';
  let createdTime = timeSince(commentData.created_at);
  return (
    `<div class="mt-2 md:mt-4">
      <div class="aspect-square box-border float-left mr-2 ">
        <img class="rounded-full object-cover" src=${imageURL} alt="Photo user" width="45" height="45"/>
      </div>
      <div class="overflow-hidden">
        <span class="flex flex-row">
          <p class="text-slate-600 font-semibold">${name}</p>
          <p class="font-light">・ ${createdTime}</p>
        </span>
        <p class="text-slate-600 font-normal">${commentData.comment}</p>
        <span class="flex flex-row">
          <p>${commentData.upvoted_score} ▲ Upvote</p>
        </span>
      </div>
     </div>`
  );
}

const renderDataComments =  async () => {
  let commentObj = await fetchAllComments();
  let countComment = commentObj['count'], allComments = commentObj['comments'];
  let commentData = allComments.map((comment, idx) => {
    return fetchUserById(comment.commenter_id)
      .then(commenter => commenter)
      .then(commenter => commentComponent(commenter, comment))
  });
  Promise.all(commentData).then(res => commentsList.innerHTML = res.join(''));
}

renderDataComments();

// POST comment
const postComment = async (newCommentObj) => {
  await fetch(`${API_URL}/comment`, {
    method: "POST",
    credentials: 'include',
    body: JSON.stringify(newCommentObj),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
  .then(res => res)
  .catch(error => console.error('Err: ', error))
}


formMainComment.addEventListener("submit", e => {;
  e.preventDefault();
  let newComment = inputMainComment.value;
  let commenterId = getRandomInt(0, 15);
  let newCommentObj = {
    commenterId: commenterId,
    comment: newComment,
    postId: 4
  }
  postComment(newCommentObj);
  inputMainComment.value = "";
})