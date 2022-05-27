import React, {useState, useEffect} from 'react';

import getRandomInt from './utils/getRandomInt';
import { getCommentData, getCommenterData, postComment } from './utils/commentAPI';

// import SubmitComment from "./components/SubmitComment";
import Comment from "./components/Comment";


function App() {
  const [inputComment, setInputComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isNewComment, setIsNewComment] = useState(false);
  const [newCommenter, setNewCommenter] = useState(null);
  const [newComment, setNewComment] = useState(null);
  const [commentData, setCommentData] = useState(null);
  const [commenterData, setCommenterData] = useState(null);

  const handleInputComment = (value) => {
    setInputComment(value);
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (inputComment === '') return;
    try {
      let commenterId = getRandomInt(1, 15);
      const newCommenterData = await getCommenterData(commenterId);
      setNewCommenter(newCommenterData);

      const newComment = {
        comment: inputComment,
        createdAt: new Date().toString(),
        upvoted_score: 0
      };
      setNewComment(newComment);

      let newCommentObj = {
        commenterId: commenterId,
        comment: inputComment,
        postId: 4
      }
      postComment(newCommentObj);
      setIsNewComment(true);
    } catch (err) {
      console.log(err);
    }
    setInputComment('');
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
  }, []);

  return (
    <div className="App">
      <main className="flex flex-col">
        <div className="container max-w-[85%] mx-auto">
          <h1 className="text-slate-900 font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-center py-10">Discussion</h1>
          <div className="relative mt-5 md:mt-2">
            <form id="form-main-comment" onSubmit={(e) => handleSubmitComment(e)}>
              <div className="flex justify-center">
                <div className="flex flex-row sm:overflow-hidden items-center min-w-[70%]">
                  <div className="aspect-square">
                    <img className="rounded-full object-cover" src="https://randomuser.me/api/portraits/women/17.jpg" alt="Photo user" width="45" height="45"/>
                  </div>
                  <div className="flex ml-2 w-full">
                    <div className="mr-2 min-w-[87.5%]">
                      <textarea
                        id="input-main-comment"
                        name="comment"
                        rows="1"
                        className="resize-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md align-middle min-w-full p-2"
                        placeholder="What are your thoughts?"
                        value={inputComment}
                        onChange={e => handleInputComment(e.target.value)}
                      >
                      </textarea>
                    </div>
                    <button id="btn-submit-main-comment" type="submit" className="bg-indigo-500 rounded-md p-2">
                      <p className="text-white">Comment</p>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          {(!isLoading && commenterData) ?  (<>
            <div className="relative my-5 md:my-12">
              <div className="flex justify-center">
                <div id="comments--container" className="flex flex-col border-t border-slate-200 max-w-[70%] pt-8">
                  {commenterData.map((commenter, idx) => (
                    <Comment key={`${idx}--comment`} commenterData={commenter} commentData={commentData.comments[idx]} />
                  ))}
                  {(isNewComment && (<Comment key={`new00--comment`} commenterData={newCommenter} commentData={newComment}/>))}
                </div>
              </div>
            </div>
          </>) : (
            (<>
              <div className="relative my-5 md:my-12">
                <div className="flex justify-center">
                  <p>Loading...</p>
                </div>
              </div>
            </>)
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
