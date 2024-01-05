import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedUserConversation: null,
    conversations: [],
    selectedOwnerConversation: null,
    ownerConversations: [],
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
    }
})





export const { setSelectedUserConversation, setGlobalConversations, setSelectedOwnerConversation, setGlobalOwnerConversations } = userChatSlice.actions


export default userChatSlice.reducer;