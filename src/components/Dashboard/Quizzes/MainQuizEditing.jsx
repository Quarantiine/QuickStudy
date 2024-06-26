import React, { useState } from "react";
import Image from "next/image";
import QuizEditing from "./QuizEditing";
import FirebaseAPI from "../../../pages/api/firebaseAPI";

export default function MainQuizEditing({
	folder,
	handleEditQuizTitle,
	folderMaterialSystem,
	openEditQuizDropdown,
	quizQNATitle,
	setQuizQNATitle,
	handleChangeQuizTitle,
	editBackToQuizModal,
	mainMaterialID,
}) {
	const { auth } = FirebaseAPI();
	const [deletingAllQNA, setDeletingAllQNA] = useState(false);

	return (
		<div className="flex justify-center items-center bg-[rgba(0,0,0,0.9)] w-full h-full top-0 left-0 fixed z-50 overflow-no-width overflow-x-hidden overflow-y-scroll">
			<div
				className={`quiz-edit-modal w-[100%] h-[100%] flex flex-col justify-start items-start bg-white pt-7 px-5 relative overflow-with-width overflow-x-hidden overflow-y-scroll`}
			>
				<div className="flex flex-col justify-start items-start gap-3 w-full h-full">
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 w-full z-10 relative">
						<div className="flex flex-col justify-center items-start z-10 w-full">
							<div className="flex justify-between items-center gap-2 w-full">
								<p className="text-sm text-gray-500">
									{folder.name} - Editing Quiz
								</p>

								{deletingAllQNA ? (
									<div
										className={`btn !bg-transparent border flex justify-center items-center gap-1 border-[#2871FF] !text-[#2871FF] opacity-50 cursor-not-allowed`}
									>
										<Image
											className={`object-contain grayscale`}
											src={"/icons/arrow_back_blue.svg"}
											alt="icon"
											width={17}
											height={17}
										/>
										<p>Back</p>
									</div>
								) : (
									<button
										onClick={editBackToQuizModal}
										className={`btn !bg-transparent border flex justify-center items-center gap-1 border-[#2871FF] !text-[#2871FF]`}
									>
										<Image
											className={`object-contain`}
											src={"/icons/arrow_back_blue.svg"}
											alt="icon"
											width={17}
											height={17}
										/>
										<p>Back</p>
									</button>
								)}
							</div>

							<div className="relative">
								<button
									onClick={handleEditQuizTitle}
									className="text-btn quiz-edit-dropdown text-start"
								>
									<h1 className="title-h1">
										{folderMaterialSystem.allFolderMaterials
											.filter(
												(folderMaterial) =>
													folderMaterial.uid === auth.currentUser.uid &&
													folderMaterial.materialType === "quiz" &&
													folderMaterial.currentFolderID === folder.id &&
													folderMaterial.id === mainMaterialID
											)
											.map((folderMaterial) => folderMaterial.title)
											.toString()}
									</h1>
								</button>

								{openEditQuizDropdown &&
									folderMaterialSystem.allFolderMaterials
										.filter(
											(folderMaterial) =>
												folderMaterial.uid === auth.currentUser.uid &&
												folderMaterial.materialType === "quiz" &&
												folderMaterial.currentFolderID === folder.id &&
												folderMaterial.id === mainMaterialID
										)
										.map((folderMaterial) => {
											return (
												<React.Fragment key={folderMaterial.id}>
													<form className="quiz-edit-dropdown w-[200px] h-fit bg-white shadow-lg rounded-xl p-4 absolute top-10 left-0 flex justify-center items-center">
														<div className="w-full flex flex-col justify-center items-center gap-3">
															<div className="flex flex-col justify-center items-start gap-1 w-full">
																<div className="flex justify-between items-center gap-2 w-full">
																	<label htmlFor="Title">Title</label>
																	<p
																		className={`text-sm ${
																			quizQNATitle.length > 100
																				? "text-red-500"
																				: "text-gray-400"
																		}`}
																	>
																		{quizQNATitle.length}
																		/100
																	</p>
																</div>

																<input
																	className="input-field w-full"
																	placeholder="Quiz Title"
																	type="text"
																	onChange={(e) =>
																		setQuizQNATitle(e.target.value)
																	}
																/>
															</div>

															<button
																onClick={(e) =>
																	handleChangeQuizTitle(e, folderMaterial.id)
																}
																className="btn w-full"
															>
																Change
															</button>
														</div>
													</form>
												</React.Fragment>
											);
										})}
							</div>
						</div>
					</div>

					{folderMaterialSystem.allFolderMaterials
						.filter(
							(folderMaterial) =>
								folderMaterial.uid === auth.currentUser.uid &&
								folderMaterial.materialType === "quiz" &&
								folderMaterial.currentFolderID === folder.id &&
								folderMaterial.id === mainMaterialID
						)
						.map((folderMaterial) => {
							return (
								<QuizEditing
									key={folderMaterial.id}
									folderMaterial={folderMaterial}
									deletingAllQNA={deletingAllQNA}
									setDeletingAllQNA={setDeletingAllQNA}
								/>
							);
						})}
				</div>
			</div>
		</div>
	);
}
