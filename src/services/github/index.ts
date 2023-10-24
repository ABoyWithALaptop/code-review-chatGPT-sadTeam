import { Octokit } from "octokit";
import parse, { Change } from "parse-diff";

export type pull = {
	number_pull: number;
	id: number;
	title: string;
	diff_url: string;
	updated_at: string;
	upploader?: string;
	comments_url: string;
	html_url: string;
	description?: string;
	owner: string;
	repo: string;
};
export type fileInfoWithDiff = {
	changeLine: { content: string; changes: Change[] }[];
	index?: string[];
	oldFile?: string;
	newFile?: string;
	rawString: string;
};

export async function getPulls(url: string, token?: string) {
	let urlFormat;
	try {
		console.log("url", url);
		urlFormat = new URL(url);
		console.log("getRepo", urlFormat, token);
		const [owner, repo] = urlFormat.pathname.split("/").slice(1, 3);
		console.log("getRepo", owner, repo);
		const option = token ? { auth: token } : {};
		const octokit = new Octokit(option);

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
			diff_url: item.diff_url,
			updated_at: item.updated_at,
			upploader: item.user?.login,
			comments_url: item.comments_url,
			html_url: item.html_url,
			description: item.body && item.body.length > 0 ? item.body : undefined,
			owner: item.head.repo.owner.login,
			repo: item.head.repo.name,
		}));
		console.log("formatRes", formatRes);
		return formatRes;
	} catch (error) {
		console.warn(error);
	}
}

export async function getDiff(diff_url: string, token?: string) {
	try {
		console.log("do it");
		const urlFormat = new URL(diff_url);
		const [owner, repo, pull, number] = urlFormat.pathname
			.split("/")
			.slice(1, 5);
		console.log("getRepo", owner, repo, pull, number);
		const option = token ? { auth: token } : {};
		const octokit = new Octokit(option);

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

		const rawString = String(res.data)
			.split("diff ")
			.filter((item) => item !== "");
		const formatRes = parse(String(res.data));
		let formatRes2: fileInfoWithDiff[] = [];
		formatRes.forEach((item, index) => {
			if (item.from?.includes("lock.json")) return;
			const file = {
				changeLine: item.chunks.map((chunk) => ({
					content: chunk.content,
					changes: chunk.changes,
				})),
				index: item.index,
				oldFile: item.from,
				newFile: item.to,
				rawString: rawString[index],
			};
			formatRes2.push(file);
		});
		return formatRes2;
	} catch (error) {
		console.log("error", error);
	}
}

export async function createComment(
	pull: pull,
	token: string = "",
	comment: string
) {
	const option = token ? { auth: token } : {};
	const octokit = new Octokit(option);
	// const octokit = new Octokit({
	// 	auth: "YOUR-TOKEN",
	// });
	const owner = pull.owner;
	const repo = pull.repo;
	const res = await octokit.request(
		"POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
		{
			owner: owner,
			repo: repo,
			issue_number: pull.number_pull,
			body: comment,
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
			},
		}
	);
	console.log("res after comment", res);
}
