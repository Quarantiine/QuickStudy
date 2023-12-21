import Head from "next/head";
import React, { useEffect, useReducer, useRef, useState } from "react";
import Image from "next/image";
import FirebaseAPI from "../pages/api/firebaseAPI";
import { createPortal } from "react-dom";

const formReducer = (state, { type, payload }) => {
	switch (type) {
		case "form":
			return {
				...state,
				[payload.key]: payload.value,
			};
		default:
			return console.log(`$Unknown type: ${type}`);
	}
};

export default function Registration() {
	const { registration } = FirebaseAPI();
	const [formState, formDispatch] = useReducer(formReducer, {
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [changeRegistrationForm, setChangeRegistrationForm] = useState(false);
	const [openPasswordResetModal, setOpenPasswordResetModal] = useState(false);

	const [emailPasswordReset, setEmailPasswordReset] = useState("");

	const handleChangeRegistrationForm = (e) => {
		e.preventDefault();

		const formList = ["email", "username", "password", "confirmPassword"];
		setChangeRegistrationForm(!changeRegistrationForm);

		formList.map((list) => {
			formDispatch({
				type: "form",
				payload: {
					key: list,
					value: "",
				},
			});
		});
	};

	const handleOpenResetPassword = (e) => {
		e.preventDefault();
		setOpenPasswordResetModal(!openPasswordResetModal);
	};

	const handleResetPassword = (e) => {
		e.preventDefault();

		/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailPasswordReset) &&
			registration.passwordReset();
	};

	useEffect(() => {
		const closePasswordResetModal = (e) => {
			if (!e.target.closest(".password-reset-modal")) {
				setOpenPasswordResetModal(false);
			}
		};

		document.addEventListener("mousedown", closePasswordResetModal);
		return () =>
			document.removeEventListener("mousedown", closePasswordResetModal);
	}, []);

	const handleFormDispatch = (e, key, value) => {
		e.preventDefault();

		formDispatch({
			type: "form",
			payload: {
				key: key,
				value: value,
			},
		});
	};

	const handleSubmitForm = (e) => {
		e.preventDefault();
		const checkedUsername = formState.username.length > 1;
		const checkedEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
			formState.email
		);
		const checkedPasswordSignUp =
			formState.password.length > 5 &&
			formState.password === formState.confirmPassword;
		const checkedPasswordSignIn = formState.password.length > 5;

		if (changeRegistrationForm) {
			if (checkedEmail && checkedPasswordSignIn) {
				registration.signIn(formState.email, formState.password);
			}
		} else {
			if (checkedUsername && checkedEmail && checkedPasswordSignUp) {
				registration.addUser(
					formState.email,
					formState.password,
					formState.username
				);
			}
		}
	};

	const handleGoogleSignIn = (e) => {
		e.preventDefault();
		registration.googleSignIn();
	};

	return (
		<>
			<Head>
				<title>Registration</title>
			</Head>

			<main className="flex justify-start items-center w-full h-full fixed top-0 left-0 px-5 overflow-y-scroll overflow-x-hidden">
				<div className="flex justify-center items-center w-full h-fit px-2">
					{!openPasswordResetModal && registration.registrationErrMsg && (
						<div className="fixed top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg h-fit w-[90%] sm:w-fit text-center z-[60] overflow-y-hidden overflow-x-scroll overflow-no-height">
							{registration.registrationErrMsg}
						</div>
					)}

					{openPasswordResetModal &&
						createPortal(
							<>
								<div className="flex justify-center items-center bg-[rgba(0,0,0,0.7)] w-full h-full top-0 left-0 fixed z-50 px-4">
									<div className="password-reset-modal flex flex-col gap-4 justify-center items-center w-fit h-fit p-5 rounded-lg bg-white">
										{registration.registrationErrMsg && (
											<div className="bg-red-500 text-white px-4 py-2 rounded-lg h-fit w-[90%] sm:w-fit text-center z-[60] overflow-y-hidden overflow-x-scroll overflow-no-height">
												{registration.registrationErrMsg}
											</div>
										)}

										<h1 className="title-h1">Reset Password</h1>
										<div className="flex flex-col justify-center items-start w-full gap-1">
											<label htmlFor="Email">Email</label>
											<input
												className="input-field w-full"
												type="email"
												name="email"
												placeholder="example123@example.com"
												onChange={(e) => setEmailPasswordReset(e.target.value)}
											/>
										</div>
										<button
											onClick={handleResetPassword}
											className="btn w-full"
										>
											Reset
										</button>
									</div>
								</div>
							</>,
							document.body
						)}

					{!openPasswordResetModal && (
						<>
							{changeRegistrationForm ? (
								<SignIn
									handleSubmitForm={handleSubmitForm}
									handleChangeRegistrationForm={handleChangeRegistrationForm}
									handleResetPassword={handleResetPassword}
									handleFormDispatch={handleFormDispatch}
									handleOpenResetPassword={handleOpenResetPassword}
									handleGoogleSignIn={handleGoogleSignIn}
								/>
							) : (
								<SignUp
									handleSubmitForm={handleSubmitForm}
									handleChangeRegistrationForm={handleChangeRegistrationForm}
									handleResetPassword={handleResetPassword}
									handleFormDispatch={handleFormDispatch}
									handleOpenResetPassword={handleOpenResetPassword}
									handleGoogleSignIn={handleGoogleSignIn}
								/>
							)}
						</>
					)}
				</div>
			</main>
		</>
	);
}

