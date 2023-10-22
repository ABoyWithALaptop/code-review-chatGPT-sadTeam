import Link from "next/link";
import { useEffect, useState } from "react";
import { useRepo } from "@/context/RepoContext";

export default function ListPR() {
  const {repo_token,repo_url, list_PR, getListPRContext, handleSelectPRContext } = useRepo();
  console.log(repo_token,repo_url)
  getListPRContext(repo_url,repo_token);

  return (
    <div className=" flex h-screen">
      <div className=" w-screen flex justify-center">
        <div className="relative shadow-md sm:rounded-lg w-full m-8">
          <div className="flex items-center justify-between pb-4 bg-white dark:bg-gray-900">
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
                placeholder="Search for users"
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
              {/* <tr className="table__row">
                <td className=" pr__title">
                  Neil Sims Neil dsadasddsadasdsadasddasdasdsadadasdsadasd
                  dsadasdsada dsadasdsada dsadasdsada
                </td>
                <td>React Developer</td>
                <td>
                  <Link href="/">
                    dsadasddsadasdsadasddasdasdsadadasdsadasd dsadasdsada
                    dsadasdsada
                  </Link>
                </td>
                <td>
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                    Open
                  </div>
                </td>
                <td>
                  <a href="#" className="pr__action">
                    Review
                  </a>
                </td>
              </tr> */}
              {list_PR &&
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
                        onClick={() => handleSelectPRContext(pr)}
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
