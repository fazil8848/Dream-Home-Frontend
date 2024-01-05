import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    adminInfo: localStorage.getItem('adminInfo') ? JSON.parse(localStorage.getItem('adminInfo')) : null
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setAdminCredentials: (state, action) => {
            state.adminInfo = action.payload;
            localStorage.setItem('adminInfo', JSON.stringify(action.payload));
        },
        adminLogout: (state, action) => {
            state.adminInfo = null;
            localStorage.removeItem('adminInfo')
        }
    }
})



export const { setAdminCredentials, adminLogout } = adminSlice.actions

export default adminSlice.reducer;