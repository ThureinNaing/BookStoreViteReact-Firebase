import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useTheme from "../Hooks/useTheme";
import lightIcon from "../assets/light.svg";
import darkIcon from "../assets/dark.svg";
import { motion, AnimatePresence } from "framer-motion";
import useSignout from "../Hooks/useSignout";
import { AuthContext } from "../contexts/AuthContext";
import UploadProfile from "./UploadProfile";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import profileIcon from "../assets/profileIcon.svg";

export default function Navbar() {
	let { isDark, changeTheme } = useTheme(); // dark & light mode
	let [showModal, setShowModal] = useState(false);
	let [showProfileModal, setShowProfileModal] = useState(false);
	let [profilePhoto, setProfilePhoto] = useState(profileIcon);
	let [User, setUser] = useState(null);
	const [userName, setUserName] = useState("Add Your Name");
	const [email, setEmail] = useState(null);
	let [userNameEdit, setUserNameEdit] = useState(false);
	let [file, setFile] = useState(null);
	let [preview, setPreview] = useState(null);
	let [previewImg, setPreviewImg] = useState(true);
	let backdrop = {
		visible: { opacity: 1 },
		hidden: { opacity: 0 },
	};
	let backdropProfile = {
		visible: { opacity: 1 },
		hidden: { opacity: 0 },
	};
	// for search
	let location = useLocation();
	let searchValue = new URLSearchParams(location.search);
	let [search, setSearch] = useState(searchValue);
	let navigate = useNavigate();
	let handleSearch = (e) => {
		navigate("/home/?search=" + search);
		setSearch("");
	};
	let { user } = useContext(AuthContext);
	// sign out
	let { logout } = useSignout();
	let signOutUser = async () => {
		await logout();
		setUser(null);
		setProfilePhoto(null);
		setUserName("Add Your Name");
		setEmail(null);
		navigate("/login");
	};

	// show email
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			if (currentUser) {
				// Fetch profile photo URL and user name from Firestore
				fetchUserProfile(currentUser.uid);
			}
		});

		return () => unsubscribe();
	}, []);

	const fetchUserProfile = async (uid) => {
		try {
			const userDoc = doc(db, "books", uid);
			const docSnap = await getDoc(userDoc);
			if (docSnap.exists()) {
				const userData = docSnap.data();
				setProfilePhoto(userData.profilePhoto || null);
				setUserName(userData.userName || "Add Your Name");
			}
		} catch (error) {
			console.error("Error fetching user profile:", error);
		}
	};

	// input file
	let handlePotoChange = (e) => {
		setFile(e.target.files[0]);
	};
	let handlePreviewImage = (file) => {
		let reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = () => {
			setPreview(reader.result);
		};
	};

	useEffect(() => {
		if (file) {
			handlePreviewImage(file);
		}
	}, [file]); //for file
	// upload file to firebase
	let uploadToFirebase = async (file) => {
		let uniqueFileName = Date.now().toString() + "_" + file?.name;
		console.log("unique file name :", uniqueFileName);

		let path =
			"/user_profile_image/" + user.uid + "/" + "/" + uniqueFileName;
		console.log("Path:", path);
		let storageRef = ref(storage, path);
		console.log("storage ref: ", storageRef);
		await uploadBytes(storageRef, file);
		return await getDownloadURL(storageRef);
	};
	let handleSubmit = async (e) => {
		e.preventDefault();
		if (file) {
			try {
				let url = await uploadToFirebase(file);
				setProfilePhoto(url);

				// Update Firestore with new profile photo URL
				if (user) {
					const userDoc = doc(db, "books", user.uid);
					await setDoc(
						userDoc,
						{ profilePhoto: url },
						{ merge: true }
					); // Use merge: true to update or create
				}
				setShowProfileModal(false);
			} catch (error) {
				console.error("Error updating profile photo:", error.message);
			}
		}
		console.log("add");
		setPreviewImg(false);
	};

	let deleteProfilePhoto = async (e) => {
		e.preventDefault();
		setProfilePhoto(profileIcon);

		// Update Firestore with new user name
		if (user) {
			try {
				const userDoc = doc(db, "books", user.uid);
				await updateDoc(
					userDoc,
					{ profilePhoto: profileIcon },
					{ merge: true }
				); // Use merge: true to update or create
			} catch (error) {
				console.error("Error updating user name:", error.message);
			}
		}
		console.log("hit");
	};

	let addName = async (e) => {
		e.preventDefault();
		setUserName(userName);
		setUserNameEdit(false);

		// Update Firestore with new user name
		if (user) {
			try {
				const userDoc = doc(db, "books", user.uid);
				await setDoc(userDoc, { userName: userName }, { merge: true }); // Use merge: true to update or create
			} catch (error) {
				console.error("Error updating user name:", error.message);
			}
		}
	};

	return (
		<nav
			className={`border-b-2 ${
				isDark ? "bg-dbg border-indigo-500" : "bg-white"
			}`}
		>
			<ul className="flex justify-between items-center p-3 max-w-6xl mx-auto">
				<li className="flex justify-center items-center space-x-10">
					{/* book store */}
					<Link
						to="/home"
						className="flex items-center  gap-3 cursor-pointer"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className={`size-6 -mr-6 md:mr-0 ${
								isDark ? "text-white" : ""
							}`}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
							/>
						</svg>

						<button className="text-2xl font-bold  hidden md:block text-indigo-600">
							BookStore
						</button>
					</Link>
					{/* search fro mobile view */}
					<div className=" items-center gap-3 ">
						{/* search icon btn */}
						<div>
							<button
								onClick={() => setShowModal(true)}
								type="button"
								className=" md:hidden mx-auto flex items-center justify-center "
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className={`size-6 ${
										isDark ? "text-white" : ""
									}`}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
									/>
								</svg>
							</button>
						</div>
						{/* search box */}
						<AnimatePresence mode="wait">
							{showModal && (
								<motion.div
									variants={backdrop}
									initial="hidden"
									animate="visible"
									className="backdrop md:hidden  flex justify-center items-center justify-self-center rounded-md border-2 border-gray-200 shadow-2xl"
								>
									<li className="flex items-center justify-between gap-3 border-lg rounded-md shadow-xl bg-gray-200 h-12 w-full p-3 m-1">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className={`size-6 `}
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
											/>
										</svg>
										<input
											value={search}
											onChange={(e) =>
												setSearch(e.target.value)
											}
											type="text"
											placeholder="Search Book....."
											className="searchInput  outline-none px-2 py-1 rounded-lg "
										/>
										<div className="flex justify-center items-center space-x-3">
											<button
												onClick={handleSearch}
												className=" bg-indigo-600 rounded-2xl px-3 py-1 flex  items-center gap-1 text-sm "
											>
												<span className="  text-white">
													Search
												</span>
											</button>
											<div
												onClick={() =>
													setShowModal(false)
												}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth="1.5"
													stroke="currentColor"
													className="size-6 cursor-pointer"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M6 18 18 6M6 6l12 12"
													/>
												</svg>
											</div>
										</div>
									</li>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</li>

				{/* search for desktop*/}
				<li className="hidden md:block">
					<div className="flex items-center gap-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className={`size-6 ${isDark ? "text-white" : ""}`}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
							/>
						</svg>
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							type="text"
							placeholder="Search Book....."
							className="hidden md:block outline-none px-2 py-1 rounded-lg "
						/>
						<button
							onClick={handleSearch}
							className=" md:bg-indigo-600 rounded-2xl px-3 py-1 flex  items-center gap-1 text-sm "
						>
							<span className="hidden md:block text-white">
								Search
							</span>
						</button>
					</div>
				</li>

				{/* create book */}
				<li className="flex gap-3 items-center">
					<Link
						to="/create"
						className=" md:bg-indigo-600 rounded-2xl px-3  py-2 flex items-center gap-1 text-sm  md:mr-3"
					>
						<span className="hidden md:block text-white">
							Create Book
						</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className={`size-6 md:text-white ${
								isDark ? "text-white" : ""
							}`}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
							/>
						</svg>
					</Link>
					{/* profile */}
					<div className="flex items-center justify-center  gap-3">
						<div
							onClick={() => setShowProfileModal(true)}
							className="w-11"
						>
							<img
								src={`${user ? profilePhoto : profileIcon}`}
								alt="img"
								className={`w-full text-gray-400 rounded-full h-10 cursor-pointer`}
							/>
						</div>

						{/* change profile */}
						{
							<AnimatePresence mode="waite">
								{showProfileModal && (
									<motion.div
										variants={backdropProfile}
										initial="hidden"
										animate="visible"
										className=" backdropProfile max-w-6xl right-0 md:right-20"
									>
										<UploadProfile
											setShowProfileModal={
												setShowProfileModal
											}
											setProfilePhoto={setProfilePhoto}
											profilePhoto={profilePhoto}
											userName={userName}
											setUserName={setUserName}
											userNameEdit={userNameEdit}
											preview={preview}
											handlePotoChange={handlePotoChange}
											handleSubmit={handleSubmit}
											addName={addName}
											deleteProfilePhoto={
												deleteProfilePhoto
											}
										/>
									</motion.div>
								)}
							</AnimatePresence>
						}
					</div>
					{/* light and dark mode */}
					<div className="cursor-pointer">
						{isDark && (
							<motion.img
								whileHover={{ rotate: 360 }}
								src={lightIcon}
								alt=""
								className="w-8"
								onClick={() => changeTheme("light")}
							/>
						)}
						{!isDark && (
							<motion.img
								whileHover={{ rotate: 30 }}
								src={darkIcon}
								alt=""
								className="w-8"
								onClick={() => changeTheme("dark")}
							/>
						)}
					</div>
					{/*sign in , login, logout btn */}
					<div className="space-x-3 mx-auto">
						{/* {!user && (
							<>
								<Link
									to={`/login`}
									className={`${
										isDark ? "text-white" : "text-black"
									} border-2 border-indigo-500 rounded-md px-2 py-2 text-sm `}
								>
									Login
								</Link>
								<Link
									to={`/register`}
									className="bg-indigo-500 text-white rounded-md px-2 py-2 text-sm "
								>
									Register
								</Link>
							</>
						)} */}

						{!!user && (
							<motion.div
								whileHover={{
									scale: 1,
									scaleX: 1.1,
								}}
							>
								<Link
									to={`/logout`}
									onClick={signOutUser}
									className="flex items-center justify-center text-red-600 text-md font-extrabold rounded-lg px-2 py-2"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										className="size-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
										/>
									</svg>
									<span>Logout</span>
								</Link>
							</motion.div>
						)}
					</div>
				</li>
			</ul>
		</nav>
	);
}
