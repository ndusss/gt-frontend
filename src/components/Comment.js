import timeSince from "../utils/timeSince";

const Comment = (data) => {
  let commenterId = data.commenterData[0];
  let name = data.commenterData[1];
	let imageURL = data.commenterData[2];

  let time = data.commentData.created_at;
  let createdTime = time ? timeSince(time) : `0 second ago`;
  let commentText = data.commentData.comment;
  let upvotedScore = data.commentData.upvoted_score;
	return (
    <div className="mt-2 md:mt-4">
      <div className="aspect-square box-border float-left mr-2 ">
        <img className="rounded-full object-cover" src={`${imageURL}`} alt="Photo user" width="45" height="45" />
      </div>
      <div className="overflow-hidden">
        <span className="flex flex-row">
          <p className="text-slate-600 font-semibold">{name}</p>
          <p className="font-light text-slate-400">・ {createdTime}</p>
        </span>
        <p className="text-slate-600 font-normal">{commentText}</p>
        <span className="flex flex-row">
          <p>{upvotedScore} ▲ Upvote</p>
        </span>
      </div>
    </div>
	)
};

export default Comment;