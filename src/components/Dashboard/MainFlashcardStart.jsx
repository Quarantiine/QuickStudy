import React from "react";
import FlashCardStarting from "./FlashCardStarting";
import Image from "next/image";

export default function MainFlashcardStart({
	folder,
	user,
	folderMaterialSystem,
	flashCardID,
	startBackToFlashCardModal,
}) {
	return (
		<div className="flex justify-center items-center bg-[rgba(0,0,0,0.9)] w-full h-full top-0 left-0 fixed z-50 px-4 overflow-no-width overflow-x-hidden overflow-y-scroll">
			<div
				className={`flash-card-edit-modal w-[95%] h-[90%] flex flex-col justify-start items-start rounded-xl bg-white pt-7 px-5 relative overflow-with-width overflow-x-hidden overflow-y-scroll`}
			>
				<div className="flex flex-col justify-start items-start gap-3 w-full h-full">
					<div className="flex justify-between items-start gap-2 w-full z-10 relative">
						<div className="flex flex-col justify-center items-start z-10">
							<p className="text-sm text-gray-500">
								{folder.name} - Studying Flash Cards
							</p>
							<h1 className="title-h1">
								{folderMaterialSystem.allFolderMaterials
									.filter(
										(folderMaterial) =>
											folderMaterial.uid === user.uid &&
											folderMaterial.materialType === "flash-card" &&
											folderMaterial.currentFolderID === folder.id &&
											folderMaterial.id === flashCardID
									)
									.map((folderMaterial) => folderMaterial.title)
									.toString()}
							</h1>
						</div>

						<button
							onClick={startBackToFlashCardModal}
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
								folderMaterial.id === flashCardID
						)
						.map((folderMaterial) => {
							return (
								<FlashCardStarting
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
