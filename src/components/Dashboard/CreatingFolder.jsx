import React from "react";

export default function CreatingFolder({
	msgError,
	folderName,
	setFolderName,
	setFolderDescription,
	handleCreateFolder,
}) {
	return (
		<div className="flex justify-center items-center bg-[rgba(0,0,0,0.7)] w-full h-full top-0 left-0 fixed z-50 px-4 overflow-no-width overflow-x-hidden overflow-y-scroll">
			<div className="create-folder-modal w-[400px] h-fit flex flex-col justify-center items-center gap-4 rounded-xl bg-white p-5">
				{msgError && (
					<div
						className={`bg-red-500 rounded-xl text-white text-sm w-full h-fit px-4 py-2 flex justify-center items-center`}
					>
						<p>{msgError}</p>
					</div>
				)}

				<div className="flex flex-col justify-center items-start gap-1 w-full">
					<h1 className="title-h1">Create Folder</h1>
					<p className="text-sm text-gray-500">
						This folder will hold all of your quizzes and flashcards.
					</p>
				</div>

				<form className="flex flex-col justify-center items-start gap-4 w-full">
					<div className="flex flex-col justify-center items-start gap-1 w-full">
						<div className="flex justify-between items-center gap-2 w-full">
							<div className="flex justify-center items-center gap-2">
								<label className="font-medium" htmlFor="name">
									Name
								</label>
								<p className="text-sm text-gray-400">required</p>
							</div>

							<p
								className={`text-sm ${
									folderName.length > 100 && "text-red-500"
								}`}
							>
								{folderName.length}/100
							</p>
						</div>
						<input
							className="input-field w-full"
							onChange={(e) => setFolderName(e.target.value)}
							placeholder="Chemistry"
							type="text"
						/>
					</div>

					<div className="flex flex-col justify-center items-start gap-1 w-full">
						<div className="flex justify-between items-center gap-2">
							<label className="font-medium" htmlFor="name">
								Description
							</label>
							<p className="text-sm text-gray-400">optional</p>
						</div>
						<textarea
							className="input-field w-full min-h-[150px] max-h-[150px]"
							onChange={(e) => setFolderDescription(e.target.value)}
							placeholder="This folder is focused on chemistry problem-sets from MIT"
							type="text"
							rows={5}
						/>
					</div>

					<button onClick={handleCreateFolder} className="btn w-full">
						Create Folder
					</button>
				</form>
			</div>
		</div>
	);
}
