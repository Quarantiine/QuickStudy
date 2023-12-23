import React, { useContext, useEffect, useRef, useState } from "react";
import FirebaseAPI from "../../pages/api/firebaseAPI";
import Image from "next/image";
import { createPortal } from "react-dom";
import { UserCredentialsCtx } from "../../pages";
import NavbarFolders from "./NavbarFolders";

export default function Navbar({ user, openShortNavbar, setOpenShortNavbar }) {
	const { registration, folderSystem } = FirebaseAPI();
	const {
		createFolderModal,
		setCreateFolderModal,
		openFolderModal,
		setOpenFolderModal,
		folderID,
		handleOpenFolderModal,
		libraryDropdown,
		setLibraryDropdown,
		setViewAllFolders,
		setFolderID,
		handleOpenFlashCardsModal,
		handleOpenQuizzesModal,
		handleOpenTestsModal,
	} = useContext(UserCredentialsCtx);

	const [folderName, setFolderName] = useState("");
	const [folderDescription, setFolderDescription] = useState("");
	const [folderDeleteDropdown, setFolderDeleteDropdown] = useState(false);
	const [editFolderName, setEditFolderName] = useState(false);
	const [editFolderDescription, setEditFolderDescription] = useState(false);
	const changedFolderNameRef = useRef();
	const changedFolderDescriptionRef = useRef();

	const [msgError, setMsgError] = useState("");
	const msgErrorRef = useRef();

	const handleLogout = () => {
		setFolderID("");
		registration.logout();
	};

	const handleLibraryDropdown = () => {
		setLibraryDropdown(!libraryDropdown);
	};

	const handleOpenShortNavbar = () => {
		setOpenShortNavbar(!openShortNavbar);
	};

	useEffect(() => {
		const closeLibraryDropdown = (e) => {
			if (!e.target.closest(".library-dropdown")) {
				setLibraryDropdown(false);
			}
		};

		document.addEventListener("mousedown", closeLibraryDropdown);
		return () =>
			document.removeEventListener("mousedown", closeLibraryDropdown);
	}, []);

	useEffect(() => {
		const closeCreateFolderModal = (e) => {
			if (!e.target.closest(".create-folder-modal")) {
				setCreateFolderModal(false);
			}
		};

		document.addEventListener("mousedown", closeCreateFolderModal);
		return () =>
			document.removeEventListener("mousedown", closeCreateFolderModal);
	}, []);

	const handleCreateFolderModal = () => {
		setCreateFolderModal(!createFolderModal);
	};

	const handleCreateFolder = (e) => {
		e.preventDefault();
		clearTimeout(msgErrorRef.current);

		if (folderName.length <= 32 && folderName.length > 1) {
			folderSystem.addingFolder(
				folderName.trim(),
				folderDescription.trim(),
				user.uid
			);
			setCreateFolderModal(false);

			setFolderName("");
			setFolderDescription("");
		} else {
			setMsgError("Check Information");

			msgErrorRef.current = setTimeout(() => {
				setMsgError("");
			}, 4000);
		}
	};

	const handleViewAllFolders = () => {
		setViewAllFolders(true);
		setLibraryDropdown(false);
	};

	const handleFolderDeleteDropdown = (e) => {
		e.preventDefault();
		setFolderDeleteDropdown(!folderDeleteDropdown);
	};

	useEffect(() => {
		const closeFolderDeleteDropdown = (e) => {
			if (!e.target.closest(".folder-delete-dropdown")) {
				setFolderDeleteDropdown(false);
				setEditFolderName(false);
				setEditFolderDescription(false);
			}
		};

		document.addEventListener("mousedown", closeFolderDeleteDropdown);
		return () =>
			document.removeEventListener("mousedown", closeFolderDeleteDropdown);
	}, []);

	const handleDeleteFolder = (e, id) => {
		e.preventDefault();
		folderSystem.deletingFolder(id);
		setFolderDeleteDropdown(false);
		setOpenFolderModal(false);
	};

	const handleEditFolderName = (e) => {
		e.preventDefault();
		setEditFolderName(!editFolderName);
	};

	const handleEditFolderDescription = (e) => {
		e.preventDefault();
		setEditFolderDescription(!editFolderDescription);
	};

	const handleChangeFolderName = (e, id) => {
		e.preventDefault();

		if (changedFolderNameRef.current.value.length > 0) {
			setEditFolderName(false);
			folderSystem.updateFolderName(changedFolderNameRef.current.value, id);
		}
	};

	const handleChangeFolderDescription = (e, id) => {
		e.preventDefault();
		setEditFolderDescription(false);

		folderSystem.updateFolderDescription(
			changedFolderDescriptionRef.current.value,
			id
		);
	};

	return (
		<>
			{createFolderModal &&
				createPortal(
					<>
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
										This folder will hold all of your quizzes, test, and
										flashcards.
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
													folderName.length > 32 && "text-red-500"
												}`}
											>
												{folderName.length}/32
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
					</>,
					document.body
				)}

			<div
				className={`w-full h-fit flex sm:justify-start items-center bg-[#373f4e] px-7 py-7 z-50`}
			>
				<div className="flex justify-center items-center gap-2 w-fit">
					<h1 className="text-white italic font-semibold text-2xl hidden sm:block">
						QuickStudy
					</h1>
					<Image
						className="object-contain"
						src={"/images/logo.png"}
						alt="logo"
						width={30}
						height={30}
						draggable={false}
					/>
				</div>

				<div className="flex justify-center items-center gap-4 sm:gap-5 ml-auto text-white">
					<button onClick={handleOpenShortNavbar} className="text-btn">
						<Image
							className="object-contain block sm:hidden"
							src={openShortNavbar ? "/icons/cancel.svg" : "/icons/menu.svg"}
							alt="icon"
							width={25}
							height={25}
							draggable={false}
						/>
					</button>

					<div className="hidden sm:flex justify-center items-center gap-4">
						<button
							onClick={handleCreateFolderModal}
							className="flex justify-center items-center gap-1 text-btn"
						>
							<p>Create Folder</p>
							<Image
								className="object-contain"
								src={"/icons/add_circle.svg"}
								alt="icon"
								width={20}
								height={20}
							/>
						</button>

						<div className="relative">
							<button
								onClick={handleLibraryDropdown}
								className="flex justify-center items-center text-btn relative library-dropdown"
							>
								<p>Your Library</p>
								<Image
									className={`object-contain relative top-.5 ${
										libraryDropdown && "rotate-180"
									}`}
									src={"/icons/expand_more.svg"}
									alt="icon"
									width={27}
									height={27}
								/>
							</button>

							{openFolderModal &&
								createPortal(
									<>
										<div className="flex justify-center items-center bg-[rgba(0,0,0,0.7)] w-full h-full top-0 left-0 fixed z-50 px-4 overflow-no-width overflow-x-hidden overflow-y-scroll">
											<div className="folder-child-modal w-full md:w-[700px] h-fit flex flex-col justify-center items-start gap-5 rounded-xl bg-white p-5">
												{folderSystem.allFolders
													.filter((folder) => folder.uid === user.uid)
													.map((folder) => {
														return (
															<React.Fragment key={folder.id}>
																{folderID === folder.id && (
																	<>
																		<form className="flex flex-col justify-center items-start gap-4 w-full">
																			<div className="flex flex-col sm:flex-row justify-center sm:justify-between items-start sm:items-center gap-2 w-full">
																				{editFolderName ? (
																					<div className="flex justify-center items-center gap-2 w-full">
																						<input
																							className="input-field w-full folder-delete-dropdown"
																							placeholder={folder.name}
																							type="text"
																							ref={changedFolderNameRef}
																							onKeyDown={(e) =>
																								e.key === "Enter" &&
																								handleChangeFolderName(
																									e,
																									folder.id
																								)
																							}
																						/>
																						<div className="flex justify-center items-center gap-2">
																							<button
																								onClick={(e) =>
																									handleChangeFolderName(
																										e,
																										folder.id
																									)
																								}
																								className="folder-delete-dropdown btn text-sm sm:text-base flex justify-center items-center gap-1"
																							>
																								Change
																							</button>
																							<button
																								onClick={handleEditFolderName}
																								className="folder-delete-dropdown btn !text-[#2871FF] !bg-white border border-[#2871FF] text-sm sm:text-base flex justify-center items-center gap-1"
																							>
																								Cancel
																							</button>
																						</div>
																					</div>
																				) : (
																					<h1
																						onClick={handleEditFolderName}
																						className="text-btn !text-2xl sm:!text-3xl font-semibold title-h1"
																					>
																						{folder.name}
																					</h1>
																				)}

																				<div className="w-full h-fit flex justify-end items-center">
																					{!editFolderName && (
																						<div className="relative">
																							<button
																								onClick={
																									handleFolderDeleteDropdown
																								}
																								className="folder-delete-dropdown btn !bg-transparent !text-red-500 border border-red-500 text-sm sm:text-base flex justify-center items-center gap-1 w-[150px] sm:w-[160px]"
																							>
																								<p>Delete Folder</p>
																								<Image
																									className={`object-contain relative ${
																										folderDeleteDropdown &&
																										"rotate-180"
																									}`}
																									src={
																										"/icons/expand_more_red.svg"
																									}
																									alt="icon"
																									width={27}
																									height={27}
																								/>
																							</button>

																							{folderDeleteDropdown && (
																								<div className="folder-delete-dropdown absolute top-10 left-0 w-full h-fit shadow-xl rounded-xl z-10 bg-white p-2 flex flex-col justify-center items-start gap-2 text-sm">
																									<button
																										onClick={(e) =>
																											handleDeleteFolder(
																												e,
																												folder.id
																											)
																										}
																										className="btn w-full !bg-red-500"
																									>
																										Delete
																									</button>
																									<button
																										onClick={
																											handleFolderDeleteDropdown
																										}
																										className="btn w-full folder-delete-dropdown"
																									>
																										Cancel
																									</button>
																								</div>
																							)}
																						</div>
																					)}
																				</div>
																			</div>

																			{editFolderDescription ? (
																				<div className="flex justify-center items-center gap-2 w-full">
																					<input
																						className="input-field w-full folder-delete-dropdown"
																						placeholder={folder.description}
																						type="text"
																						ref={changedFolderDescriptionRef}
																						onKeyDown={(e) =>
																							e.key === "Enter" &&
																							handleChangeFolderDescription(
																								e,
																								folder.id
																							)
																						}
																					/>
																					<div className="flex justify-center items-center gap-2">
																						<button
																							onClick={(e) =>
																								handleChangeFolderDescription(
																									e,
																									folder.id
																								)
																							}
																							className="folder-delete-dropdown btn text-sm sm:text-base flex justify-center items-center gap-1"
																						>
																							Change
																						</button>
																						<button
																							onClick={
																								handleEditFolderDescription
																							}
																							className="folder-delete-dropdown btn !text-[#2871FF] !bg-white border border-[#2871FF] text-sm sm:text-base flex justify-center items-center gap-1 folder-delete-dropdown"
																						>
																							Cancel
																						</button>
																					</div>
																				</div>
																			) : (
																				<div className="w-full h-fit max-h-[100px] overflow-with-width overflow-x-hidden overflow-y-scroll">
																					<p
																						onClick={
																							handleEditFolderDescription
																						}
																						className="text-btn text-gray-500"
																					>
																						{folder.description}
																					</p>
																				</div>
																			)}
																		</form>

																		<div
																			className={`grid grid-cols-[auto_auto_auto] gap-7 justify-start lg:justify-between items-center w-full h-fit overflow-no-height overflow-x-scroll overflow-y-hidden rounded-xl relative `}
																		>
																			<div className="w-[200px] h-[150px] rounded-xl bg-gray-100 p-4 flex flex-col justify-start items-start">
																				<h1 className="text-xl font-semibold">
																					Flash Cards
																				</h1>
																				<p>0 Items</p>
																				<button
																					onClick={handleOpenFlashCardsModal}
																					className="btn w-full mt-auto"
																				>
																					Open
																				</button>
																			</div>

																			<div className="w-[200px] h-[150px] rounded-xl bg-gray-100 p-4 flex flex-col justify-start items-start">
																				<h1 className="text-xl font-semibold">
																					Quizzes
																				</h1>
																				<p>0 Items</p>
																				<button
																					onClick={handleOpenQuizzesModal}
																					className="btn w-full mt-auto"
																				>
																					Open
																				</button>
																			</div>

																			<div className="w-[200px] h-[150px] rounded-xl bg-gray-100 p-4 flex flex-col justify-start items-start">
																				<h1 className="text-xl font-semibold">
																					Tests
																				</h1>
																				<p>0 Items</p>
																				<button
																					onClick={handleOpenTestsModal}
																					className="btn w-full mt-auto"
																				>
																					Open
																				</button>
																			</div>
																		</div>
																	</>
																)}
															</React.Fragment>
														);
													})}
											</div>
										</div>
									</>,
									document.body
								)}

							{libraryDropdown &&
								(folderSystem.allFolders
									.filter((folder) => folder.uid === user.uid)
									.map((folder) => folder).length < 1 ? (
									<div className="library-dropdown flex flex-col justify-center items-center gap-2 w-[150px] h-fit rounded-xl absolute top-10 right-0 bg-white text-black shadow-md z-10 text-sm p-2 line-clamp-1 overflow-ellipsis">
										<p className="text-sm text-center text-gray-400">
											You have no folders
										</p>
									</div>
								) : (
									<>
										<div className="library-dropdown flex flex-col justify-center items-start gap-2 w-[150px] h-fit rounded-xl absolute top-10 right-0 bg-white text-black shadow-md z-10 text-sm p-2 line-clamp-1 overflow-ellipsis">
											<div className="flex flex-col justify-center items-start gap-1 w-full">
												{folderSystem.allFolders
													.filter((folder) => folder.uid === user.uid)
													.slice(0, 5)
													.map((folder) => {
														return (
															<React.Fragment key={folder.id}>
																<NavbarFolders
																	folder={folder}
																	handleOpenFolderModal={handleOpenFolderModal}
																/>
															</React.Fragment>
														);
													})}
											</div>

											<button
												onClick={handleViewAllFolders}
												className="btn w-full text-sm"
											>
												View All
											</button>
										</div>
									</>
								))}
						</div>
					</div>

					<button
						onClick={handleLogout}
						className="flex justify-center items-center gap-1 btn w-fit ml-auto"
					>
						<p>Logout</p>
						<Image
							className="object-contain"
							src={"/icons/logout.svg"}
							alt="icon"
							width={20}
							height={20}
						/>
					</button>
				</div>
			</div>

			<ShortNavbar
				user={user}
				openShortNavbar={openShortNavbar}
				handleLibraryDropdown={handleLibraryDropdown}
				libraryDropdown={libraryDropdown}
				handleCreateFolderModal={handleCreateFolderModal}
				folderSystem={folderSystem}
				NavbarFolders={NavbarFolders}
				handleOpenFolderModal={handleOpenFolderModal}
				handleViewAllFolders={handleViewAllFolders}
			/>
		</>
	);
}

const ShortNavbar = ({
	user,
	openShortNavbar,
	handleLibraryDropdown,
	libraryDropdown,
	handleCreateFolderModal,
	folderSystem,
	handleOpenFolderModal,
	handleViewAllFolders,
}) => {
	return (
		<>
			{openShortNavbar && (
				<div
					className={`w-full h-fit z-50 sm:hidden px-3 py-6 border-b-4 sticky top-0 left-0 bg-[#333a46] text-white flex justify-center items-center ${
						user.theme ? "border-gray-800" : "border-gray-400"
					}`}
				>
					<div className="flex flex-col justify-center items-start gap-4">
						<button
							onClick={handleCreateFolderModal}
							className="flex justify-center items-center gap-1 text-btn"
						>
							<p>Create Folder</p>
							<Image
								className="object-contain"
								src={"/icons/add_circle.svg"}
								alt="icon"
								width={20}
								height={20}
							/>
						</button>

						<div className="relative">
							<button
								onClick={handleLibraryDropdown}
								className="flex justify-center items-center text-btn relative library-dropdown"
							>
								<p>Your Library</p>
								<Image
									className={`object-contain relative top-.5 ${
										libraryDropdown && "rotate-180"
									}`}
									src={"/icons/expand_more_white.svg"}
									alt="icon"
									width={27}
									height={27}
								/>
							</button>

							{libraryDropdown && (
								<>
									<div className="library-dropdown flex flex-col justify-center items-start gap-1 w-[150px] h-fit rounded-xl absolute top-10 right-0 bg-white text-black shadow-md z-10 text-sm p-2 line-clamp-1 overflow-ellipsis">
										{folderSystem.allFolders
											.filter((folder) => folder.uid === user.uid)
											.slice(0, 5)
											.map((folder) => {
												return (
													<NavbarFolders
														key={folder.id}
														folder={folder}
														handleOpenFolderModal={handleOpenFolderModal}
													/>
												);
											})}

										<button
											onClick={handleViewAllFolders}
											className="btn w-full text-sm"
										>
											View All
										</button>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};
