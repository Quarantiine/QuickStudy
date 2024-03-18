import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FirebaseAPI from "../../pages/api/firebaseAPI";
import { createPortal } from "react-dom";
import studyTips from "../../data/studying_tips.json";

export default function StudyTips({ user }) {
	const { registration } = FirebaseAPI();
	const [openModal, setOpenModal] = useState(false);

	const handleHideFolder = () => {
		registration.hidingSection4(user.hideSection4, user.id);
	};

	const handleOpenModal = () => {
		setOpenModal(!openModal);
	};

	useEffect(() => {
		const closeModal = (e) => {
			if (!e.target.closest(".study-tip-modal")) {
				setOpenModal(false);
			}
		};

		document.addEventListener("mousedown", closeModal);
		return () => document.removeEventListener("mousedown", closeModal);
	}, []);

	return (
		<>
			<div className="flex flex-col justify-center items-center relative w-full h-auto gap-5">
				{openModal &&
					createPortal(
						<>
							<div className="flex justify-center items-center bg-[rgba(0,0,0,0.7)] w-full h-full top-0 left-0 fixed z-50 px-4">
								<div className="study-tip-modal w-[80%] h-[80%] bg-white rounded-xl overflow-no-width overflow-x-hidden overflow-y-scroll">
									<div className="w-full h-48 relative">
										<Image
											className="object-cover object-bottom"
											src={"/images/study_tip_banner.jpeg"}
											alt="img"
											fill
											sizes="(max-width: 768px) 100vw, 33vw"
											draggable={false}
										/>
									</div>

									<div className="flex flex-col gap-12 h-fit rounded-t-3xl bg-white px-5 sm:px-10 py-8 mx-auto">
										<div className="flex flex-col justify-center items-start gap-1 w-full sm:w-[80%] mx-auto">
											<h1 className="title-h1">Video Study Tips</h1>
											<p>
												The Study Tips section is meticulously crafted to
												empower you with knowledge, enhance your education, and
												prepare you not only to excel as a student and teacher
												but, most importantly, to flourish as a dedicated
												learner.
											</p>
										</div>

										<div className="flex flex-wrap justify-center items-center gap-7 w-full">
											{studyTips?.map((tips, index) => {
												return (
													<React.Fragment key={index}>
														<iframe
															className="w-full sm:w-[400px] h-[300px] rounded-xl"
															src={tips.link}
															title="YouTube video player"
															frameBorder="0"
															allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
															allowFullScreen
														></iframe>
													</React.Fragment>
												);
											})}
										</div>
									</div>
								</div>
							</div>
						</>,
						document.body
					)}

				<div className="flex justify-between items-center gap-2 w-full">
					<div className="flex justify-center items-center gap-2">
						<h1 className="title-h1">Study Tips</h1>
						<p className="text-sm opacity-60">Third Party</p>
					</div>
					<button
						onClick={handleHideFolder}
						className="text-btn text-sm ml-auto"
					>
						Hide
					</button>
				</div>

				<button
					onClick={handleOpenModal}
					className={`flex justify-center items-center w-full h-[300px] overflow-hidden rounded-xl relative text-btn`}
				>
					<Image
						className="object-cover"
						src={"/images/study_tip_banner_2.jpeg"}
						alt="img"
						fill
						sizes="(max-width: 768px) 100vw, 33vw"
					/>
					<div
						className={`absolute top-0 left-0 bg-black w-full h-full ${
							user.theme ? "opacity-60" : "opacity-30"
						}`}
					/>

					<h1 className="title-h1 absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 text-white text-center">
						Visit Study Tips Section
					</h1>
				</button>
			</div>
		</>
	);
}
