import React from "react";
import Image from "next/image";

export default function Tests({}) {
	return (
		<>
			<div className="flex flex-col justify-center items-start gap-7 w-full">
				<div className="flex flex-col sm:flex-row justify-start sm:justify-between item-start sm:items-center gap-3 w-full z-10">
					{/* <button onClick={null} className="btn">
						Create Test
					</button> */}

					{/* <div className="relative w-full sm:w-fit">
						<Image
							className="object-contain absolute top-1/2 -translate-y-1/2 left-3"
							src={"/icons/search.svg"}
							alt="icon"
							width={20}
							height={20}
						/>

						<input
							className="input-field !pl-10 w-full"
							placeholder="Search Tests"
							type="text"
						/>
					</div> */}
				</div>

				<div
					className={`absolute top-1/2 left-0 w-full h-full rounded-xl flex flex-col gap-2 justify-center items-center`}
				>
					<Image
						className="object-cover grayscale opacity-50"
						src={"/images/logo.png"}
						alt="logo"
						width={60}
						height={60}
						priority="true"
					/>
					{/* <p className="text-lg text-gray-400">You have no tests</p> */}
					<p className="text-lg text-gray-400">Tests coming soon</p>
				</div>
			</div>
		</>
	);
}
