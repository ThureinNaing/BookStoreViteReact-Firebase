import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import profileIcon from "../assets/profileIcon.svg";
import useTheme from "../Hooks/useTheme";

export default function UploadProfile({
	setShowProfileModal,
	profilePhoto,
	userName,
	setUserName,
	preview,
	handlePotoChange,
	handleSubmit,
	addName,
	deleteProfilePhoto,
}) {
	let { isDark, changeTheme } = useTheme(); // dark & light mode
	let { user } = useContext(AuthContext);
	let [showInput, setShowInput] = useState(false);
	const [showEditUserName, setShowEditUserName] = useState(false);

	return (
		<div className=" bg-gray-300 rounded-md  space-y-3">
			<div className=" ">
				<div className="flex justify-between items-center p-3">
					<div>
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
								d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
							/>
						</svg>
					</div>
					<div onClick={() => setShowProfileModal(false)}>
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

				<div className="flex flex-col cursor-pointer justify-center items-center space-y-5 md:space-y-5">
					{!user && (
						<img
							src={profilePhoto}
							alt=""
							className=" w-full rounded-full h-20 "
						/>
					)}
					{!!user && (
						<div className="flex flex-col justify-center items-center">
							{showInput && (
								<div className="w-20 mt-1 ">
									<img
										src={preview}
										alt=""
										className=" w-full rounded-full h-20 "
									/>
								</div>
							)}

							<div
								onClick={() => setShowInput(true)}
								className="flex flex-col justify-center items-center w-20 mt-1"
							>
								{!showInput && (
									<img
										src={profilePhoto}
										alt=""
										className=" w-full rounded-full h-20 "
									/>
								)}
							</div>

							{showInput && (
								<div className="space-y-3 cursor-pointer">
									<input
										type="file"
										onChange={handlePotoChange}
									/>
									<div className="flex justify-evenly items-center">
										{/* add profile */}
										<button
											onClick={handleSubmit}
											className="border border-indigo-600 m-3 p-1 rounded-md"
										>
											Add
										</button>
										{/* default profile */}
										<button
											onClick={deleteProfilePhoto}
											className="border border-indigo-600 m-3 p-1 rounded-md"
										>
											Delete
										</button>
									</div>
								</div>
							)}
							<div>
								{!!user && (
									<div>
										{!showEditUserName && (
											<h2
												onClick={() =>
													setShowEditUserName(true)
												}
											>
												{userName}
											</h2>
										)}
									</div>
								)}

								{showEditUserName && (
									<div className="flex items-center justify-evenly">
										<input
											value={userName}
											type="text"
											onChange={(e) =>
												setUserName(e.target.value)
											}
											className="bg-transparent"
										/>

										<svg
											onClick={addName}
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
												d="M12 4.5v15m7.5-7.5h-15"
											/>
										</svg>
									</div>
								)}
							</div>
						</div>
					)}

					<h2>
						{user ? (
							<div className="flex flex-col justify-center items-center space-y-3">
								<p> {user.email}</p>
								<Link
									to="/forgotpassword"
									onClick={() => setShowProfileModal(false)}
									className="active rounded-md border border-black m-2 p-1 hover:peer-open:"
								>
									Forgot Password
								</Link>
							</div>
						) : (
							<div className="flex gap-3">
								{" "}
								<Link
									to={`/login`}
									className={`text-black border-2 border-indigo-500 rounded-md px-2 py-2 text-sm `}
								>
									Login
								</Link>
								<Link
									to={`/register`}
									className="bg-indigo-500 text-black rounded-md px-2 py-2 text-sm "
								>
									Register
								</Link>
							</div>
						)}
					</h2>
					<div className="flex">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							id="github"
						>
							<path d="M7.999 0C3.582 0 0 3.596 0 8.032a8.031 8.031 0 0 0 5.472 7.621c.4.074.546-.174.546-.387 0-.191-.007-.696-.011-1.366-2.225.485-2.695-1.077-2.695-1.077-.363-.928-.888-1.175-.888-1.175-.727-.498.054-.488.054-.488.803.057 1.225.828 1.225.828.714 1.227 1.873.873 2.329.667.072-.519.279-.873.508-1.074-1.776-.203-3.644-.892-3.644-3.969 0-.877.312-1.594.824-2.156-.083-.203-.357-1.02.078-2.125 0 0 .672-.216 2.2.823a7.633 7.633 0 0 1 2.003-.27 7.65 7.65 0 0 1 2.003.271c1.527-1.039 2.198-.823 2.198-.823.436 1.106.162 1.922.08 2.125.513.562.822 1.279.822 2.156 0 3.085-1.87 3.764-3.652 3.963.287.248.543.738.543 1.487 0 1.074-.01 1.94-.01 2.203 0 .215.144.465.55.386A8.032 8.032 0 0 0 16 8.032C16 3.596 12.418 0 7.999 0z"></path>
						</svg>
					</div>
				</div>
			</div>

			<div className="space-y-5 mx-3 border-t-2 border-black p-3">
				<div className="flex  justify-between ">
					<span>Other profile</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="size-6 rotate-180 hover:cursor-pointer"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
						/>
					</svg>
				</div>
				<div className="flex justify-start cursor-not-allowed">
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
							d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
						/>
					</svg>
					<span>Guest</span>
				</div>
				<div className="flex cursor-not-allowed">
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
							d="M12 4.5v15m7.5-7.5h-15"
						/>
					</svg>
					<span>Add</span>
				</div>
			</div>
		</div>
	);
}
