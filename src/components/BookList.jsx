import trash from "../assets/trash.svg";
import pencil from "../assets/pencil.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useTheme from "../Hooks/useTheme";
import useFirestore from "../Hooks/useFirestore";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { motion } from "framer-motion";

export default function BookList() {
	let navigate = useNavigate();
	let location = useLocation();
	let params = new URLSearchParams(location.search);
	let search = params.get("search");
	let { isDark } = useTheme();
	let { getCollection, deleteDocument } = useFirestore();

	// books =>uid = auth.user.uid
	let { user } = useContext(AuthContext);
	let {
		error,
		data: books,
		loading,
	} = getCollection("books", ["uid", "==", user.uid], {
		field: "title",
		value: search ? search : "",
	});
	// delete book function
	let deleteBook = async (e, id) => {
		e.preventDefault();
		await deleteDocument("books", id);
	};

	if (error) {
		<p>{error}</p>;
	}

	return (
		<div>
			{loading && (
				<div className="flex justify-center items-center h-10">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 200 200"
						className="h-full"
					>
						<circle
							fill="#084EFF"
							stroke="#084EFF"
							strokeWidth="15"
							r="15"
							cx="40"
							cy="100"
						>
							<animate
								attributeName="opacity"
								calcMode="spline"
								dur="2"
								values="1;0;1;"
								keySplines=".5 0 .5 1;.5 0 .5 1"
								repeatCount="indefinite"
								begin="-.4"
							></animate>
						</circle>
						<circle
							fill="#084EFF"
							stroke="#084EFF"
							strokeWidth="15"
							r="15"
							cx="100"
							cy="100"
						>
							<animate
								attributeName="opacity"
								calcMode="spline"
								dur="2"
								values="1;0;1;"
								keySplines=".5 0 .5 1;.5 0 .5 1"
								repeatCount="indefinite"
								begin="-.2"
							></animate>
						</circle>
						<circle
							fill="#084EFF"
							stroke="#084EFF"
							strokeWidth="15"
							r="15"
							cx="160"
							cy="100"
						>
							<animate
								attributeName="opacity"
								calcMode="spline"
								dur="2"
								values="1;0;1;"
								keySplines=".5 0 .5 1;.5 0 .5 1"
								repeatCount="indefinite"
								begin="0"
							></animate>
						</circle>
					</svg>
				</div>
			)}
			{/* Books list */}
			{!!books && (
				<div className="grid grid-flow-row gap-4 grid-cols-2 md:grid-cols-4 my-3 ">
					{books.map((book) => (
						<div key={book.id}>
							<motion.div
								whileHover={{
									scale: 1,
									boxShadow: "0px 0px 8px rgb(0,0,250)",
								}}
								className={`flex flex-col justify-between p-4 border border-1 h-full  shadow-lg ${
									isDark
										? "bg-dcard border-indigo-500 text-white"
										: ""
								}`}
							>
								<div className="text-center space-y-3 p-3 ">
									<img src={book.cover} alt="" />
									<h1 className="flex justify-start font-bold">
										{book.title}
									</h1>
									<div className="h-20 overflow-hidden">
										<p className="flex justify-start">
											{book.description}
										</p>
									</div>

									{/* genres */}
									<div className="  ">
										<div className="flex flex-wrap justify-start items-center flex-direction-col">
											{book.categories.map((c) => (
												<span
													key={c}
													className="mx-1 my-1  px-2 py-1 rounded-full text-white bg-blue-500"
												>
													{c}
												</span>
											))}
										</div>
									</div>
								</div>
								{/* delete and edit and readmore */}

								<div className="flex justify-between items-center">
									<motion.div
										whileHover={{
											scale: 1,
											boxShadow:
												"0px 0px 8px rgb(0,0,250)",
										}}
										className="border border-blue-500 p-1 m-1  rounded-md text-blue-500"
									>
										<Link
											to={`/books/${book.id}`}
											key={book.id}
											className=" text-xs"
										>
											Read more
										</Link>
									</motion.div>
									<div className="flex justify-end items-center space-x-3 ">
										{/* pencil icon */}
										<motion.img
											whileHover={{ rotate: 360 }}
											src={pencil}
											alt="pencil"
											onClick={(e) => {
												e.preventDefault();
												navigate(`/edit/${book.id}`);
											}}
										/>

										{/* trash icon */}
										<motion.img
											whileHover={{ rotate: 360 }}
											src={trash}
											alt="trash"
											onClick={(e) =>
												deleteBook(e, book.id)
											}
										/>
									</div>
								</div>
							</motion.div>
						</div>
					))}
				</div>
			)}
			{books && !books.length && !loading && (
				<p className="text-center text-xl text-gray-500 font-bold">
					There is no document
				</p>
			)}
		</div>
	);
}
