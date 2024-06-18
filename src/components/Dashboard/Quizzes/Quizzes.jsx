import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import FirebaseAPI from "../../../pages/api/firebaseAPI";
import { UserCredentialsCtx } from "../../../pages";
import Quiz from "./Quiz";

export default function Quizzes({ user, folder }) {
	const { auth, folderMaterialSystem, questionNAnswerSystem } = FirebaseAPI();
	const { handleOpenQuizEdit, handleOpenQuizStart } =
		useContext(UserCredentialsCtx);
	const [openDropDown, setOpenDropDown] = useState(false);
	const [openDropDown2, setOpenDropDown2] = useState(false);
	const [quizTitle, setQuizTitle] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [transferIndicator, setTransferIndicator] = useState("");
	const [transferSearchText, setTransferSearchText] = useState("");
	const transferIndicatorRef = useRef();

	const handleOpenDropdown = () => {
		setOpenDropDown(!openDropDown);
	};

	const handleOpenDropdown2 = () => {
		setOpenDropDown2(!openDropDown2);
	};

	const createMainMaterial = (e) => {
		e.preventDefault();
		if (quizTitle.length > 1 && quizTitle.length <= 100) {
			folderMaterialSystem.createMainMaterial(
				quizTitle,
				folder.name,
				0,
				folder.id,
				"quiz"
			);

			setOpenDropDown(false);
			setQuizTitle("");
		}
	};

	useEffect(() => {
		const closeDropdown = (e) => {
			if (!e.target.closest(".create-quiz-dropdown")) {
				setOpenDropDown(false);
			}
		};
		document.addEventListener("mousedown", closeDropdown);
		return () => document.removeEventListener("mousedown", closeDropdown);
	}, []);

	useEffect(() => {
		const closeDropdown2 = (e) => {
			if (!e.target.closest(".create-quiz-dropdown-2")) {
				setOpenDropDown2(false);
			}
		};
		document.addEventListener("mousedown", closeDropdown2);
		return () => document.removeEventListener("mousedown", closeDropdown2);
	}, []);

	const handleMaterialTransferSystem = (material) => {
		folderMaterialSystem.createMainMaterial(
			material.title,
			folder.name,
			0,
			folder.id,
			"quiz"
		);

		setOpenDropDown2(false);

		setTransferIndicator("Transferring Set...Loading");
		transferIndicatorRef.current = setTimeout(() => {
			setTransferIndicator("");
		}, 3000);
	};

	return (
		<>
			{transferIndicator && (
				<div className="absolute top-4 left-1/2 -translate-x-1/2 w-fit h-fit px-3 py-1 rounded-lg bg-green-500 text-white z-10">
					<p>{transferIndicator}</p>
				</div>
			)}

			<div className="flex flex-col justify-center items-start gap-3 w-full">
				<div className="flex flex-col sm:flex-row justify-start sm:justify-between item-start sm:items-center gap-3 w-full z-10">
					<div className="relative w-full sm:w-fit">
						<div className="flex flex-col justify-center items-start gap-2">
							<button
								onClick={handleOpenDropdown}
								className="create-quiz-dropdown btn flex justify-center items-center gap-1 w-full"
							>
								<p>Create Quiz</p>
								<Image
									className={`object-contain ${openDropDown && "rotate-180"}`}
									src={"/icons/expand_more_white.svg"}
									alt="icon"
									width={25}
									height={25}
								/>
							</button>

							<button
								onClick={handleOpenDropdown2}
								className="create-quiz-dropdown-2 btn flex justify-center items-center gap-1 w-full"
							>
								<p>Create with Flash-card</p>
								<Image
									className={`object-contain ${openDropDown2 && "rotate-180"}`}
									src={"/icons/expand_more_white.svg"}
									alt="icon"
									width={25}
									height={25}
								/>
							</button>
						</div>

						{openDropDown && (
							<form className="create-quiz-dropdown w-full h-auto bg-white shadow-lg rounded-xl p-4 absolute top-10 left-0 flex justify-center items-center z-10">
								<div className="w-full flex flex-col justify-center items-center gap-3">
									<div className="flex flex-col justify-center items-start gap-1 w-full">
										<div className="flex justify-between items-center gap-2 w-full">
											<label htmlFor="Title">Title</label>
											<p
												className={`text-sm ${
													quizTitle.length > 100
														? "text-red-500"
														: "text-gray-400"
												}`}
											>
												{quizTitle.length}/100
											</p>
										</div>
										<input
											className="input-field w-full"
											placeholder="Quiz Title"
											type="text"
											onChange={(e) => setQuizTitle(e.target.value)}
										/>
									</div>
									<button onClick={createMainMaterial} className="btn w-full">
										Create
									</button>
								</div>
							</form>
						)}

						{openDropDown2 && (
							<div className="create-quiz-dropdown-2 overflow-no-width w-full max-h-[200px] overflow-x-hidden overflow-y-scroll bg-white shadow-lg rounded-xl p-4 absolute top-20 left-0 flex flex-col justify-start items-start z-10 gap-5">
								<div className="flex flex-col justify-start items-start gap-1 w-full">
									<h1 className="text-base font-bold px-2">
										Create Quiz from Your Flash-cards
									</h1>
									<input
										onChange={(e) => setTransferSearchText(e.target.value)}
										className="px-2 py-1.5 rounded-lg bg-gray-100 outline-none text-black w-full text-sm"
										type="text"
										placeholder="Search flash-card"
									/>
								</div>

								<div className="flex flex-col justify-center items-start w-full text-sm">
									<p className="text-gray-400 px-2">
										{folderMaterialSystem.allFolderMaterials
											.filter(
												(value) =>
													value.uid === folder.uid &&
													value.materialType === "flash-card"
											)
											.map((material) => material).length < 1 &&
											`(No Flashcards)`}
										Flash-cards Below
									</p>

									<div className="w-full flex flex-col justify-center items-start">
										{folderMaterialSystem.allFolderMaterials
											.filter(
												(value) =>
													value.uid === folder.uid &&
													value.materialType === "flash-card"
											)
											.map((material) => {
												if (
													material.title
														.normalize("NFD")
														.replace(/\p{Diacritic}/gu, "")
														.toLowerCase()
														.includes(transferSearchText.toLowerCase())
												) {
													return (
														<React.Fragment key={material.id}>
															<button
																onClick={() =>
																	handleMaterialTransferSystem(material)
																}
																className="hover:bg-[#2871FF] hover:text-white rounded-lg px-2 py-1 transition-all flex justify-between items-center gap-2 w-full text-sm"
																title={material.title}
															>
																<p className="line-clamp-1 text-start">
																	{material.title}
																</p>
																<p className="">{material.completion}%</p>
															</button>
														</React.Fragment>
													);
												}
											})}
									</div>
								</div>
							</div>
						)}
					</div>

					<div className="relative w-full sm:w-fit">
						<Image
							className="object-contain absolute top-1/2 -translate-y-1/2 left-3"
							src={"/icons/search.svg"}
							alt="icon"
							width={20}
							height={20}
						/>
						<input
							className="input-field !pl-10 w-full"
							placeholder="Search Quizzes"
							type="text"
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>
				<p className="ml-auto pt-3">
					{folderMaterialSystem.allFolderMaterials
						?.filter(
							(folderMaterial) =>
								folderMaterial.uid === auth.currentUser.uid &&
								folderMaterial.materialType === "quiz" &&
								folderMaterial.currentFolderID === folder.id
						)
						.map((folderMaterial) => folderMaterial).length === 1 ? (
						<span>
							{
								folderMaterialSystem.allFolderMaterials
									?.filter(
										(folderMaterial) =>
											folderMaterial.uid === auth.currentUser.uid &&
											folderMaterial.materialType === "quiz" &&
											folderMaterial.currentFolderID === folder.id
									)
									.map((folderMaterial) => folderMaterial).length
							}{" "}
							Item
						</span>
					) : (
						<span>
							{
								folderMaterialSystem.allFolderMaterials
									?.filter(
										(folderMaterial) =>
											folderMaterial.uid === auth.currentUser.uid &&
											folderMaterial.materialType === "quiz" &&
											folderMaterial.currentFolderID === folder.id
									)
									.map((folderMaterial) => folderMaterial).length
							}{" "}
							Items
						</span>
					)}
				</p>
				<div
					className={`w-full pb-7 grid gap-5 ${
						folderMaterialSystem.allFolderMaterials
							?.filter(
								(folderMaterial) =>
									folderMaterial.uid === auth.currentUser.uid &&
									folderMaterial.materialType === "quiz" &&
									folderMaterial.currentFolderID === folder.id
							)
							.map((folderMaterial) => folderMaterial).length > 1
							? "grid-cols-1 xl:grid-cols-2"
							: "grid-cols-1"
					}`}
				>
					{folderMaterialSystem.allFolderMaterials
						?.filter(
							(folderMaterial) =>
								folderMaterial.uid === auth.currentUser.uid &&
								folderMaterial.materialType === "quiz" &&
								folderMaterial.currentFolderID === folder.id
						)
						.map((folderMaterial) => {
							if (
								folderMaterial.title
									.normalize("NFD")
									.replace(/\p{Diacritic}/gu, "")
									.toLowerCase()
									.includes(searchQuery.toLowerCase())
							) {
								return (
									<Quiz
										key={folderMaterial.id}
										user={user}
										folderMaterial={folderMaterial}
										questionNAnswerSystem={questionNAnswerSystem}
										folderMaterialSystem={folderMaterialSystem}
										handleOpenQuizEdit={handleOpenQuizEdit}
										handleOpenQuizStart={handleOpenQuizStart}
										folder={folder}
									/>
								);
							}
						})}
					{folderMaterialSystem.allFolderMaterials
						?.filter(
							(folderMaterial) =>
								folderMaterial.uid === auth.currentUser.uid &&
								folderMaterial.materialType === "quiz" &&
								folderMaterial.currentFolderID === folder.id &&
								folderMaterial.title
									.normalize("NFD")
									.replace(/\p{Diacritic}/gu, "")
									.toLowerCase()
									.includes(searchQuery.toLowerCase())
						)
						.map((folderMaterial) => folderMaterial).length < 1 &&
						folderMaterialSystem.allFolderMaterials
							?.filter(
								(folderMaterial) =>
									folderMaterial.uid === auth.currentUser.uid &&
									folderMaterial.materialType === "quiz" &&
									folderMaterial.currentFolderID === folder.id
							)
							.map((folderMaterial) => folderMaterial).length > 0 && (
							<>
								<div className="absolute top-0 left-0 w-full h-full flex justify-center items-center p-4 text-center">
									<p className="text-lg text-gray-400">
										<span>No quiz named: </span>
										<span className="text-gray-500">{searchQuery}</span>
									</p>
								</div>
							</>
						)}
				</div>
				{folderMaterialSystem.allFolderMaterials
					?.filter(
						(folderMaterial) =>
							folderMaterial.uid === auth.currentUser.uid &&
							folderMaterial.materialType === "quiz" &&
							folderMaterial.currentFolderID === folder.id
					)
					.map((folderMaterial) => folderMaterial).length < 1 && (
					<div
						className={`relative top-1/2 -translate-y-1/2 left-0 w-full h-full rounded-xl flex flex-col gap-2 justify-center items-center`}
					>
						<Image
							className="object-cover grayscale opacity-50"
							src={"/images/logo.png"}
							alt="logo"
							width={60}
							height={60}
							priority="true"
						/>
						<p className="text-lg text-gray-400">You have no quizzes</p>
					</div>
				)}
			</div>
		</>
	);
}
