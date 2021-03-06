import axios from 'axios';

import API_URL from './api';

export const getAllComments = async () => {
  return await axios.get(`${API_URL}/comment`)
    .then(res => res)
    .catch(err => console.error('Err: ', err));
}

export const getRootCommentData = async () => {
  return await axios.get(`${API_URL}/comment/parent`)
    .then(res => res)
    .catch(err => console.error('Err: ', err));
};

export const getChildrenCommentByParentId = async (parentId) => {
  return await axios.get(`${API_URL}/comment/children/${parentId}`)
    .then(res => res)
    .catch(err => console.error('Err: ', err));
};

export const getCommenterData = async (commenterId) => {
	let name, imageURL, id;
	await axios.get(`https://dummyjson.com/users/${commenterId}`)
		.then(res => {
			id = res.data.id;
			name = `${res.data.firstName} ${res.data.lastName}`
			imageURL = res.data.image;
		})
		.catch(error => console.error('Err: ', error));
  return [id, name, imageURL];
};

export const postComment = async (newCommentObj) => {
  return await fetch(`${API_URL}/comment`, {
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

export const updateUpvoteById = async (commentId) => {
  return await fetch(`${API_URL}/comment/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
  .then(res => res)
  .catch(error => console.error("Err: ", error))
}