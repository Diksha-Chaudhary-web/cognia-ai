import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";

function getCurrentDateContext() {
    const now = new Date();

    return {
        iso: now.toISOString(),
        readable: now.toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZoneName: "short",
        }),
    };
}

function getLastUserMessage(messages) {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
        if (messages[ index ]?.role === "user") {
            return messages[ index ].content || "";
        }
    }

    return "";
}

function isTimeSensitiveQuery(message) {
    return /\b(today|latest|current|now|recent|recently|news|price|score|weather|who is|stock|date|time)\b/i.test(message);
}

const geminiModel = process.env.GEMINI_API_KEY ? new ChatGoogleGenerativeAI({
    model: "gemini-flash-latest",
    apiKey: process.env.GEMINI_API_KEY
}) : null;

const mistralModel = process.env.MISTRAL_API_KEY ? new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: process.env.MISTRAL_API_KEY
}) : null;

const searchInternetTool = tool(
    searchInternet,
    {
        name: "searchInternet",
        description: "Use this tool to get the latest information from the internet.",
        schema: z.object({
            query: z.string().describe("The search query to look up on the internet.")
        })
    }
)

const activeModel = mistralModel || geminiModel;

const agent = activeModel ? createAgent({
    model: activeModel,
    tools: [ searchInternetTool ],
}) : null;

export async function generateResponse(messages) {
    if (!agent) {
        return "AI chat is not configured yet. Add MISTRAL_API_KEY or GEMINI_API_KEY to the backend .env file.";
    }

    const currentDate = getCurrentDateContext();
    const latestUserMessage = getLastUserMessage(messages);
    let internetContext = "";

    if (isTimeSensitiveQuery(latestUserMessage)) {
        const searchResults = await searchInternet({ query: latestUserMessage });
        internetContext = `
            Real-time search results for the user's latest question:
            ${searchResults}
        `;
    }

    const response = await agent.invoke({
        messages: [
            new SystemMessage(`
                You are a helpful and precise assistant for answering questions.
                The current server date/time is ${currentDate.readable} (${currentDate.iso}).
                Never guess relative dates like today, yesterday, tomorrow, latest, or current.
                If the user asks about dates, time, recent facts, current events, prices, scores, weather, or anything time-sensitive, rely on the current date/time and any provided search context instead of model memory.
                If you don't know the answer, say you don't know.
                ${internetContext}
            `),
            ...(messages.map(msg => {
    if (msg.role === "user") {
        return new HumanMessage(msg.content);
    } else if (msg.role === "ai") {
        return new AIMessage(msg.content);
    }
    return null;
}).filter(Boolean)) ]
    });

    const lastMessage = response.messages[ response.messages.length - 1 ];
    return lastMessage?.text || "I could not generate a response right now.";

}

export async function generateChatTitle(message) {
    if (!activeModel) {
        return "New Chat";
    }

    const response = await activeModel.invoke([
        new SystemMessage(`
            You are a helpful assistant that generates concise and descriptive titles for chat conversations.
            
            User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.    
        `),
        new HumanMessage(`
            Generate a title for a chat conversation based on the following first message:
            "${message}"
            `)
    ])

    return response.text?.trim() || "New Chat";

}

