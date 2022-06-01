import { useState } from 'react';

import timeSince from "../utils/timeSince";
import PostComment from './PostComment';

const Comment = ({
  root,
  commenterData,
  commentData,
  onHandleUpvote,
  inputComment,
  onHandleInputComment,
  onHandleSubmitComment,
  rootCount,
  repliesCount
}) => {

  const [wantReply, setWantReply] = useState(false);


  // let commentId = commentData ? commentData.id : 0;
  // let parentCommentId = commentData ? commentData.parent_comment_id : 0;

  // let commenterId = commenterData[0];
  let name = commenterData[1] || 'User';
	let imageURL = commenterData[2] || 'https://randomuser.me/api/portraits/women/17.jpg';

  let time = commentData ? commentData.created_at : 0;
  let createdTime = time ? timeSince(time) : `0 second ago`;
  let commentText = commentData? commentData.comment : 'Text';
  let upvotedScore = commentData ? commentData.upvoted_score : 0;

  const handleReply = () => {
    setWantReply(!wantReply);
  }

	return (
    <div className="mt-2 md:mt-4">
      <div
        className="aspect-square box-border float-left mr-2"
      >
        <img className="rounded-full object-cover" src={`${imageURL}`} alt="Photo user" width="45" height="45" />
      </div>
      {repliesCount !== undefined && (
        <div
          className={`border-2-2 absolute border-slate-300 border`}
          style={{
            height: `${(repliesCount*10)-((repliesCount+rootCount)*3)+(repliesCount > 3 ? repliesCount > 10 ? 20 : -5 : 40)}%`,
            left: '16.85%',
            marginTop: '45px'
          }}
        >
        </div>
      )}
      <div className="overflow-hidden">
        <span className="flex flex-row">
          <p className="text-slate-600 font-semibold text-sm md:text-base">{name}</p>
          <p className="font-light text-slate-400 text-sm md:text-base">・ {createdTime}</p>
        </span>
        <p className="text-slate-600 font-normal md:my-1">{commentText}</p>
        {root ? <>
          <div className="flex flex-row">
            <button className="flex flex-row" onClick={onHandleUpvote}>
              <p className="text-slate-500 font-normal text-sm md:text-base">{upvotedScore} ▲ Upvote</p>
            </button>
            <button className="flex flex-row ml-4 sm:ml-8" onClick={() => handleReply()}>
              <p className="text-slate-500 font-normal text-sm md:text-base">Reply</p>
            </button>
          </div>
          {wantReply && (<>
            <div className="mt-2 md:mt-4">
              <PostComment
                onHandleSubmitComment={onHandleSubmitComment}
                inputComment={inputComment}
                onHandleInputComment={onHandleInputComment}
              />
            </div>
          </>)}
        </> : <>
          <button className="flex flex-row" onClick={onHandleUpvote}>
              <p className="text-slate-500 font-normal text-sm md:text-base">{upvotedScore} ▲ Upvote</p>
            </button>
        </>}
      </div>
    </div>
	)
};

export default Comment;