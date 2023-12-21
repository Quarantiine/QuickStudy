import React, { useEffect, useState } from "react";
import Image from "next/image";
import FirebaseAPI from "../../pages/api/firebaseAPI";

export default function Bar({ user }) {
	const { auth, registration } = FirebaseAPI();
	const hiddenSections = [
		{
			title: "Recent Section",
			notHidden: user.hideSection1,
			uid: user.uid,
			id: 1,
		},
		{ title: "Folders", notHidden: user.hideSection2, uid: user.uid, id: 2 },
		{
			title: "More Study Material",
			notHidden: user.hideSection3,
			uid: user.uid,
			id: 3,
		},
		{ title: "Study Tips", notHidden: user.hideSection4, uid: user.uid, id: 4 },
	];
	const [hiddenFolderDropdown, setHiddenFolderDropdown] = useState(false);

	const handleHiddenFolderDropdown = () => {
		setHiddenFolderDropdown(!hiddenFolderDropdown);
	};

	useEffect(() => {
		const closeHiddenFolderDropdown = (e) => {
			if (!e.target.closest(".hidden-folder-dropdown")) {
				setHiddenFolderDropdown(false);
			}
		};

		document.addEventListener("mousedown", closeHiddenFolderDropdown);
		return () =>
			document.removeEventListener("mousedown", closeHiddenFolderDropdown);
	}, []);

	const handleShowHiddenFolder = (id) => {
		if (id === 1) {
			registration.hidingSection1(user.hideSection1, user.id);
		} else if (id === 2) {
			registration.hidingSection2(user.hideSection2, user.id);
		} else if (id === 3) {
			registration.hidingSection3(user.hideSection3, user.id);
		} else if (id === 4) {
			registration.hidingSection4(user.hideSection4, user.id);
		} else {
			console.log(`Error: Unknown ID: ${id}`);
		}
	};

	return (
		<>
			<div
				className={`flex justify-end items-center w-full rounded-xl px-5 py-3 ${
					user.theme ? "bg-[#444]" : "bg-gray-100"
				}`}
			>
				<div className="relative">
					<button
						onClick={handleHiddenFolderDropdown}
						className="flex justify-center items-center w-fit text-btn hidden-folder-dropdown"
					>
						<h1 className="">Hidden Sections</h1>
						<Image
							className={`object-contain ${
								hiddenFolderDropdown && "rotate-180"
							}`}
							src={
								user.theme
									? "/icons/expand_more.svg"
									: "/icons/expand_more_black.svg"
							}
							alt="icon"
							width={30}
							height={30}
							draggable={false}
						/>
					</button>

					{hiddenFolderDropdown && (
						<div className="hidden-folder-dropdown w-[210px] h-fit rounded-xl absolute top-10 right-0 bg-white shadow-md z-10 text-black p-3 flex flex-col justify-center items-start">
							{hiddenSections
								.filter((section) => section.uid === auth.currentUser.uid)
								.map((section) => {
									return (
										<React.Fragment key={section.id}>
											{!section.notHidden && (
												<button
													onClick={(e) => handleShowHiddenFolder(section.id)}
													className="flex justify-between items-center gap-2 w-full text-btn text-start text-sm"
												>
													<p>{section.title}</p>
													<Image
														src={"/icons/remove.svg"}
														alt="icon"
														width={20}
														height={20}
														draggable={false}
													/>
												</button>
											)}
										</React.Fragment>
									);
								})}

							{user.hideSection1 &&
								user.hideSection2 &&
								user.hideSection3 &&
								user.hideSection4 && (
									<div className="flex flex-col justify-center items-center gap-4 opacity-50 text-black mx-auto select-none">
										<p className="text-sm">All Sections Are Showing</p>
									</div>
								)}
						</div>
					)}
				</div>
			</div>
		</>
	);
}
