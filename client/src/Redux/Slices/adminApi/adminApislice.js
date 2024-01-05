import { apiSlice } from '../apiSlice';
const ADMIN_URL = process.env.REACT_APP_ADMIN_URL

const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        adminLogin: builder.mutation({
            query: (data) => ({
                url: `${ADMIN_URL}/login`,
                method: 'POST',
                body: data,
            }),
        }),
        adminLogout: builder.mutation({
            query: () => ({
                url: `${ADMIN_URL}/logout`,
                method: 'POST',
            })
        }),
        getUsers: builder.mutation({
            query: () => ({
                url: `${ADMIN_URL}/getUsers`,
                method: 'GET',
            })
        }),
        blockUser: builder.mutation({
            query: (data) => ({
                url: `${ADMIN_URL}/blockUser`,
                method: 'PUT',
                body: data,
            })
        }),
        getOwners: builder.mutation({
            query: () => ({
                url: `${ADMIN_URL}/getOwners`,
                method: 'GET'
            })
        })
        ,
        blockOwner: builder.mutation({
            query: (data) => ({
                url: `${ADMIN_URL}/blockOwner`,
                method: 'PUT',
                body: data,
            })
        }),
        getKYCs: builder.mutation({
            query: () => ({
                url: `${ADMIN_URL}/getKycs`,
                method: 'GET'
            })
        }),
        approveKyc: builder.mutation({
            query: (data)=>({
                url:`${ADMIN_URL}/approveKyc`,
                method:'PATCH',
                body:data
            })
        }),
        propertyManagement: builder.mutation({
            query:()=>({
                url: `${ADMIN_URL}/getProperties`,
                method: 'GET'
            })
        }),
        propertyApproval: builder.mutation({
            query: ({option,id})=>({
                url: `${ADMIN_URL}/propertyApproval?id=${id}`,
                method: 'PUT',
                body:{option}
            })
        })
    })
})

export const { 
    useAdminLoginMutation, useAdminLogoutMutation, useGetUsersMutation,
    useBlockUserMutation, useBlockOwnerMutation, useGetOwnersMutation,
    useGetKYCsMutation, useApproveKycMutation, usePropertyManagementMutation,
    usePropertyApprovalMutation,
} = adminApiSlice