const SignUp = ({
	handleSubmitForm,
	handleChangeRegistrationForm,
	handleFormDispatch,
	handleOpenResetPassword,
	handleGoogleSignIn,
}) => {
	const [showPassword, setShowPassword] = useState(false);

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<>
			<form className="w-[270px] sm:w-[400px] h-fit bg-white rounded-xl relative p-5 flex flex-col justify-center items-center gap-5">
				<div className="flex justify-center items-center relative">
					<Image
						className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
						src={"/images/logo.png"}
						alt="logo"
						width={70}
						height={70}
						priority="true"
					/>

					<iframe
						className="w-fit"
						src="https://lottie.host/embed/9c96f4b8-4021-4903-9d43-cc4b0931ae40/hzk6ZAMzJ2.json"
					/>
				</div>

				<h1 className="title-h1">Sign Up</h1>

				<div className="overflow-no-width flex flex-col justify-start items-start gap-4 w-full overflow-y-scroll overflow-x-hidden">
					<div className="flex flex-col sm:flex-row justify-start items-start gap-4 w-full">
						<div className="flex flex-col justify-start items-start gap-3 w-full">
							<div className="flex flex-col justify-center items-start w-full">
								<label htmlFor="Username">Username</label>
								<input
									className="input-field w-full"
									type="text"
									name="username"
									placeholder="example123"
									onChange={(e) =>
										handleFormDispatch(e, e.target.name, e.target.value)
									}
								/>
							</div>

							<div className="flex flex-col justify-center items-start w-full">
								<label htmlFor="Email">Email</label>
								<input
									className="input-field w-full"
									type="email"
									name="email"
									placeholder="example123@example.com"
									onChange={(e) =>
										handleFormDispatch(e, e.target.name, e.target.value)
									}
								/>
							</div>
						</div>

						<div className="flex flex-col justify-start items-start gap-3 w-full">
							<div className="flex flex-col justify-center items-start w-full">
								<label htmlFor="Password">Password</label>

								<div className="relative">
									<input
										className="input-field w-full !pr-9"
										autoComplete="off"
										placeholder={showPassword ? "password" : "•••••••••"}
										type={showPassword ? "text" : "password"}
										name="password"
										onChange={(e) =>
											handleFormDispatch(e, e.target.name, e.target.value)
										}
									/>
									<Image
										className="w-[17px] h-auto object-contain absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer"
										src={
											showPassword
												? "/icons/visibility.svg"
												: "/icons/visibility_off.svg"
										}
										alt="image"
										width={25}
										height={25}
										draggable={false}
										onClick={handleShowPassword}
									/>
								</div>
							</div>

							<div className="flex flex-col justify-center items-start w-full">
								<label htmlFor="ConfirmPassword">Confirm Password</label>

								<div className="relative">
									<input
										className="input-field w-full !pr-9"
										autoComplete="off"
										placeholder={
											showPassword ? "confirm password" : "•••••••••"
										}
										type={showPassword ? "text" : "password"}
										name="confirmPassword"
										onChange={(e) =>
											handleFormDispatch(e, e.target.name, e.target.value)
										}
									/>
									<Image
										className="w-[17px] h-auto object-contain absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer"
										src={
											showPassword
												? "/icons/visibility.svg"
												: "/icons/visibility_off.svg"
										}
										alt="image"
										width={25}
										height={25}
										draggable={false}
										onClick={handleShowPassword}
									/>
								</div>
							</div>
						</div>
					</div>

					<button onClick={handleSubmitForm} className="btn w-full">
						Create Account
					</button>
					<button
						onClick={handleGoogleSignIn}
						className="px-3 py-2 rounded-lg bg-gray-100 hover:opacity-70 transition-opacity w-full flex justify-center items-center gap-2"
					>
						<Image
							src={"/icons/google.svg"}
							alt="google logo"
							width={20}
							height={20}
						/>
						<p>Sign in Google</p>
					</button>
				</div>

				<div className="flex flex-col justify-start items-start w-full">
					<button
						onClick={handleChangeRegistrationForm}
						className="base-text text-btn"
					>
						{"Don't have an account?"}
					</button>
					<button
						onClick={handleOpenResetPassword}
						className="base-text text-btn"
					>
						Forgot password?
					</button>
				</div>
			</form>
		</>
	);
};

