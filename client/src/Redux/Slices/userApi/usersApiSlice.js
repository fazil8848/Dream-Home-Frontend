import { apiSlice } from "../apiSlice";
const USERS_URL = process.env.REACT_APP_USERS_URL;

export const usersApiSclice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/loginUser`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/registerUser`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logOutUser`,
        method: "POST",
      }),
    }),
    verifyUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/verifyUser/${id}`,
        method: "PUT",
      }),
    }),
    getPropertiesuser: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/getPropertiesuser`,
        method: "GET",
      }),
    }),
    getSingleProperty: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/getSingleProperty?id=${id}`,
        method: "GET",
      }),
    }),
    getUserInfo: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/getUserInfo?id=${id}`,
        method: "GET",
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `${USERS_URL}/profile?id=${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    checkPass: builder.mutation({
      query: ({ id, data }) => ({
        url: `${USERS_URL}/checkPass?id=${id}`,
        method: "POST",
        body: data,
      }),
    }),
    updatePass: builder.mutation({
      query: ({ id, data }) => ({
        url: `${USERS_URL}/updatePass?id=${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    bookProperty: builder.mutation({
      query: ({ bookingInfo }) => ({
        url: `${USERS_URL}/bookProperty`,
        method: "POST",
        body: bookingInfo,
      }),
    }),
    getConversations: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/getConversations?userId=${id}`,
        method: "GET",
      }),
    }),
    getMessages: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/getConversationMessages`,
        method: "POST",
        body: data,
      }),
    }),
    sendMessage: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/sendMessage`,
        method: "POST",
        body: data,
      }),
    }),
    getClickedOwner: builder.mutation({
      query: ({ ownerId }) => ({
        url: `${USERS_URL}/getClickedOwner/${ownerId}`,
        method: "GET",
      }),
    }),
    getBookedDetails: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/getBookedDetails`,
        method: "POST",
        body: data,
      }),
    }),
    updateMessageStatusUser: builder.mutation({
      query: (messageId) => ({
        url: `${USERS_URL}/updateMessageStatus/${messageId}`,
        method: "PATCH",
      }),
    }),
    addReview: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/addReview`,
        method: "POST",
        body: data,
      }),
    }),
    getReviews: builder.mutation({
      query: ({ propertyId }) => ({
        url: `${USERS_URL}/getReviews/${propertyId}`,
        method: "GET",
      }),
    }),
    propertyIncluded: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/propertyIncluded`,
        method: "POST",
        body: data,
      }),
    }),
    getReservations: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/getReservations/${userId}`,
        method: "GET",
      }),
    }),
    cancelReservation: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/cancelReservation`,
        method: "POST",
        body: data,
      }),
    }),
    getBookings: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/getBookings/${userId}`,
        method: "GET",
      }),
    }),
    editReview: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/editReview`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteReview: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/deleteReview`,
        method: "DELETE",
        body: data,
      }),
    }),
    googleRegister: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/googleRegister`,
        method: "POST",
        body: data,
      }),
    }),
    addNotification: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/addNotification`,
        method: "POST",
        body: data,
      }),
    }),
    getNotifications: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/getNotifications/${id}`,
        method: `GET`,
      }),
    }),
    markNotificationAsRead: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/markNotificationAsRead`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useVerifyUserMutation,
  useGetPropertiesuserMutation,
  useGetSinglePropertyMutation,
  useGetUserInfoMutation,
  useUpdateUserMutation,
  useCheckPassMutation,
  useUpdatePassMutation,
  useBookPropertyMutation,
  useGetConversationsMutation,
  useGetMessagesMutation,
  useSendMessageMutation,
  useGetClickedOwnerMutation,
  useGetBookedDetailsMutation,
  useUpdateMessageStatusUserMutation,
  useAddReviewMutation,
  useGetReviewsMutation,
  usePropertyIncludedMutation,
  useGetReservationsMutation,
  useCancelReservationMutation,
  useGetBookingsMutation,
  useEditReviewMutation,
  useDeleteReviewMutation,
  useGoogleRegisterMutation,
  useAddNotificationMutation,
  useGetNotificationsMutation,
  useMarkNotificationAsReadMutation,
} = usersApiSclice;
