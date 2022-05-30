import React, {useState, useEffect} from 'react';

import getRandomInt from './utils/getRandomInt';
import { getCommentData, getCommenterData, postComment, updateUpvoteById } from './utils/commentAPI';

import Comment from "./components/Comment";
import SnackBar from './components/SnackBar';


function App() {
  const [inputComment, setInputComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isNewComment, setIsNewComment] = useState(false);
  const [commentData, setCommentData] = useState(null);
  const [commenterData, setCommenterData] = useState(null);
  const [showSucceedPost, setShowSucceedPost] = useState(false);
  const [showNotAbleToUpvote, setShowNotAbleToUpvote] = useState(false);

  const handleInputComment = (value) => {
    setInputComment(value);
  }

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (inputComment === '') return;
    let commenterId = getRandomInt(1, 15);

    let newCommentObj = {
      commenterId: commenterId,
      comment: inputComment,
      postId: 4
    }

    postComment(newCommentObj)
      .then(() => {
        setIsNewComment(prevNewComment => !prevNewComment);
        return setShowSucceedPost(true);
      })
      .catch((err) => console.error(err))
      .finally(() => setInputComment(''))
  }

  const handleUpvote = (commentIdx, ableToUpvote) => {
    if (!ableToUpvote) return setShowNotAbleToUpvote(true);
    let upvotedComment = commentData.comments[commentIdx];
    let commentId = upvotedComment.id;

    setCommentData((prevState) => ({
      ...prevState,
      comments:
        [...prevState.comments.map((item, idx) => {
          if (idx === commentIdx) {
            return {...item, upvoted_score: (item.upvoted_score)+1}
          }
          return item;
        })]
    }))

    updateUpvoteById(commentId);
  };

  const handleCloseSnackBar = (clickedSnackbar) => {
    if (clickedSnackbar === "addedPost") return setShowSucceedPost(false);
    if (clickedSnackbar === "upvotedFail") return setShowNotAbleToUpvote(false);
  }

  const fetchCommentData = () => {
    return (getCommentData())
      .then(commentData => {
        setCommentData(commentData.data);
        return Object.values(commentData.data.comments).map(x => x.commenter_id)
      })
      .then(ids => Promise.all(ids.map(id => getCommenterData(id))))
      .then(resCommenterData => {
        setCommenterData(resCommenterData);
        setIsLoading(false);
        return;
      })
  }

  useEffect(() => {
    setIsLoading(true);
    fetchCommentData();
  }, [isNewComment]);

  useEffect(() => {
    if (showSucceedPost) {
      const timeout = setTimeout(() => setShowSucceedPost(false), 4000);
      return () => {
        clearTimeout(timeout);
      }
    }

    if (showNotAbleToUpvote) {
      const timeout = setTimeout(() => setShowNotAbleToUpvote(false), 4000);
      return () => {
        clearTimeout(timeout);
      }
    }
  }, [showSucceedPost, showNotAbleToUpvote]);

  console.log(commenterData);

  return (
    <div className="App">
      <main className="flex flex-col">
        <div className="container max-w-[95%] md:max-w-[85%] mx-auto">

          { showSucceedPost && (
            <SnackBar
              type="success"
              body="You succesfully added your comment"
              onClose={(e) => handleCloseSnackBar("addedPost")}
            />
          )}

          { showNotAbleToUpvote  && (
            <SnackBar
              type="warning"
              body="You just submit the comment, you couldn't upvote immediately. Take a break and do refresh"
              onClose={(e) => handleCloseSnackBar("upvotedFail")}
            />
          )}

          <h1 className="text-slate-900 font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-center py-10 md:mt-10 mt-5">Discussion</h1>
          <div className="relative mt-2 md:mt-5">
            <form id="form-main-comment" onSubmit={(e) => handleSubmitComment(e)}>
              <div className="flex md:justify-center">
                <div className="flex flex-row sm:overflow-hidden items-center min-w-[90%] md:min-w-[70%] sm:min-w-[80%]">
                  <div className="aspect-square">
                    <img className="rounded-full object-cover" src="https://randomuser.me/api/portraits/women/17.jpg" alt="Photo user" width="45" height="45"/>
                  </div>
                  <div className="flex md:ml-2 w-full">
                    <div className="mr-1 md:mr-2 min-w-[87.5%]">
                      <textarea
                        id="input-main-comment"
                        name="comment"
                        rows="1"
                        className="resize-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md align-middle min-w-full p-1 md:p-2"
                        placeholder="What are your thoughts?"
                        value={inputComment}
                        onChange={e => handleInputComment(e.target.value)}
                      >
                      </textarea>
                    </div>
                    <button
                      id="btn-submit-main-comment"
                      type="submit"
                      className={`rounded-md p-1 md:p-2 ${inputComment === '' ? 'cursor-not-allowed bg-indigo-300' : 'bg-indigo-500'}`}
                    >
                      <p className="text-white">Comment</p>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          {(!isLoading)
            ?  commenterData.length > 0 ? (<>
                <div className="relative my-5 md:my-12">
                  <div className="flex md:justify-center">
                    <div id="comments--container" className="flex flex-col border-t border-slate-200 w-[90%] md:w-[70%] sm:w-[80%] pt-8">
                      {commenterData.map((commenter, idx) => (
                        <Comment
                          key={`${idx}--comment`}
                          commenterData={commenter}
                          commentData={commentData.comments[idx]}
                          handleChange={() => handleUpvote(idx, true)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </>) : (<>
                <div className="relative my-5 md:my-12">
                  <div className="flex justify-center">
                    <p>Data is empty</p>
                  </div>
                </div>
              </>)
            :  (<>
                <div className="relative my-5 md:my-12">
                  <div className="flex justify-center">
                    <p>Loading...</p>
                  </div>
                </div>
              </>)}
        </div>
      </main>
    </div>
  );
}

export default App;
