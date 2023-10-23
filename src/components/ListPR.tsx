import Link from "next/link";
import { useRepo } from "@/context/RepoContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { pull } from "@/services/github";

export default function ListPR() {
	const router = useRouter();
	const { repo_token, repo_url, list_PR, getListPRContext, setSelectedPR } =
		useRepo();
	console.log(repo_token, repo_url);
	getListPRContext(repo_url, repo_token);

	const [isSearch, setIsSearch] = useState(false);
	const [searchValue, setSeachValue] = useState<string>("");
	const [searchList, setSearchList] = useState<pull[] | undefined>();

	function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
		setSeachValue(e.target.value);
		if (e.target.value === "") {
			setIsSearch(false);
			return;
		}
		setIsSearch(true);
		setSearchList(
			list_PR!.filter((PR) => PR.title.toLowerCase().includes(searchValue))
		);
	}

	return (
		<div className=" flex h-screen">
			<div className=" w-screen flex justify-center">
				<div className="relative sm:rounded-lg w-full m-8">
					<div className="flex items-center justify-between pb-4 bg-white ">
						<label htmlFor="table-search" className="sr-only">
							Search
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
								<svg
									className="w-4 h-4 text-gray-500 "
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 20 20"
								>
									<path
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
									/>
								</svg>
							</div>
							<input
								type="text"
								id="table-search-users"
								className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								value={searchValue}
								onChange={handleSearch}
							/>
						</div>
					</div>
					<table className=" table w-full text-sm text-left text-gray-500 dark:text-gray-400 overflow-scroll">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th scope="col" className="px-6 py-3">
									Title
								</th>
								<th scope="col" className="px-6 py-3">
									Upploader
								</th>
								<th scope="col" className="px-6 py-3">
									Link PR
								</th>
								<th scope="col" className="px-6 py-3">
									Status
								</th>

								<th scope="col" className="px-6 py-3">
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{!isSearch
								? list_PR &&
								  list_PR.map((pr, index) => (
										<tr className="table__row" key={index}>
											<td className=" pr__title">{pr.title}</td>
											<td>{pr.upploader}</td>
											<td>
												<Link href={pr.html_url}>{pr.html_url}</Link>
											</td>
											<td>
												<div className="flex items-center">
													<div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
													Open
												</div>
											</td>
											<td>
												<a
													className="pr__action cursor-pointer"
													onClick={() => {
														setSelectedPR(pr);
														// handleSelectPRContext(pr);
														router.push("/diff");
													}}
												>
													Review
												</a>
											</td>
										</tr>
								  ))
								: searchList &&
								  searchList.map((pr, index) => (
										<tr className="table__row" key={index}>
											<td className=" pr__title">{pr.title}</td>
											<td>{pr.upploader}</td>
											<td>
												<Link href={pr.html_url}>{pr.html_url}</Link>
											</td>
											<td>
												<div className="flex items-center">
													<div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
													Open
												</div>
											</td>
											<td>
												<a
													className="pr__action cursor-pointer"
													onClick={() => {
														setSelectedPR(pr);
														// handleSelectPRContext(pr);
														router.push("/diff");
													}}
												>
													Review
												</a>
											</td>
										</tr>
								  ))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
