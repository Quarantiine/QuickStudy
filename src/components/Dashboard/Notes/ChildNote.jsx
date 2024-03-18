import React, { useEffect, useState } from "react";
import Image from "next/image";
import FirebaseAPI from "../../../pages/api/firebaseAPI";

export default function ChildNote({ note }) {
	const { noteSystem } = FirebaseAPI();
	const [fullscreen, setFullscreen] = useState(false);
	const [editingTitle, setEditingTitle] = useState(false);
	const [editNoteTitle, setEditNoteTitle] = useState("");

	const handleFullscreen = () => {
		setFullscreen(!fullscreen);
	};

	const handleDeleteNote = () => {
		noteSystem.deleteNote(note.id);
	};

	const handleEditTitle = () => {
		setEditingTitle(!editingTitle);
	};

	const handleChangeTitle = () => {
		if (editNoteTitle) {
			noteSystem.editNote(editNoteTitle, note.id);
			setEditNoteTitle("");
			setEditingTitle(false);
		}
	};

	useEffect(() => {
		const closeEditing = (e) => {
			if (!e.target.closest(".note-input-field")) {
				setEditingTitle(false);
			}
		};

		document.addEventListener("mousedown", closeEditing);
		return () => document.removeEventListener("mousedown", closeEditing);
	}, [editingTitle]);

	return (
		<>
			{fullscreen && (
				<div className="fixed top-0 left-0 w-full h-full bg-[#222] z-10 flex justify-center items-center p-10">
					<button
						onClick={handleFullscreen}
						className="text-sm base-bg rounded-full p-1 text-btn z-10 absolute top-5 right-5 flex justify-center items-center"
					>
						<Image
							src={"/icons/cancel.svg"}
							alt="icon"
							width={30}
							height={30}
						/>
					</button>

					<Image
						className="object-contain rounded-lg"
						src={note.image}
						alt="img"
						fill
						sizes="(max-width: 768px) 100vw, 33vw"
					/>

					<h1 className="title-h1 shadow-2xl absolute bottom-10 left-1/2 -translate-x-1/2 bg-white rounded-lg px-3 py-1 text-center">
						{note.title}
					</h1>

					{/* <div className="flex justify-center items-center gap-1">
						<button
							onClick={null}
							className="text-sm base-bg rounded-full p-1 text-btn z-10 absolute top-1/2 -translate-y-1/2 left-5 flex justify-center items-center rotate-90"
						>
							<Image
								src={"/icons/expand_more_white.svg"}
								alt="icon"
								width={30}
								height={30}
							/>
						</button>

						<button
							onClick={null}
							className="text-sm base-bg rounded-full p-1 w-fit h-fit text-btn z-10 absolute top-1/2 -translate-y-1/2 right-5 flex justify-center items-center -rotate-90"
						>
							<Image
								src={"/icons/expand_more_white.svg"}
								alt="icon"
								width={30}
								height={30}
							/>
						</button>
					</div> */}
				</div>
			)}

			<div className="w-full h-[200px] bg-gray-300 rounded-lg flex flex-col justify-start items-start relative">
				{note?.image ? (
					<div className="w-full h-full relative">
						<div className="w-full h-full rounded-lg flex justify-center items-center text-center relative">
							<Image
								className="object-cover rounded-lg"
								src={note.image}
								alt="img"
								fill
								sizes="(max-width: 768px) 100vw, 33vw"
							/>
						</div>

						<div className="bg-gradient-to-b rounded-b-lg to-black from-transparent absolute top-0 left-0 w-full h-full flex flex-col justify-end items-start sm:flex-row sm:justify-between sm:items-end p-4 gap-2">
							{editingTitle ? (
								<input
									className="note-input-field input-field w-full"
									onChange={(e) => setEditNoteTitle(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleChangeTitle()}
									type="text"
									placeholder={`${note.title}`}
								/>
							) : (
								<p
									onDoubleClick={handleEditTitle}
									className="hidden sm:block line-clamp-1 whitespace-nowrap text-xl font-bold text-white"
								>
									{note.title}
								</p>
							)}

							<div className="w-fit flex justify-center items-center gap-1">
								<button
									onClick={handleDeleteNote}
									className="text-sm bg-red-500 rounded-lg p-2 text-btn"
								>
									<Image
										className="min-w-[15px] min-h-[15px] max-w-[15px] max-h-[15px]"
										src={"/icons/delete.svg"}
										alt="icon"
										width={15}
										height={15}
									/>
								</button>

								<button
									onClick={handleFullscreen}
									className="text-sm bg-[#2871FF] rounded-lg p-2 text-btn"
								>
									<Image
										className="min-w-[15px] min-h-[15px] max-w-[15px] max-h-[15px]"
										src={"/icons/open_in_full.svg"}
										alt="icon"
										width={15}
										height={15}
									/>
								</button>

								<button
									onClick={handleEditTitle}
									className="text-sm bg-[white] rounded-lg p-2 text-btn"
								>
									<Image
										className="min-w-[15px] min-h-[15px] max-w-[15px] max-h-[15px]"
										src={"/icons/edit.svg"}
										alt="icon"
										width={15}
										height={15}
									/>
								</button>
							</div>

							<p className="block sm:hidden line-clamp-1 text-xl font-bold text-white whitespace-nowrap">
								{note.title}
							</p>
						</div>
					</div>
				) : (
					<>
						<p className="line-clamp-1">{note.title}</p>
					</>
				)}
			</div>
		</>
	);
}
