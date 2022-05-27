const SubmitComment = () => {
	return (
		<form action="#" method="POST" id="form-main-comment">
			<div className="flex justify-center">
				<div className="flex flex-row sm:overflow-hidden items-center min-w-[70%]">
					<div className="aspect-square">
						<img className="rounded-full object-cover" src="https://randomuser.me/api/portraits/women/17.jpg" alt="Photo user" width="45" height="45"/>
					</div>
					<div className="flex ml-2 w-full">
						<div className="mr-2 min-w-[87.5%]">
							<textarea id="input-main-comment" name="comment" rows="1"
							className="resize-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md align-middle min-w-full p-2"
							placeholder="What are your thoughts?"></textarea>
						</div>
						<button id="btn-submit-main-comment" type="submit" className="bg-indigo-500 rounded-md p-2">
							<p className="text-white">Comment</p>
						</button>
					</div>
				</div>
			</div>
		</form>
	)
};

export default SubmitComment;