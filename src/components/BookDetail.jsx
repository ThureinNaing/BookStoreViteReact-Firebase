import { useNavigate, useParams } from "react-router-dom";
import useTheme from "../Hooks/useTheme";
import useFirestore from "../Hooks/useFirestore";
import { Link } from "react-router-dom";
import NoteForm from "./NoteForm";
import NoteList from "./NoteList";

export default function BookDetail() {
	let { id } = useParams();
	let navigate = useNavigate();
	let { isDark } = useTheme(); // dark mode
	let { getDocument } = useFirestore();
	let { error, data: book, loading } = getDocument("books", id);

	return (
		<>
			{error && <p>{error}</p>}
			{loading && <p>Loading now......</p>}
			{book && (
				<>
					<div
						className={`grid md:grid-cols-2 grid-rows-1 ${
							isDark ? "text-white" : ""
						}`}
					>
						<div>
							<img
								src={book.cover}
								alt=""
								className="w-[80%] mx-auto"
							/>
						</div>
						<div className=" row-span-2 space-y-4">
							<h1 className="text-3xl font-bold ">
								{book.title}
							</h1>
							<div className="space-x-3 ">
								{book.categories.map((category) => (
									<span
										key={category}
										className="bg-blue-500 rounded-full text-white text-sm py-1 px-2 "
									>
										{category}
									</span>
								))}
							</div>
							<p>{book.description}</p>
						</div>
					</div>
					{/* note */}
					<div>
						<h3 className="text-indigo-500 text-center text-2xl font-bold my-3">
							My notes
						</h3>
						<NoteForm />
						<NoteList />
					</div>
				</>
			)}
		</>
	);
}
