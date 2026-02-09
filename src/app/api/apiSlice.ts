import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getToken = () => {
  try {
    if (typeof window === 'undefined') return null;
    if (!window.localStorage || typeof window.localStorage.getItem !== 'function') return null;
    return window.localStorage.getItem('token');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Unable to read token from localStorage:', err);
    return null;
  }
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    //https://ugbekunsmp-backend.onrender.com/

    // http://localhost:5001/
    baseUrl: "https://ugbekunsmp-backend.onrender.com/",
    //http://localhost:5001/


  
    credentials: 'include', // Enable cookies to be sent with requests


    prepareHeaders: (headers) => {
      const token = getToken();
      // Only set Authorization header if token exists in localStorage (backward compatibility)
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),

  tagTypes: [
    "CurrentUser",
    "CreateAccount",
    "AllAccounts",
    "Account",
    "AgentSchools",
    "TierOptions",
    "ClassRoom",
    "Objectives",
    "Question",
    "Quiz",
    "AddChild",
    "User",
    "Notification",
    "Chat",
    "YearGroup",
    "Arm",
    "Subject",
    "AgentEarnings",
    "CommissionSettings",
    "AllEarnings",
    "ActiveUsers",
    "SchoolActivity",
    "School",
    "OnboardingStatus",
  ],

  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: 'api/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    getMe: builder.query({
      query: () => 'api/auth/me',
      providesTags: ["CurrentUser"],
    }),

    signup: builder.mutation({
      query: (userData) => ({
        url: 'api/users/signup',
        method: 'POST',
        body: userData,
      }),
    }),

    // Onboarding endpoints
    completeOnboarding: builder.mutation({
      query: (onboardingData) => ({
        url: 'api/onboarding/complete',
        method: 'POST',
        body: onboardingData,
      }),
      invalidatesTags: ["School", "User", "OnboardingStatus"],
    }),

    createSchool: builder.mutation({
      query: (onboardingData) => ({
        url: 'api/onboarding/create-school',
        method: 'POST',
        body: onboardingData,
      }),
      invalidatesTags: ["School", "OnboardingStatus"],
    }),

    getOnboardingStatus: builder.query({
      query: (schoolId) => `api/onboarding/schools/${schoolId}/status`,
      providesTags: ["OnboardingStatus"],
    }),

    createBulkUsers: builder.mutation({
      query: ({ schoolId, users }) => ({
        url: `api/onboarding/schools/${schoolId}/users/bulk`,
        method: 'POST',
        body: { users },
      }),
      invalidatesTags: ["User", "OnboardingStatus"],
    }),

    updateSchoolProfile: builder.mutation({
      query: ({ schoolId, updateData }) => ({
        url: `api/onboarding/schools/${schoolId}/profile`,
        method: 'PATCH',
        body: updateData,
      }),
      invalidatesTags: ["School"],
    }),

    extendTrialPeriod: builder.mutation({
      query: ({ schoolId, additionalDays }) => ({
        url: `api/onboarding/schools/${schoolId}/extend-trial`,
        method: 'POST',
        body: { additionalDays },
      }),
      invalidatesTags: ["School"],
    }),

    getSchoolStatistics: builder.query({
      query: (schoolId) => `api/onboarding/schools/${schoolId}/statistics`,
      providesTags: ["School"],
    }),

    searchSchools: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(item => searchParams.append(key, item));
            } else {
              searchParams.append(key, value.toString());
            }
          }
        });

        return `api/onboarding/schools/search?${searchParams.toString()}`;
      },
      providesTags: ["School"],
    }),

    getAllSchools: builder.query({
      query: () => 'api/onboarding/schools',
      providesTags: ["School"],
    }),

    getRoleStatistics: builder.query({
      query: () => 'api/onboarding/user/role-stats',
      providesTags: ["User"],
    }),

    // School endpoints
    getMySchool: builder.query({
      query: () => 'api/schools/my-school',
      providesTags: ["School"],
    }),

    getDashboardStats: builder.query({
      query: () => 'api/schools/dashboard-stats',
      providesTags: ["School"],
    }),

    getPlatformStats: builder.query({
      query: () => 'api/superadmin/platform-stats',
      providesTags: ["School", "User"],
    }),

    getSuperAdminSchools: builder.query({
      query: () => 'api/superadmin/getschools',
      providesTags: ["School"],
    }),

    // Student endpoints
    getStudents: builder.query({
      query: () => 'api/students',
      providesTags: ["User", "School"],
    }),

    addStudent: builder.mutation({
      query: (studentData) => ({
        url: 'api/students',
        method: 'POST',
        body: studentData,
      }),
      invalidatesTags: ["User", "School"],
    }),

    updateStudent: builder.mutation({
      query: ({ id, ...studentData }) => ({
        url: `api/students/${id}`,
        method: 'PUT',
        body: studentData,
      }),
      invalidatesTags: ["User", "School"],
    }),

    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `api/students/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["User", "School"],
    }),

    // Event endpoints
    getEvents: builder.query({
      query: () => 'api/events',
      providesTags: ["School"],
    }),

    addEvent: builder.mutation({
      query: (eventData) => ({
        url: 'api/events',
        method: 'POST',
        body: eventData,
      }),
      invalidatesTags: ["School"],
    }),

    updateEvent: builder.mutation({
      query: ({ id, ...eventData }) => ({
        url: `api/events/${id}`,
        method: 'PUT',
        body: eventData,
      }),
      invalidatesTags: ["School"],
    }),

    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `api/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["School"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useSignupMutation,
  useCompleteOnboardingMutation,
  useCreateSchoolMutation,
  useGetOnboardingStatusQuery,
  useCreateBulkUsersMutation,
  useUpdateSchoolProfileMutation,
  useExtendTrialPeriodMutation,
  useGetSchoolStatisticsQuery,
  useSearchSchoolsQuery,
  useGetAllSchoolsQuery,
  useGetRoleStatisticsQuery,
  useGetMySchoolQuery,
  useGetDashboardStatsQuery,
  useGetPlatformStatsQuery,
  useGetSuperAdminSchoolsQuery,
  useGetStudentsQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetEventsQuery,
  useAddEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = apiSlice;

export default apiSlice;
