import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function NoteFolder({
	noteFolder,
	folderMaterialSystem,
	handleOpenNoteFolder,
}) {
	const [noteDeletionWarning, setNoteDeletionWarning] = useState(false);
	const [editTitle, setEditTitle] = useState(false);
	const [changeTitle, setChangeTitle] = useState("");

	const handleNoteDeletionWarning = () => {
		setNoteDeletionWarning(!noteDeletionWarning);
	};

	const handleDeleteNote = () => {
		folderMaterialSystem.deleteMainMaterial(noteFolder.id);
	};

	useEffect(() => {
		const closeModal = (e) => {
			if (!e.target.closest(".note-delete-folder-modal")) {
				setNoteDeletionWarning(false);
			}
		};

		document.addEventListener("mousedown", closeModal);
		return () => document.removeEventListener("mousedown", closeModal);
	}, []);

	const handleEditNoteTitle = () => {
		setEditTitle(!editTitle);
		setNoteDeletionWarning(false);
	};

	const handleChangeTitle = () => {
		if (changeTitle) {
			setEditTitle(false);
			setChangeTitle("");
			folderMaterialSystem.updateMainMaterialTitle(changeTitle, noteFolder.id);
		}
	};

	return (
		<div className="w-full h-auto flex flex-col justify-start items-start gap-1">
			<div className="w-full relative flex flex-col justify-start items-center gap-1">
				<div className="w-full relative flex justify-between items-center">
					<button
						onClick={() => handleOpenNoteFolder(noteFolder.id)}
						className="text-btn bg-gray-100 rounded-l-lg px-4 pt-3 pb-2 w-full flex flex-col justify-start items-start overflow-with-height overflow-x-scroll overflow-y-hidden"
					>
						<p className="text-gray-500 text-sm">Notes: 0</p>
						<p className="whitespace-nowrap font-medium">{noteFolder.title}</p>
					</button>

					<div className="relative flex justify-center items-center bg-[#2871FF] px-2 w-auto h-full rounded-r-lg">
						<button
							className="text-btn relative h-full"
							onClick={handleNoteDeletionWarning}
						>
							<Image
								className="object-cover min-w-[25px] min-h-[25px]"
								src={"/icons/more_vert.svg"}
								alt="logo"
								width={25}
								height={25}
							/>
						</button>
					</div>

					{noteDeletionWarning && (
						<div className="note-delete-folder-modal absolute top-1/2 -translate-y-1/2 right-12 w-fit h-fit bg-white rounded-lg px-3 py-2 z-10 text-sm flex flex-col justify-center items-start gap-1">
							<button
								onClick={handleEditNoteTitle}
								className="text-btn flex justify-center items-center gap-1 base-text"
							>
								<p>Edit Title</p>
							</button>

							<button
								onClick={handleDeleteNote}
								className="text-btn flex justify-center items-center gap-1 text-red-500"
							>
								<p>Delete</p>
							</button>
						</div>
					)}
				</div>

				{editTitle && (
					<div className="flex flex-col sm:flex-row justify-start items-start gap-1 w-full">
						<input
							className="input-field w-full"
							type="text"
							placeholder="Edit Title"
							onChange={(e) => setChangeTitle(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleChangeTitle()}
						/>

						<button
							className="btn h-full w-full sm:w-fit"
							onClick={handleChangeTitle}
						>
							Change
						</button>

						<button
							onClick={handleEditNoteTitle}
							className="btn !bg-red-500 h-full w-full sm:w-fit"
						>
							Cancel
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
