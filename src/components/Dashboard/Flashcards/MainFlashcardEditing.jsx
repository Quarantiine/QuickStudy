import React from "react";
import FlashCardEditing from "../Flashcards/FlashCardEditing";
import Image from "next/image";

export default function MainFlashcardEditing({
	folder,
	user,
	handleEditFlashCardTitle,
	folderMaterialSystem,
	openEditFlashCardDropdown,
	flashcardQNATitle,
	setFlashcardQNATitle,
	handleChangeFlashcardTitle,
	editBackToFlashCardModal,
	mainMaterialID,
}) {
	return (
		<div className="flex justify-center items-center bg-[rgba(0,0,0,0.9)] w-full h-full top-0 left-0 fixed z-50 px-4 overflow-no-width overflow-x-hidden overflow-y-scroll">
			<div
				className={`flash-card-edit-modal w-[95%] h-[90%] flex flex-col justify-start items-start rounded-xl bg-white pt-7 px-5 relative overflow-with-width overflow-x-hidden overflow-y-scroll`}
			>
				<div className="flex flex-col justify-start items-start gap-3 w-full h-full">
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 w-full z-10 relative">
						<div className="flex flex-col justify-center items-start z-10">
							<p className="text-sm text-gray-500">
								{folder.name} - Editing Flash Cards
							</p>
							<div className="relative">
								<button
									onClick={handleEditFlashCardTitle}
									className="text-btn flash-card-edit-dropdown text-start"
								>
									<h1 className="title-h1">
										{folderMaterialSystem.allFolderMaterials
											.filter(
												(folderMaterial) =>
													folderMaterial.uid === user.uid &&
													folderMaterial.materialType === "flash-card" &&
													folderMaterial.currentFolderID === folder.id &&
													folderMaterial.id === mainMaterialID
											)
											.map((folderMaterial) => folderMaterial.title)
											.toString()}
									</h1>
								</button>

								{openEditFlashCardDropdown &&
									folderMaterialSystem.allFolderMaterials
										.filter(
											(folderMaterial) =>
												folderMaterial.uid === user.uid &&
												folderMaterial.materialType === "flash-card" &&
												folderMaterial.currentFolderID === folder.id &&
												folderMaterial.id === mainMaterialID
										)
										.map((folderMaterial) => {
											return (
												<React.Fragment key={folderMaterial.id}>
													<form className="flash-card-edit-dropdown w-[200px] h-fit bg-white shadow-lg rounded-xl p-4 absolute top-10 left-0 flex justify-center items-center z-10">
														<div className="w-full flex flex-col justify-center items-center gap-3">
															<div className="flex flex-col justify-center items-start gap-1 w-full">
																<div className="flex justify-between items-center gap-2 w-full">
																	<label htmlFor="Title">Title</label>
																	<p
																		className={`text-sm ${
																			flashcardQNATitle.length > 32
																				? "text-red-500"
																				: "text-gray-400"
																		}`}
																	>
																		{flashcardQNATitle.length}
																		/32
																	</p>
																</div>
																<input
																	className="input-field w-full"
																	placeholder="Flash Card Title"
																	type="text"
																	onChange={(e) =>
																		setFlashcardQNATitle(e.target.value)
																	}
																/>
															</div>

															<button
																onClick={(e) =>
																	handleChangeFlashcardTitle(
																		e,
																		folderMaterial.id
																	)
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

						<button
							onClick={editBackToFlashCardModal}
							className="btn !bg-transparent border border-[#2871FF] !text-[#2871FF] flex justify-center items-center gap-1"
						>
							<Image
								className="object-contain"
								src={"/icons/arrow_back_blue.svg"}
								alt="icon"
								width={17}
								height={17}
							/>
							<p>Back</p>
						</button>
					</div>

					{folderMaterialSystem.allFolderMaterials
						.filter(
							(folderMaterial) =>
								folderMaterial.uid === user.uid &&
								folderMaterial.materialType === "flash-card" &&
								folderMaterial.currentFolderID === folder.id &&
								folderMaterial.id === mainMaterialID
						)
						.map((folderMaterial) => {
							return (
								<FlashCardEditing
									key={folderMaterial.id}
									folderMaterial={folderMaterial}
								/>
							);
						})}
				</div>
			</div>
		</div>
	);
}
