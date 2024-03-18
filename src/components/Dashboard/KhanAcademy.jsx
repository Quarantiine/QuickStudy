import React from "react";
import Image from "next/image";
import Link from "next/link";
import FirebaseAPI from "../../pages/api/firebaseAPI";

export default function KhanAcademy({ user }) {
	const { registration } = FirebaseAPI();

	const handleHideFolder = () => {
		registration.hidingSection3(user.hideSection3, user.id);
	};

	return (
		<>
			<div className="flex flex-col justify-center items-center relative w-full h-auto gap-5">
				<div className="flex justify-between items-center gap-2 w-full">
					<div className="flex justify-center items-center gap-2">
						<h1 className="title-h1">More Study Material</h1>
						<p className="text-sm opacity-60">Third Party</p>
					</div>
					<button
						onClick={handleHideFolder}
						className="text-btn text-sm ml-auto"
					>
						Hide
					</button>
				</div>

				<Link
					href={"https://www.khanacademy.org/profile/me/courses"}
					target="_blank"
					className={`flex justify-center items-center w-full h-[300px] overflow-hidden rounded-xl relative text-btn`}
				>
					<Image
						className="object-cover"
						src={"/images/khan_academy_banner.jpeg"}
						alt="img"
						fill
						sizes="(max-width: 768px) 100vw, 33vw"
					/>
					<div
						className={`absolute top-0 left-0 bg-black w-full h-full ${
							user.theme ? "opacity-60" : "opacity-30"
						}`}
					/>
					<h1 className="title-h1 absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 text-white text-center flex justify-center items-center gap-2">
						<span>Visit Khan Academy</span>
						<Image
							className="object-cover"
							src={"/icons/open_in_new.svg"}
							alt="icon"
							width={30}
							height={30}
							sizes="(max-width: 768px) 100vw, 33vw"
						/>
					</h1>
				</Link>
			</div>
		</>
	);
}
