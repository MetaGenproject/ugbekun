import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { history } from "./path-to-your-history"; // Adjust the path to your history setup

const getToken = () => {
  try {
    if (typeof window === 'undefined') return null;
    if (!window.localStorage || typeof window.localStorage.getItem !== 'function') return null;
    return window.localStorage.getItem('Token');
  } catch (err) {
    // Don't throw during server rendering — just return null if localStorage isn't usable
    // and log a warning for debugging.
    // eslint-disable-next-line no-console
    console.warn('Unable to read Token from localStorage:', err);
    return null;
  }
};

const baseQuery = fetchBaseQuery({
  baseUrl: "https://ugbekunsmp-backend.onrender.com/",
  
  prepareHeaders: async (headers) => {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  },
});

const baseQueryWithRedirect = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  console.log({ result });
  console.log({ extraOptions });
  if (result?.error?.status === 401) {
    const { navigate } = extraOptions; // Get the navigate function
    if (navigate) {
      console.log("navigate");
      navigate("/");
    }
  }

  return result;
};

export default baseQueryWithRedirect;

