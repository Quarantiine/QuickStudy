import React from "react";
import Image from "next/image";
import FirebaseAPI from "../../pages/api/firebaseAPI";

export default function AllFolders({
	searchQuery,
	folderSystem,
	setSearchQuery,
	handleOpenFolderModal,
}) {
	const { auth } = FirebaseAPI();

	return (
		<>
			<div className="flex justify-center items-center bg-[rgba(0,0,0,0.7)] w-full h-full top-0 left-0 fixed z-50 px-4 overflow-no-width overflow-x-hidden overflow-y-scroll">
				<div
					className={`all-folders-modal w-[80%] sm:w-[45%] h-fit flex flex-col justify-center items-center rounded-xl bg-white p-5 ${
						searchQuery.length < 1 ? "gap-4" : "gap-2"
					}`}
				>
					{folderSystem.allFolders
						.filter((folder) => folder.uid === auth.currentUser.uid)
						.map((folder) => folder).length < 1 ? (
						<div
							className={`w-full h-fit rounded-xl flex flex-col gap-2 justify-center items-center`}
						>
							<Image
								className="object-cover grayscale opacity-50"
								src={"/images/logo.png"}
								alt="logo"
								width={60}
								height={60}
								priority="true"
							/>
							<p className="text-lg text-gray-400">You have no folders</p>
						</div>
					) : (
						<>
							<h1 className="title-h1">Your Library</h1>
							<input
								className="input-field w-full"
								type="text"
								placeholder="Search Folder"
								onChange={(e) => setSearchQuery(e.target.value)}
							/>

							<div className="flex flex-col justify-start items-center gap-1 w-full min-h-[fit-content] max-h-[250px] overflow-no-width overflow-x-hidden overflow-y-scroll">
								{folderSystem.allFolders
									.filter((folder) => folder.uid === auth.currentUser.uid)
									.map((folder) => {
										if (
											folder.name
												.normalize("NFD")
												.replace(/\p{Diacritic}/gu, "")
												.toLowerCase()
												.includes(searchQuery.toLowerCase())
										) {
											return (
												<React.Fragment key={folder.id}>
													<button
														onClick={() => handleOpenFolderModal(folder.id)}
														className="flex justify-between items-center gap-2 w-full text-btn text-start"
													>
														<h1 className="text-xl line-clamp-1">
															{folder.name}
														</h1>
														<Image
															className="object-contain"
															src={"/icons/folder.svg"}
															alt="icon"
															width={23}
															height={23}
														/>
													</button>
												</React.Fragment>
											);
										}
									})}
							</div>
						</>
					)}

					{folderSystem.allFolders
						.filter(
							(folder) =>
								folder.uid === auth.currentUser.uid &&
								folder.name
									.normalize("NFD")
									.replace(/\p{Diacritic}/gu, "")
									.toLowerCase()
									.includes(searchQuery.toLowerCase())
						)
						.map((folder) => folder).length < 1 &&
						folderSystem.allFolders
							.filter((folder) => folder.uid === auth.currentUser.uid)
							.map((folder) => folder).length > 0 && (
							<div className="flex flex-col justify-center items-center text-lg">
								<p className="text-gray-400">No Folder Named:</p>
								<p className="font-medium">{searchQuery}</p>
							</div>
						)}
				</div>
			</div>
		</>
	);
}
