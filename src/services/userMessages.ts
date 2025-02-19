import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react"
import { RootState } from "../store/store"
import { ApiResponse, Message } from "../types";



const baseUrl = import.meta.env.VITE_SERVER_URL;

export const userMessages = createApi({
    reducerPath: 'userMessages',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        createMessage: builder.mutation<ApiResponse<Message>, Partial<Message>>({
            query: (body) => {
                return {
                    url: "/usermsg/",
                    method: "POST",
                    body
                }
            }
        }),
        getMessages: builder.query<ApiResponse<Message[]>, { sendid: number; revid: number }>({
            query: ({ sendid, revid }) => ({
                url: `/usermsg/${sendid}/${revid}`,
                method: "GET",
            }),
        }),
        
    }),
})



export const { useCreateMessageMutation , useGetMessagesQuery } = userMessages;