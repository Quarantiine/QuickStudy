import { FirebaseApp, initializeApp } from "firebase/app";
import {
	CollectionReference,
	Firestore,
	Query,
	addDoc,
	collection,
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

export default function FirebaseAPI() {
	const [allUsers, setAllUsers] = useState<any[]>([]);
	const [registrationErrMsg, setRegistrationErrMsg] = useState<string>("");
	const [dashboardErrMsg, setDashboardErrMsg] = useState<string>("");

	const registrationErrMsgRef = useRef<any>();
	const registrationErrMsgTime = 5000;

	const dashboardErrMsgRef = useRef<any>();
	const dashboardErrMsgTime = 5000;

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
	};
}
