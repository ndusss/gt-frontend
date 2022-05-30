import timeSince from "../utils/timeSince";

const Comment = ({commenterData, commentData, handleChange}) => {
  let commenterId = commenterData[0];
  let name = commenterData[1] || 'User';
	let imageURL = commenterData[2] || 'https://randomuser.me/api/portraits/women/17.jpg';

  let time = commentData ? commentData.created_at : 0;
  let createdTime = time ? timeSince(time) : `0 second ago`;
  let commentText = commentData? commentData.comment : 'Text';
  let upvotedScore = commentData ? commentData.upvoted_score : 0;
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
        <button className="flex flex-row" onClick={handleChange}>
          <p className="text-slate-500 font-light">{upvotedScore} ▲ Upvote</p>
        </button>
      </div>
    </div>
	)
};

export default Comment;