"use client";

import React, { useState , useEffect, use } from 'react';
import { BackgroundImage } from './BackgroundImage'
import { Button } from './Button'
import { Container } from './Container'
import InputField from './InputField'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Notification from './modals/NotificationModal';
import { usersApi } from '@/config/v3Api.config';
import { normalizeEmail, validateEmail } from '@/utils/email';

export interface NotificationProps {
  status: boolean;
  message: string;
}

export default function LandingV3(): JSX.Element {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationProps>({ status: false, message: "" });
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const { signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem('email');
    const userTpe = localStorage.getItem('userType');

    if (email && userTpe === "admin") {
      router.push("/admin");
    } else if (email) {
      router.push("/contact-lists");
    }
  }, [router]);

  const {
    values,
    handleChange,
    handleSubmit,
    isSubmitting,
    errors,
    resetForm
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
      fullName: "",
      code: ""
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: isLogin ? Yup.string() : Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      fullName: isLogin ? Yup.string() : Yup.string().min(2, 'Full name must be at least 2 characters').required('Full name is required'),
      code: Yup.string()
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        // Validate email before processing
        const emailValidation = validateEmail(values.email);
        if (!emailValidation.isValid) {
          setNotification({ status: false, message: emailValidation.message || "Invalid email" });
          setOpenModal(true);
          return;
        }

        // Normalize email for consistent processing
        const normalizedEmail = normalizeEmail(values.email);

        if (isLogin) {
          // Login flow
          if (!values.password) {
            // Just check if user exists
            setNotification({ status: true, message: "Account found, enter your password" });
            setOpenModal(true);
            return;
          }

          const result = await signIn(normalizedEmail, values.password);

          if (result.userId) {
            setNotification({ status: true, message: "Login successful!" });
            setOpenModal(true);
            localStorage.setItem("email", normalizedEmail);
            if (result.user_type === 'admin') {
              router.push("/admin");
            } else {
              router.push("/contact-lists");
            }
            resetForm();
          }
        } else {
          // Registration flow
          const result = await usersApi.create({
            email: normalizedEmail,
            password: values.password,
            fullName: values.fullName
          });
          if (result.success) {
            setNotification({
              status: true,
              message: "Account created successfully! Please check your email for verification."
            });

            setOpenModal(true);
            resetForm();
          }
        }
      } catch (error: any) {
        let errorMessage = "Something went wrong!";

        // Handle different types of errors
        if (error?.message) {
          if (error.message.includes('Account not verified')) {
            errorMessage = "Account not verified! Please check your email and verify your account before logging in.";
          } else if (error.message.includes('Invalid login credentials')) {
            errorMessage = "Email/password not correct";
          } else if (error.message.includes('Email not confirmed')) {
            errorMessage = "Account not verified! Please check your email and verify your account.";
          } else if (error.message.includes('User already registered')) {
            errorMessage = "Email already exists";
          } else if (error.message.includes('Email aliases with +')) {
            errorMessage = "Email aliases with + are not allowed. Please use your main email address.";
          } else {
            errorMessage = error.message;
          }
        } else if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        setNotification({ status: false, message: errorMessage });
        setOpenModal(true);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="relative py-10">
      <BackgroundImage className="-bottom-14 -top-36" />
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:max-w-4xl lg:px-12">
          <h1 className="font-display text-center text-4xl font-bold tracking-tighter text-blue-600 sm:text-5xl">
            <span className="sr-only">Address Book - </span>
            Your Personal Contact Manager
          </h1>
            <p className="mt-2 text-center space-y-6 font-display text-xl tracking-tight text-blue-900">
              Keep all your important contacts organized and easily accessible.
            </p>

          <div className="mt-10 flex flex-col items-center gap-y-6">
            <div className="w-full max-w-md">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-center mb-6">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isLogin
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsLogin(false)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        !isLogin
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Register
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <InputField
                      name="fullName"
                      type="text"
                      value={values.fullName}
                      error={!!errors.fullName}
                      errorMessage={errors.fullName as string}
                      label="Full Name*"
                      placeholder="Enter your full name"
                      onChange={handleChange}
                    />
                  )}

                  <InputField
                    name="email"
                    type="email"
                    value={values.email}
                    error={!!errors.email}
                    errorMessage={errors.email as string}
                    label="Email Address*"
                    placeholder="Enter your email"
                    onChange={handleChange}
                  />

                  <InputField
                    name="password"
                    type="password"
                    value={values.password}
                    error={!!errors.password}
                    errorMessage={errors.password as string}
                    label={isLogin ? "Password" : "Password*"}
                    placeholder={isLogin ? "Enter password (optional for account check)" : "Enter your password"}
                    onChange={handleChange}
                  />

                  <Button
                    type="submit"
                    className={`w-full ${loading || isSubmitting ? 'cursor-not-allowed bg-gray-400 hover:bg-gray-400' : ''}`}
                    disabled={loading || isSubmitting}
                  >
                    {loading || isSubmitting
                      ? (isLogin ? "Signing in..." : "Creating account...")
                      : (isLogin ? "Sign In" : "Create Account")
                    }
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Notification
        show={openModal}
        setShow={setOpenModal}
        status={notification.status}
        message={notification.message}
      />
    </div>
  )
}
