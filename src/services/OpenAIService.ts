import { AIService } from "./AIService";
import { AIServiceError } from "../utils/error";
import { retry, RetryOptions } from "../utils/retry";
import { fetchWithError } from "../utils/fetchWithError";

/**
 * OpenAI response interface.
 */
interface OpenAIResponse {
	choices: {
		message: {
			content: string;
		};
	}[];
}

/**
 * OpenAI service implementation.
 */
export class OpenAIService implements AIService {
	private readonly retryOptions: RetryOptions = {
		maxAttempts: 3,
		delayMs: 1000,
		backoffFactor: 2,
	};

	constructor(private apiKey: string, private model: string) {
		if (!apiKey) {
			throw new Error("OpenAI API key is required");
		}
		if (!model) {
			throw new Error("OpenAI model name is required");
		}
	}

	/**
	 * Analyze content with OpenAI.
	 * @param content - The content to analyze.
	 * @param template - The template to use.
	 * @param style - The style to use.
	 * @returns The analysis result.
	 */
	async analyze(
		content: string,
		template: string,
		style: string
	): Promise<string> {
		return retry(async () => {
			const data = await fetchWithError<OpenAIResponse>({
				url: "https://api.openai.com/v1/chat/completions",
				method: "POST",
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
					"Content-Type": "application/json",
				},
				body: {
					model: this.model,
					messages: [
						{
							role: "system",
							content: `You are an insightful journaling assistant. Provide ${
								style === "direct"
									? "direct and honest"
									: "supportive and gentle"
							} feedback. ${template}`,
						},
						{ role: "user", content },
					],
				},
			});

			const result = data.choices[0]?.message?.content;
			if (!result) {
				throw new AIServiceError(
					"No content in response",
					undefined,
					false
				);
			}
			return result;
		}, this.retryOptions);
	}
}
