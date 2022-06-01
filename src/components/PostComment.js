const PostComment = ({main, onHandleSubmitComment, onHandleInputComment, inputComment}) => {
	return (
		<>
			<form id="form-main-comment" onSubmit={onHandleSubmitComment}>
				<div className={`flex ${main ? 'md:justify-center' : 'md:justify-start'}`}>
					<div className={`flex flex-row items-center ${main ? 'min-w-[90%] md:min-w-[70%] sm:min-w-[80%]' : 'min-w-full'}`}>
						<div className="aspect-square">
							<img
								className="rounded-full object-cover"
								src="https://randomuser.me/api/portraits/women/17.jpg"
								alt="Photo user"
								width = {main ? 45: 35}
								height = {main ? 45: 35}
								// width={main ? '35 md:45' : '20 md:35'}
								// height={main ? '35 md:45' : '20 md:35'}
							/>
						</div>
						<div className="flex ml-1 md:ml-2 sm:w-full">
							<div className="mr-1 md:mr-2 sm:min-w-[87.5%]">
								<textarea
									id="input-main-comment"
									name="comment"
									rows="1"
									className="resize-none focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md align-middle sm:min-w-full p-1 md:p-2 text-sm md:text-base"
									placeholder="What are your thoughts?"
									value={inputComment}
									onChange={onHandleInputComment}
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
		</>
	)
};

export default PostComment;