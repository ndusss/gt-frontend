import React, {useState, useEffect} from 'react';

import getRandomInt from './utils/getRandomInt';
import { getAllComments, getCommenterData, postComment, updateUpvoteById } from './utils/commentAPI';

import Comment from "./components/Comment";
import SnackBar from './components/SnackBar';
import PostComment from './components/PostComment';

function App() {
  // Use state
  const [inputComment, setInputComment] = useState('');
  const [replyComment, setReplyComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isNewComment, setIsNewComment] = useState(false);
  const [commentData, setCommentData] = useState(null);
  const [commenterData, setCommenterData] = useState(null);
  const [showSucceedPost, setShowSucceedPost] = useState(false);

  // Handle functions
  const handleInputComment = (value) => {
    setInputComment(value);
  }

  const handleReplyComment = (value) => {
    setReplyComment(value);
  }

  const handleSubmitComment = (e, type, parentCommentId) => {
    e.preventDefault();
    if (type === 'main' && inputComment === '') return;
    if (type === 'reply' && replyComment === '') return;

    let commenterId = getRandomInt(1, 15);
    let text = `${type === 'main' ? inputComment : replyComment}`;

    let newCommentObj = {
      parentCommentId: parentCommentId,
      commenterId: commenterId,
      comment: text,
      postId: 4
    }

    postComment(newCommentObj)
      .then(() => {
        setIsNewComment(prevNewComment => !prevNewComment);
        return setShowSucceedPost(true);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setInputComment('');
        setReplyComment('');
      })
  }

  const handleUpvote = (commentIdx) => {
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
  }

  // Fetch root function
  const fetchCommentData = () => {
    return (getAllComments())
      .then(commentData => {
        setCommentData(commentData.data);
        return Object.values(commentData.data.comments).map(x => x.commenter_id)
      })
      .then(commenterLst => {
        return Promise.all(commenterLst.map(commenterId => getCommenterData(commenterId)));
      })
      .then(resCommenterData => {
        setCommenterData(resCommenterData);
        setIsLoading(false);
        return;
      })
  }

  const rootComments = commentData ?
    commentData.comments
      .map((commentData, idx) => ({...commentData, noRow: idx}))
      .filter(commentData => commentData.parent_comment_id === 0) : '';

  const getReplies = commentData ? (commentId) =>
    commentData.comments
      .map((commentData, idx) => ({...commentData, noRow: idx}))
      .filter((commentData) => commentData.parent_comment_id === commentId)
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ) : '';

  // Use Effect
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
  }, [showSucceedPost]);

  console.log(commenterData);

  return (
    <div className="App">
      <main className="flex flex-col">
        <div className="container max-w-[95%] md:max-w-[85%] mx-auto">

          { showSucceedPost && (
            <SnackBar
              type="success"
              body="You succesfully added your comment"
              onClose={() => handleCloseSnackBar("addedPost")}
            />
          )}

          <h1 className="text-slate-900 font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-center py-10 md:mt-10 mt-5">Discussion</h1>
          <div className="relative mt-2 md:mt-5">
            <PostComment
              main
              onHandleSubmitComment={(e) => handleSubmitComment(e, "main", 0)}
              inputComment={inputComment}
              onHandleInputComment={e => handleInputComment(e.target.value)}
            />
          </div>
          {(!isLoading)
            ?  commenterData.length > 0 ? (<>
                <div className="relative my-4 md:my-8">
                  <div className="flex md:justify-center">
                    <div
                      id="comments--container"
                      className="flex flex-col border-t border-slate-200 w-full sm:w-[95%] md:w-[70%] sm:w-[80%] pt-2 md:pt-6"
                    >
                      {rootComments.map((data, idx) => (
                        <>
                          {getReplies(data.id).length > 0 ? <>
                            <Comment
                              key={`${idx}--comment`}
                              root
                              rootCount={rootComments.length}
                              repliesCount={getReplies(data.id).length}
                              commenterData={commenterData[data.noRow]}
                              commentData={data}
                              onHandleUpvote={() => handleUpvote(data.noRow)}
                              onHandleInputComment={e => handleReplyComment(e.target.value)}
                              inputComment={replyComment}
                              onHandleSubmitComment={
                                (e) => handleSubmitComment(e, "reply", data.id)
                              }
                            />
                              <div className="mx-4 md:mx-10">
                              {getReplies(data.id).map((replyData, replyIdx) => (
                                <>
                                  <Comment
                                    key={`${replyIdx}--replyComment`}
                                    commenterData={commenterData[replyData.noRow]}
                                    commentData={replyData}
                                    onHandleUpvote={() => handleUpvote(replyData.noRow)}
                                  />
                                </>))
                              }
                            </div>
                          </> : <>
                            <Comment
                              key={`${idx}--comment`}
                              root
                              commenterData={commenterData[data.noRow]}
                              commentData={data}
                              onHandleUpvote={() => handleUpvote(data.noRow)}
                              onHandleInputComment={e => handleReplyComment(e.target.value)}
                              inputComment={replyComment}
                              onHandleSubmitComment={
                                (e) => handleSubmitComment(e, "reply", data.id)
                              }
                              onHandleReplyUpvote={e => handleUpvote(e)}
                            />
                          </>}
                        </>
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
