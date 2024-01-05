import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    ownerInfo: localStorage.getItem('ownerInfo') ? JSON.parse(localStorage.getItem('ownerInfo')) : null
}

const ownerSlice = createSlice({
    name: 'owner',
    initialState,
    reducers: {
        setOwnerCredentials: (state, action) => {
            state.ownerInfo = action.payload;
            localStorage.setItem('ownerInfo', JSON.stringify(action.payload));
        },
        ownerLogout: (state, action) => {
            state.ownerInfo = null,
                localStorage.removeItem('ownerInfo')
        }
    }
})

export const { setOwnerCredentials, ownerLogout } = ownerSlice.actions;

export default ownerSlice.reducer;