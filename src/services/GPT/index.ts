import { login } from "@/api/auth/auth";
import { fileInfoWithDiff, pull } from "../github";
import { getChatCompletions } from "@/api/chat/chat";

export type reviewReply = {
	file: string;
	reply: string;
};

export async function loginGPT() {
	let token: string = (
		await login(
			{
				username: "azel (tpx1204)",
				password: "13678378564217376451",
			},
			{
				baseURL: "https://openrouter-api.dwarvesf.com/api/v1/",
			}
		)
	).data.data.accessToken;
	return token;
}

/**
 *
 * @param token access token by function loginGPT
 * @param pull pull request by getPullRequest
 * @param files array of files want to review
 *
 * @summary review array of files and return array of review reply by GPT
 */

export async function review(
	token: string,
	pull: pull,
	files: fileInfoWithDiff[]
) {
	let prompt = `this is the change of pull request number ${
		pull.number_pull
	} requested by ${pull.upploader} with title is "${pull.title}" at ${
		pull.updated_at
	}.
  
    Your task is:
    - Review the code changes and provide feedback.
    - If there are any bugs, highlight them.
    - Provide details on missed use of best-practices.
    - Does the code do what it says in the commit messages?
    - Do not highlight minor issues and nitpicks.
    - Use bullet points if you have multiple comments.
    - Provide security recommendations if there are any.
    - Provide line of code when you point out suggestion or mistake.

    ${
			pull.description
				? `Here is some description of changed in pull request: " ${pull.description} ".`
				: ""
		}

    I will provide you the code changes (diffs) in a unified diff format.
  `;
	const reviewReply: reviewReply[] = [];
	for (const file of files) {
		prompt += file.rawString;
		console.log("file", prompt);
		const res = (
			await getChatCompletions(
				{
					model: "openai/gpt-3.5-turbo-16k",
					messages: [
						{
							role: "system",
							content: "you are an experianced software developer",
						},
						{ role: "user", content: prompt },
					],
				},
				{
					authorization: token,
				},
				{
					baseURL: "https://openrouter-api.dwarvesf.com/api/v1/",
				}
			)
		).data.choices[0].message.content;
		reviewReply.push({
			file: file.newFile!,
			reply: res,
		});
	}
	return reviewReply;
}
