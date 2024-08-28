import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTheme from "../Hooks/useTheme.js";
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "../firebase/index.js";
import useFirestore from "../Hooks/useFirestore.js";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { motion } from "framer-motion";

export default function BookForm() {
	let { user } = useContext(AuthContext);

	let [file, setFile] = useState(null);
	let [preview, setPreview] = useState(null);
	let [title, setTitle] = useState("");
	let [description, setDescription] = useState("");
	let [newCategory, setNewCategory] = useState("");
	let [categories, setCategories] = useState([]);
	let navigate = useNavigate();
	let { isDark } = useTheme(); // for dark mode;

	let { id } = useParams();
	let [isEdit, setIsEdit] = useState(false);
	let { updateDocument, addCollection } = useFirestore();

	useEffect(() => {
		// edit form
		if (id) {
			setIsEdit(true);
			let ref = doc(db, "books", id);
			getDoc(ref).then((doc) => {
				if (doc.exists()) {
					let { title, description, categories } = doc.data();
					setTitle(title);
					setDescription(description);
					setCategories(categories);
				}
			});
		}
		// create form
		else {
			setIsEdit(false);
			setTitle("");
			setDescription("");
			setCategories([]);
		}
	}, []);

	//add category
	let addCategory = () => {
		// prevent for double adding
		setNewCategory("");
		if (newCategory && categories.includes(newCategory)) {
			return;
		}
		setCategories((prev) => [newCategory, ...prev]);
	};
	// upload file to firebase
	let uploadToFirebase = async (file) => {
		let uniqueFileName = Date.now().toString() + "_" + file?.name;
		console.log("unique file name :", uniqueFileName);

		let path = "/convers/" + user.uid + "/" + "/" + uniqueFileName;
		console.log("Path:", path);
		let storageRef = ref(storage, path);
		console.log("storage ref: ", storageRef);
		await uploadBytes(storageRef, file);
		return await getDownloadURL(storageRef);
	};
	//dynamic form submission handling on firestore
	let submitForm = async (e) => {
		e.preventDefault();
		let url = await uploadToFirebase(file);
		let data = {
			title,
			description,
			categories,
			uid: user.uid,
			cover: url,
		};
		console.log("data: ", data);
		//update at fire store
		if (isEdit) {
			await updateDocument("books", id, data);
		}
		// create at firestore
		else {
			await addCollection("books", data);
		}

		navigate("/home");
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

	return (
		<div className="h-screen">
			<form
				className="w-full max-w-lg mx-auto mt-5"
				onSubmit={submitForm}
			>
				{/* title */}
				<div className="flex flex-wrap -mx-3 mb-6">
					<div className="w-full px-3">
						<label
							className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ${
								isDark ? "text-white" : ""
							}`}
							htmlFor="book-title"
						>
							Book title
						</label>
						<input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
							id="book-title"
							type="text"
							placeholder="Book title"
						/>
					</div>
				</div>

				{/* description */}
				<div className="flex flex-wrap -mx-3 mb-6">
					<div className="w-full px-3">
						<label
							className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ${
								isDark ? "text-white" : ""
							}`}
							htmlFor="book-description"
						>
							Book description
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="h-20 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
							id="book-description"
							type="text"
							placeholder="Book description"
						/>
					</div>
				</div>

				{/* category */}
				<div className="flex flex-wrap -mx-3 mb-6">
					<div className="w-full px-3">
						<label
							className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ${
								isDark ? "text-white" : ""
							}`}
							htmlFor="book-category"
						>
							Book categories
						</label>

						<div className="flex justify-center items-center space-x-2">
							<input
								value={newCategory}
								onChange={(e) => setNewCategory(e.target.value)}
								className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
								id="book-category"
								type="text"
								placeholder="Book category"
							/>
							<motion.button
								whileHover={{
									scale: 1.1,
									textShadow: "0px 0px 8px rgb(1,100,5)",
									boxShadow: "0px 0px 8px rgb(10,10,10)",
								}}
								type="button"
								className="bg-indigo-500 p-1 rounded-lg mb-3"
								onClick={addCategory}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-6 text-white"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
									/>
								</svg>
							</motion.button>
						</div>
					</div>
					<div className="w-full px-3">
						<label
							className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ${
								isDark ? "text-white" : ""
							}`}
							htmlFor="book-title"
						>
							Preview File
						</label>
						<input type="file" onChange={handlePotoChange} />
						{!!preview && (
							<img
								src={preview}
								alt=""
								className="my-3 width={500} height={500} "
							/>
						)}
					</div>

					{/* new categories */}
					<div className="flex flex-wrap">
						{categories.map((c) => (
							<span
								key={c}
								className="mx-1 my-1  px-2 py-1 rounded-full text-white bg-indigo-600"
							>
								{c}
							</span>
						))}
					</div>
				</div>

				{/* button */}
				<button className=" bg-indigo-600 rounded-2xl px-3 py-2 flex items-center justify-center w-full  gap-2 text-sm ">
					<span className="  text-white">
						{isEdit ? "Update" : "Create"} Book
					</span>
				</button>
			</form>
		</div>
	);
}
