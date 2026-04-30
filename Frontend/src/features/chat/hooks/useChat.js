import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages } from "../service/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages } from "../chat.slice";
import { useDispatch } from "react-redux";


export const useChat = () => {

    const dispatch = useDispatch()


    async function handleSendMessage({ message, chatId }) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await sendMessage({ message, chatId })
            const { chat, aiMessage } = data
            const resolvedChatId = chatId || chat?._id

            if (!resolvedChatId) {
                throw new Error("Unable to resolve chat id for the message")
            }

            if (!chatId && chat) {
                dispatch(createNewChat({
                    chatId: chat._id,
                    title: chat.title,
                }))
            }
            dispatch(addNewMessage({
                chatId: resolvedChatId,
                content: message,
                role: "user",
            }))
            dispatch(addNewMessage({
                chatId: resolvedChatId,
                content: aiMessage.content,
                role: aiMessage.role,
            }))
            dispatch(setCurrentChatId(resolvedChatId))
            return data
        } catch (err) {
            dispatch(setError(err.response?.data?.message || err.message || "Failed to send message"))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetChats() {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await getChats()
            const { chats } = data
            const formattedChats = chats.reduce((acc, chat) => {
                acc[ chat._id ] = {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                    lastUpdated: chat.updatedAt,
                }
                return acc
            }, {})

            dispatch(setChats(formattedChats))

            const firstChatId = chats[0]?._id || null
            if (firstChatId) {
                dispatch(setCurrentChatId(firstChatId))
            }

            return data
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Failed to fetch chats"))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleOpenChat(chatId, chats) {
        try {
            dispatch(setError(null))
            if (chats[ chatId ]?.messages.length === 0) {
                const data = await getMessages(chatId)
                const { messages } = data

                const formattedMessages = messages.map(msg => ({
                    content: msg.content,
                    role: msg.role,
                }))

                dispatch(addMessages({
                    chatId,
                    messages: formattedMessages,
                }))
            }
            dispatch(setCurrentChatId(chatId))
            return true
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Failed to open chat"))
            return false
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat
    }

}
