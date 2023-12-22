import React from "react";
import Image from "next/image";

export default function NavbarFolders({ folder, handleOpenFolderModal }) {
	return (
		<>
			<button
				onClick={() => handleOpenFolderModal(folder.id)}
				className="flex justify-start items-center gap-2 text-btn text-start whitespace-nowrap w-full"
			>
				<Image src={"/icons/folder.svg"} alt="icon" width={20} height={20} />
				<p className="line-clamp-1 w-full text-overflow overflow-ellipsis">
					{folder.name}
				</p>
			</button>
		</>
	);
}
