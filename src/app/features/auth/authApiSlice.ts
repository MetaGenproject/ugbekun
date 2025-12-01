
import { apiSlice } from '../api/apiSlice';
import { setCredentials } from './authSlice';

export interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    role: string;
    email: string;
  };
  error?: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    signup: builder.mutation<any, any>({
      query: (userData) => ({
        url: '/users/signup',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApiSlice;
