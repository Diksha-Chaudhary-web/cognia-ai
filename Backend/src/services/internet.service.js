import { tavily as Tavily } from "@tavily/core"

const tavily = process.env.TAVILY_API_KEY ? Tavily({
    apiKey: process.env.TAVILY_API_KEY,
}) : null;


export const searchInternet = async ({ query }) => {
    if (!tavily) {
        return "Internet search is unavailable because TAVILY_API_KEY is not configured.";
    }

    const results = await tavily.search(query, {
        maxResults: 5,
    })

    return results.results?.map((result) => result.content).join("\n\n") || "No internet results found.";
}
