import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedUserConversation: {},
    conversations: [],
    selectedOwnerConversation: null,
    ownerConversations: [],
    userOnline: null,
    ownerOnline: null,
}

const userChatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setSelectedUserConversation: (state, action) => {
            state.selectedUserConversation = action.payload;
            localStorage.setItem('selectedUserConversation', JSON.stringify(action.payload));
        },
        setGlobalUserConversations: (state, action) => {
            state.conversations = action.payload;
            localStorage.setItem('conversations', JSON.stringify(action.payload));
        },
        setSelectedOwnerConversation: (state, action) => {
            state.selectedOwnerConversation = action.payload;
            localStorage.setItem('selectedOwnerConversation', JSON.stringify(action.payload));
        },
        setGlobalOwnerConversations: (state, action) => {
            state.ownerConversations = action.payload;
            localStorage.setItem('ownerConversations', JSON.stringify(action.payload));
        },
        setUserOnline: (state, action) => {
            state.userOnline = action.payload;
            localStorage.setItem('userOnline', JSON.stringify(action.payload));
        },
        setOwnerOnline: (state, action) => {
            state.ownerOnline = action.payload;
            localStorage.setItem('ownerOnline', JSON.stringify(action.payload));
        },
        setUserOffline: (state, action) => {
            state.userOnline = null;
            localStorage.removeItem('userOnline')
        },
        setOwnerOffline: (state, action) => {
            state.ownerOnline = null;
            localStorage.removeItem('ownerOnline')
        },

    }
})





export const { setSelectedUserConversation, setGlobalUserConversations, setSelectedOwnerConversation, setGlobalOwnerConversations, setUserOnline, setOwnerOnline, setOwnerOffline, setUserOffline } = userChatSlice.actions


export default userChatSlice.reducer;