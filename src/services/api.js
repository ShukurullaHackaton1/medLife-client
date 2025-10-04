import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://medlife.kerek.uz/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "User",
    "Glucometer",
    "Physical",
    "Medication",
    "Nutrition",
    "Family",
  ],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    getScreeningQuestions: builder.query({
      query: () => "/screening/questions",
    }),
    submitScreening: builder.mutation({
      query: (data) => ({
        url: "/screening/submit",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    scheduleAppointment: builder.mutation({
      query: (data) => ({
        url: "/screening/appointment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    submitVisitResult: builder.mutation({
      query: (data) => ({
        url: "/screening/visit-result",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    addGlucometer: builder.mutation({
      query: (data) => ({
        url: "/glucometer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Glucometer"],
    }),
    getGlucometerStats: builder.query({
      query: ({ period, date }) =>
        `/glucometer/stats?period=${period}&date=${date}`,
      providesTags: ["Glucometer"],
    }),
    deleteGlucometer: builder.mutation({
      query: (id) => ({
        url: `/glucometer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Glucometer"],
    }),
    addPhysicalActivity: builder.mutation({
      query: (data) => ({
        url: "/physical",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Physical"],
    }),
    getPhysicalStats: builder.query({
      query: ({ period, date }) =>
        `/physical/stats?period=${period}&date=${date}`,
      providesTags: ["Physical"],
    }),
    addMedication: builder.mutation({
      query: (data) => ({
        url: "/medication",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Medication"],
    }),
    getMedications: builder.query({
      query: () => "/medication",
      providesTags: ["Medication"],
    }),
    takeMedication: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/medication/${id}/take`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Medication"],
    }),
    updateMedication: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/medication/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Medication"],
    }),
    deleteMedication: builder.mutation({
      query: (id) => ({
        url: `/medication/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Medication"],
    }),
    getMedicationStats: builder.query({
      query: ({ period, date }) =>
        `/medication/stats?period=${period}&date=${date}`,
      providesTags: ["Medication"],
    }),
    analyzeFood: builder.mutation({
      query: (data) => ({
        url: "/nutrition/analyze",
        method: "POST",
        body: data,
      }),
    }),
    saveNutrition: builder.mutation({
      query: (data) => ({
        url: "/nutrition",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Nutrition"],
    }),
    getNutrition: builder.query({
      query: ({ period, date }) => `/nutrition?period=${period}&date=${date}`,
      providesTags: ["Nutrition"],
    }),
    deleteNutrition: builder.mutation({
      query: (id) => ({
        url: `/nutrition/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Nutrition"],
    }),
    chatWithAI: builder.mutation({
      query: (data) => ({
        url: "/chat",
        method: "POST",
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: () => "/users/profile",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getNotifications: builder.query({
      query: () => "/users/notifications",
    }),
    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `/users/notifications/${id}/read`,
        method: "PUT",
      }),
    }),
    getInviteLink: builder.query({
      query: () => "/family/invite",
    }),
    getFamilyMembers: builder.query({
      query: () => "/family/members",
      providesTags: ["Family"],
    }),
    getFamilyMember: builder.query({
      query: (id) => `/family/member/${id}`,
    }),
    getPatientQR: builder.query({
      query: (userId) => `/doctor/patient-qr/${userId}`,
    }),
    getPatientData: builder.query({
      query: (userId) => `/doctor/patient/${userId}`,
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetScreeningQuestionsQuery,
  useSubmitScreeningMutation,
  useScheduleAppointmentMutation,
  useSubmitVisitResultMutation,
  useAddGlucometerMutation,
  useGetGlucometerStatsQuery,
  useDeleteGlucometerMutation,
  useAddPhysicalActivityMutation,
  useGetPhysicalStatsQuery,
  useAddMedicationMutation,
  useGetMedicationsQuery,
  useTakeMedicationMutation,
  useUpdateMedicationMutation,
  useDeleteMedicationMutation,
  useGetMedicationStatsQuery,
  useAnalyzeFoodMutation,
  useSaveNutritionMutation,
  useGetNutritionQuery,
  useDeleteNutritionMutation,
  useChatWithAIMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useGetInviteLinkQuery,
  useGetFamilyMembersQuery,
  useGetFamilyMemberQuery,
  useGetPatientQRQuery,
  useGetPatientDataQuery,
} = api;
