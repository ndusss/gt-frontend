import axios from 'axios';

import API_URL from './api';

export const getCommentData = async () => await axios.get(`${API_URL}/comment`);

export const getCommenterData = async (commenterId) => {
	let name, imageURL, id;
	await axios.get(`https://dummyjson.com/users/${commenterId}`)
		.then(res => {
			id = res.data.id;
			name = `${res.data.firstName} ${res.data.lastName}`
			imageURL = res.data.image;
		})
		.catch(error => console.error('Err: ', error));
	return [id, name, imageURL]
};

export const postComment = async (newCommentObj) => {
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
