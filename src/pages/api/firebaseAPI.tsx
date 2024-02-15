import { FirebaseApp, initializeApp } from "firebase/app";
import {
	CollectionReference,
	Firestore,
	Query,
	addDoc,
	collection,
	deleteDoc,
	doc,
	getFirestore,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import {
	Auth,
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	getAuth,
	sendEmailVerification,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import math from "typographic-math-symbols";

const firebaseConfig = {
	apiKey: "AIzaSyDsdXJq8CKygXeD3ERXS3-MzhIqk_DC0V0",
	authDomain: "quickstudy-91e92.firebaseapp.com",
	projectId: "quickstudy-91e92",
	storageBucket: "quickstudy-91e92.appspot.com",
	messagingSenderId: "161307530585",
	appId: "1:161307530585:web:0909d5d2bcca70e3db2848",
	measurementId: "G-XH2GJ5JVB4",
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

const colRefRegistration: CollectionReference = collection(db, "registration");
const queryRegistration: Query = query(
	colRefRegistration,
	orderBy("createdTime")
);

const colRefFolder: CollectionReference = collection(db, "folders");
const queryFolder: Query = query(colRefFolder, orderBy("createdTime"));

const colRefFolderMaterials: CollectionReference = collection(
	db,
	"folder-materials"
);
const queryFolderMaterials: Query = query(
	colRefFolderMaterials,
	orderBy("createdTime")
);

const colRefQuestionNAnswers: CollectionReference = collection(
	db,
	"questions-n-answers"
);
const queryQuestionNAnswers: Query = query(
	colRefQuestionNAnswers,
	orderBy("createdTime")
);

export default function FirebaseAPI() {
	const [allUsers, setAllUsers] = useState<any[]>([]);
	const [allFolders, setAllFolders] = useState<any[]>([]);
	const [allFolderMaterials, setAllFolderMaterials] = useState<any[]>([]);
	const [allQuestionsNAnswers, setAllQuestionsNAnswers] = useState<any[]>([]);

	const [registrationErrMsg, setRegistrationErrMsg] = useState<string>("");
	const [dashboardErrMsg, setDashboardErrMsg] = useState<string>("");

	const registrationErrMsgRef = useRef<any>();
	const registrationErrMsgTime: number = 5000;

	const dashboardErrMsgRef = useRef<any>();
	const dashboardErrMsgTime: number = 5000;

	useEffect(() => {
		onSnapshot(queryRegistration, (ss) => {
			const users = [];

			ss.docs.map((doc) => {
				users.push({
					...doc.data(),
					id: doc.id,
				});
			});

			setAllUsers(users);
		});
	}, []);

	useEffect(() => {
		onSnapshot(queryFolder, (ss) => {
			const folders = [];

			ss.docs.map((doc) => {
				folders.unshift({
					...doc.data(),
					id: doc.id,
				});
			});

			setAllFolders(folders);
		});
	}, []);

	useEffect(() => {
		onSnapshot(queryFolderMaterials, (ss) => {
			const folderMaterials = [];

			ss.docs.map((doc) => {
				folderMaterials.unshift({
					...doc.data(),
					id: doc.id,
				});
			});

			setAllFolderMaterials(folderMaterials);
		});
	}, []);

	useEffect(() => {
		onSnapshot(queryQuestionNAnswers, (ss) => {
			const questionsNAnswers = [];

			ss.docs.map((doc) => {
				questionsNAnswers.unshift({
					...doc.data(),
					id: doc.id,
				});
			});

			setAllQuestionsNAnswers(questionsNAnswers);
		});
	}, []);

	class RegistrationSystem {
		constructor() {}

		addUser = async (email: string, password: string, username: string) => {
			createUserWithEmailAndPassword(auth, email, password)
				.then(async (result) => {
					await sendEmailVerification(result.user);

					await addDoc(colRefRegistration, {
						username: username,
						email: email,
						createdTime: serverTimestamp(),
						theme: false,
						uid: result.user.uid,
						hideSection1: true,
						hideSection2: true,
						hideSection3: true,
						hideSection4: true,
					});
				})
				.catch(async (err) => {
					clearTimeout(registrationErrMsgRef.current);
					setRegistrationErrMsg(err.message);

					registrationErrMsgRef.current = setTimeout(() => {
						setRegistrationErrMsg("");
					}, registrationErrMsgTime);
				});
		};

		signIn = async (email: string, password: string) => {
			await signInWithEmailAndPassword(auth, email, password).catch((err) => {
				clearTimeout(registrationErrMsgRef.current);
				setRegistrationErrMsg(err.message);

				registrationErrMsgRef.current = setTimeout(() => {
					setRegistrationErrMsg("");
				}, registrationErrMsgTime);
			});
		};

		passwordReset = async (email: string) => {
			await sendPasswordResetEmail(auth, email).catch((err) => {
				clearTimeout(registrationErrMsgRef.current);
				setRegistrationErrMsg(err.message);

				registrationErrMsgRef.current = setTimeout(() => {
					setRegistrationErrMsg("");
				}, registrationErrMsgTime);
			});
		};

		googleSignIn = async () => {
			const provider = new GoogleAuthProvider();

			await signInWithPopup(auth, provider)
				.then((result) => {
					const user = result.user;

					user.email &&
					allUsers
						?.map((users: any) =>
							users.email.toString() === user.email ? true : false
						)
						.includes(true)
						? ""
						: addDoc(colRefRegistration, {
								displayName: user.displayName,
								email: user.email,
								createdTime: serverTimestamp(),
								theme: false,
								uid: user.uid,
								hideSection1: true,
								hideSection2: true,
								hideSection3: true,
								hideSection4: true,
						  });
				})
				.catch((err) => {
					clearTimeout(registrationErrMsgRef.current);
					setRegistrationErrMsg(err.message);

					registrationErrMsgRef.current = setTimeout(() => {
						setRegistrationErrMsg("");
					}, registrationErrMsgTime);
				});
		};

		logout = async () => {
			await signOut(auth).catch((err) => {
				clearTimeout(registrationErrMsgRef.current);
				setRegistrationErrMsg(err.message);

				registrationErrMsgRef.current = setTimeout(() => {
					setRegistrationErrMsg("");
				}, registrationErrMsgTime);
			});
		};

		themeChange = async (theme: boolean, id: string) => {
			const docRef = doc(colRefRegistration, id);

			await updateDoc(docRef, {
				theme: !theme,
			}).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};

		hidingSection1 = async (hideSection1: boolean, id: string) => {
			const docRef = doc(colRefRegistration, id);

			await updateDoc(docRef, {
				hideSection1: !hideSection1,
			}).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};

		hidingSection2 = async (hideSection2: boolean, id: string) => {
			const docRef = doc(colRefRegistration, id);

			await updateDoc(docRef, {
				hideSection2: !hideSection2,
			}).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};

		hidingSection3 = async (hideSection3: boolean, id: string) => {
			const docRef = doc(colRefRegistration, id);

			await updateDoc(docRef, {
				hideSection3: !hideSection3,
			}).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};

		hidingSection4 = async (hideSection4: boolean, id: string) => {
			const docRef = doc(colRefRegistration, id);

			await updateDoc(docRef, {
				hideSection4: !hideSection4,
			}).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};
	}
	const RS = new RegistrationSystem();
	const addUser = RS.addUser;
	const googleSignIn = RS.googleSignIn;
	const passwordReset = RS.passwordReset;
	const signIn = RS.signIn;
	const logout = RS.logout;
	const themeChange = RS.themeChange;
	const hidingSection1 = RS.hidingSection1;
	const hidingSection2 = RS.hidingSection2;
	const hidingSection3 = RS.hidingSection3;
	const hidingSection4 = RS.hidingSection4;

	class FolderSystem {
		addingFolder = async (name: string, description: string, uid: string) => {
			await addDoc(colRefFolder, {
				name: name,
				description: description || "No Description",
				uid: uid,
				createdTime: serverTimestamp(),
			}).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};

		deletingFolder = async (id: string) => {
			const docRef = doc(colRefFolder, id);

			await deleteDoc(docRef).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};

		updateCreatedTime = async (id: string) => {
			const docRef = doc(colRefFolder, id);
			await updateDoc(docRef, {
				createdTime: serverTimestamp(),
			}).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};

		updateFolderName = async (name: string, id: string) => {
			const docRef = doc(colRefFolder, id);
			await updateDoc(docRef, {
				name: name,
			}).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};

		updateFolderDescription = async (description: string, id: string) => {
			const docRef = doc(colRefFolder, id);
			await updateDoc(docRef, {
				description: description || "No Description",
			}).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};
	}
	const FS = new FolderSystem();
	const addingFolder = FS.addingFolder;
	const deletingFolder = FS.deletingFolder;
	const updateCreatedTime = FS.updateCreatedTime;
	const updateFolderName = FS.updateFolderName;
	const updateFolderDescription = FS.updateFolderDescription;

	class FolderMaterialsSystem {
		constructor() {}

		createMainMaterial = async (
			title: string,
			currentFolderName: string,
			completion: number,
			currentFolderID: string,
			materialType: string
		) => {
			await addDoc(colRefFolderMaterials, {
				title: title,
				currentFolderName: currentFolderName,
				completion: completion || 0,
				currentFolderID: currentFolderID,
				uid: auth.currentUser.uid,
				materialType: materialType,
				createdTime: serverTimestamp(),
			}).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};

		deleteMainMaterial = async (id: string) => {
			const docRef = doc(colRefFolderMaterials, id);

			await deleteDoc(docRef).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};

		updateMainMaterialCreatedTime = async (id: string) => {
			const docRef = doc(colRefFolderMaterials, id);
			await updateDoc(docRef, {
				createdTime: serverTimestamp(),
			}).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};

		updateMainMaterialTitle = async (title: string, id: string) => {
			const docRef = doc(colRefFolderMaterials, id);
			await updateDoc(docRef, {
				title: title,
			}).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};

		updateMainMaterialCompletion = async (completion: number, id: string) => {
			const docRef = doc(colRefFolderMaterials, id);
			await updateDoc(docRef, {
				completion: completion,
			}).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};
	}
	const FMS = new FolderMaterialsSystem();
	const createMainMaterial = FMS.createMainMaterial;
	const deleteMainMaterial = FMS.deleteMainMaterial;
	const updateMainMaterialCreatedTime = FMS.updateMainMaterialCreatedTime;
	const updateMainMaterialTitle = FMS.updateMainMaterialTitle;
	const updateMainMaterialCompletion = FMS.updateMainMaterialCompletion;

	class QuestionNAnswerSystem {
		constructor() {}

		createQuestionNAnswer = async (
			question: string,
			answer: string,
			currentFolderID: string,
			currentMaterialID: string,
			materialType: string,
			image: string
		) => {
			addDoc(colRefQuestionNAnswers, {
				question: math(question),
				answer: math(answer),
				currentFolderID: currentFolderID,
				currentMaterialID: currentMaterialID,
				materialType: materialType,
				understand: false,
				didntUnderstand: false,
				completed: false,
				uid: auth.currentUser.uid,
				image: image || "",
				createdTime: serverTimestamp(),
			}).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};

		deleteQuestionNAnswer = async (id: string) => {
			const docRef = doc(colRefQuestionNAnswers, id);
			await deleteDoc(docRef).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};

		editQuestionNAnswer = async (
			question: string,
			answer: string,
			id: string
		) => {
			const docRef = doc(colRefQuestionNAnswers, id);
			await updateDoc(docRef, {
				question: math(question),
				answer: math(answer),
			}).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};

		updateUnderstand = async (understand: boolean, id: string) => {
			const docRef = doc(colRefQuestionNAnswers, id);

			await updateDoc(docRef, {
				understand: understand,
			}).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};

		updateDidntUnderstand = async (didntUnderstand: boolean, id: string) => {
			const docRef = doc(colRefQuestionNAnswers, id);

			await updateDoc(docRef, {
				didntUnderstand: didntUnderstand,
			}).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};

		updateCompleted = async (completed: boolean, id: string) => {
			const docRef = doc(colRefQuestionNAnswers, id);

			await updateDoc(docRef, {
				completed: completed,
			}).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};

		updateImage = async (image: string, id: string) => {
			const docRef = doc(colRefQuestionNAnswers, id);

			await updateDoc(docRef, {
				image: image,
			}).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};

		updateDummyAnswers = async (dummyAnswers: string, id: string) => {
			const docRef = doc(colRefQuestionNAnswers, id);

			await updateDoc(docRef, {
				dummyAnswers: math(dummyAnswers),
			}).catch((err) => {
				clearTimeout(dashboardErrMsgRef.current);
				setDashboardErrMsg(err.message);

				dashboardErrMsgRef.current = setTimeout(() => {
					setDashboardErrMsg("");
				}, dashboardErrMsgTime);
			});
		};
	}
	const QNAS = new QuestionNAnswerSystem();
	const createQuestionNAnswer = QNAS.createQuestionNAnswer;
	const deleteQuestionNAnswer = QNAS.deleteQuestionNAnswer;
	const editQuestionNAnswer = QNAS.editQuestionNAnswer;
	const updateUnderstand = QNAS.updateUnderstand;
	const updateDidntUnderstand = QNAS.updateDidntUnderstand;
	const updateCompleted = QNAS.updateCompleted;
	const updateImage = QNAS.updateImage;
	const updateDummyAnswers = QNAS.updateDummyAnswers;

	return {
		auth,
		registration: {
			allUsers,
			registrationErrMsg,
			dashboardErrMsg,
			addUser,
			signIn,
			googleSignIn,
			themeChange,
			passwordReset,
			logout,
			hidingSection1,
			hidingSection2,
			hidingSection3,
			hidingSection4,
		},

		folderSystem: {
			allFolders,
			addingFolder,
			deletingFolder,
			updateCreatedTime,
			updateFolderName,
			updateFolderDescription,
		},

		folderMaterialSystem: {
			allFolderMaterials,
			createMainMaterial,
			deleteMainMaterial,
			updateMainMaterialCreatedTime,
			updateMainMaterialTitle,
			updateMainMaterialCompletion,
		},

		questionNAnswerSystem: {
			allQuestionsNAnswers,
			createQuestionNAnswer,
			deleteQuestionNAnswer,
			editQuestionNAnswer,
			updateUnderstand,
			updateDidntUnderstand,
			updateCompleted,
			updateImage,
			updateDummyAnswers,
		},
	};
}
