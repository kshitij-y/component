"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
} from "@/store/authSlice";
import { useRouter } from "next/navigation";

interface Credentials {
  name?: string;
  email: string;
  password: string;
}

const be_url = "http://localhost:4000";

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signin = async ({ email, password }: Credentials) => {
    try {
      setLoading(true);
      setError(null);
      dispatch(loginStart());

      const res = await axios.post(
        `${be_url}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

      const { success, data, message } = res.data;
      if (!success) throw new Error(message || "Login failed");

      dispatch(loginSuccess(data));
      router.push("/");
    } catch (err: any) {
      dispatch(loginFailure());
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({name, email, password }: Credentials) => {
    try {
      setLoading(true);
      setError(null);
      dispatch(loginStart());

      const res = await axios.post(
        `${be_url}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );

      const { success, data, message } = res.data;
      if (!success) throw new Error(message || "Signup failed");

      dispatch(loginSuccess(data));
      router.push("/dashboard");
    } catch (err: any) {
      dispatch(loginFailure());
      setError(err.response?.data?.message || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const signinWithGoogle = async (idToken: string) => {
    try {
      setLoading(true);
      setError(null);
      dispatch(loginStart());

      const res = await axios.post(
        `${be_url}/api/auth/oauth`,
        { idToken },
        { withCredentials: true }
      );

      const { success, data, message } = res.data;
      if (!success) throw new Error(message || "Google Sign In failed");

      dispatch(loginSuccess(data));
      router.push("/dashboard");
    } catch (err: any) {
      dispatch(loginFailure());
      setError(
        err.response?.data?.message || err.message || "Google Sign In failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const signout = async () => {
    try {
      console.log("reached logout")
      await axios.post(
        `${be_url}/api/auth/signout`,
        { withCredentials: true }
      );
      dispatch(logoutAction());
      router.push("/auth/login");
    } catch (err) {
      console.error("Signout error:", err);
    }
  };

  return {
    loading,
    error,
    signin,
    signup,
    signinWithGoogle,
    signout,
  };
};
