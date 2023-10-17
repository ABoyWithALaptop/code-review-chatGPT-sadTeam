import axios from "axios";
import { Octokit } from "octokit";
import parse from "parse-diff";

export type pull = {
	number_pull: number;
	id: number;
	title: string;
	state: string;
	diff_url: string;
	updated_at: string;
	upploader?: string;
	comments_url: string;
};

export async function getPulls(url: string, token?: string) {
	const urlFormat = new URL(url);
	console.log("getRepo", urlFormat, token);
	const [owner, repo] = urlFormat.pathname.split("/").slice(1, 3);
	console.log("getRepo", owner, repo);

	const octokit = new Octokit({});

	const res = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
		owner: owner,
		repo: repo,
		headers: {
			"X-GitHub-Api-Version": "2022-11-28",
		},
	});
	console.log("res", res);
	const formatRes: pull[] = res.data.map<pull>((item) => ({
		number_pull: item.number,
		id: item.id,
		title: item.title,
		state: item.state,
		diff_url: item.diff_url,
		updated_at: item.updated_at,
		upploader: item.user?.login,
		comments_url: item.comments_url,
	}));
	return formatRes;
}

export async function getDiff(url_diff: string, token?: string) {
	try {
		console.log("do it");
		const urlFormat = new URL(url_diff);
		const [owner, repo, pull, number] = urlFormat.pathname
			.split("/")
			.slice(1, 5);
		console.log("getRepo", owner, repo, pull, number);
		const octokit = new Octokit({
			// auth: "YOUR-TOKEN",
		});

		const res = await octokit.request(
			"GET /repos/{owner}/{repo}/pulls/{pull_number}",
			{
				owner: owner,
				repo: repo,
				pull_number: parseInt(number),
				headers: {
					"X-GitHub-Api-Version": "2022-11-28",
					accept: "application/vnd.github.v3.diff",
				},
			}
		);

		console.log("res", res);
		const formatRes = parse(String(res.data));
		console.log("formatRes", formatRes);
		let formatRes2: parse.File[] = [];
		formatRes.forEach((item) => {
			if (item.from?.includes("lock.json")) return;
			const file = {};
		});
	} catch (error) {
		console.log("error", error);
	}
}

// export async function createCommentPR(pullrequest: pull) {
// 	// Octokit.js
// 	// https://github.com/octokit/core.js#readme
// 	const octokit = new Octokit({
// 		auth: "YOUR-TOKEN",
// 	});

// 	await octokit.request(
// 		"POST /repos/{owner}/{repo}/pulls/{pull_number}/comments",
// 		{
// 			owner: "OWNER",
// 			repo: "REPO",
// 			pull_number: "PULL_NUMBER",
// 			body: "Great stuff!",
// 			commit_id: "6dcb09b5b57875f334f61aebed695e2e4193db5e",
// 			path: "file1.txt",
// 			start_line: 1,
// 			start_side: "RIGHT",
// 			line: 2,
// 			side: "RIGHT",
// 			headers: {
// 				"X-GitHub-Api-Version": "2022-11-28",
// 			},
// 		}
// 	);
// }
export function callGPT(files: []) {
	var patchPartArray = [];
	files.forEach((file) => {});
}