const SignIn = ({
	handleSubmitForm,
	handleChangeRegistrationForm,
	handleFormDispatch,
	handleOpenResetPassword,
	handleGoogleSignIn,
}) => {
	const [showPassword, setShowPassword] = useState(false);

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<>
			<form className="w-[270px] h-fit bg-white rounded-xl relative p-5 flex flex-col justify-center items-center gap-5">
				<div className="flex justify-center items-center relative">
					<Image
						className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
						src={"/images/logo.png"}
						alt="logo"
						width={70}
						height={70}
						priority="true"
					/>

					<iframe
						className="w-fit"
						src="https://lottie.host/embed/9c96f4b8-4021-4903-9d43-cc4b0931ae40/hzk6ZAMzJ2.json"
					/>
				</div>

				<h1 className="title-h1">Sign In</h1>

				<div className="overflow-no-width flex flex-col justify-start items-start gap-4 w-full overflow-y-scroll overflow-x-hidden">
					<div className="flex flex-col justify-center items-start w-full">
						<label htmlFor="Email">Email</label>
						<input
							className="input-field w-full"
							type="email"
							name="email"
							placeholder="example123@example.com"
							onChange={(e) =>
								handleFormDispatch(e, e.target.name, e.target.value)
							}
						/>
					</div>

					<div className="flex flex-col justify-center items-start w-full">
						<label htmlFor="Password">Password</label>
						<div className="relative">
							<input
								className="input-field w-full !pr-9"
								autoComplete="off"
								placeholder={showPassword ? "password" : "•••••••••"}
								type={showPassword ? "text" : "password"}
								name="password"
								onChange={(e) =>
									handleFormDispatch(e, e.target.name, e.target.value)
								}
							/>
							<Image
								className="w-[17px] h-auto object-contain absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer"
								src={
									showPassword
										? "/icons/visibility.svg"
										: "/icons/visibility_off.svg"
								}
								alt="image"
								width={25}
								height={25}
								draggable={false}
								onClick={handleShowPassword}
							/>
						</div>
					</div>

					<button onClick={handleSubmitForm} className="btn w-full">
						Sign In
					</button>
					<button
						onClick={handleGoogleSignIn}
						className="px-3 py-2 rounded-lg bg-gray-100 hover:opacity-70 transition-opacity w-full flex justify-center items-center gap-2"
					>
						<Image
							src={"/icons/google.svg"}
							alt="google logo"
							width={20}
							height={20}
						/>
						<p>Sign in Google</p>
					</button>
				</div>

				<div className="flex flex-col justify-center items-center w-full">
					<button
						onClick={handleChangeRegistrationForm}
						className="base-text text-btn"
					>
						Have an account?
					</button>
					<button
						onClick={handleOpenResetPassword}
						className="base-text text-btn"
					>
						Forgot password?
					</button>
				</div>
			</form>
		</>
	);
};
