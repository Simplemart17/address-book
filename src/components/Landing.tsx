'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { BackgroundImage } from '@/components/BackgroundImage'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import InputField from './InputField'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import axios from 'axios';

type ResponseData = {
    success: boolean;
    message?: string;
    error?: string;
    user?: {
      email: string;
      user_type: string;
      full_name: string;
      user_id: string;
  },
}

export function Landing(): JSX.Element {
  const [serverError, _setServerError] = useState<string>("");
  const [isUser, setIsUser] = useState<boolean>(true);
  const [userCheck, setUserCheck] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    isValid,
    isSubmitting,
    dirty
  } = useFormik({
    initialValues: {
      email: '',
      fullName: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Enter a valid email address')
      .required('Email cannot be empty'),
      fullName: Yup.string().when(([], schema) => {
        if (!isUser) {
          return schema.min(3, "Enter a minimum of 3 characters").required("Full name is a required field");
        }
        return schema.notRequired();
      }),
    }),
    onSubmit: async values => {
      let resp;
      if (userCheck) {
        const { data } = await axios.post<ResponseData>("/api/users", values);
        resp = data;
      } else {
        const { data } = await axios.get(`/api/users/${values.email}`);
        if (data?.data?.email) {
          setMessage("Please click continue button to proceed!");
          setUserCheck(true);
        } else {
          setUserCheck(true);
          setIsUser(false);
        }
      }
      if (userCheck) {
        console.log("I don't expect it works");
        if (resp?.user?.user_type === "admin") {
          router.push("/admin")
        } else {
          router.push("/contact-lists")
        }
        localStorage.setItem("email", values.email);
      }
    },
  });

  return (
    <div className="relative py-20 sm:pb-24 sm:pt-36">
      <BackgroundImage className="-bottom-14 -top-36" />
      <Container className="relative">
        <p className="text-center text-red-700 font-semibold animate-bounce">{serverError}</p>
        <div className="mx-auto max-w-2xl lg:max-w-4xl lg:px-12">
          <h1 className="font-display text-4xl font-bold tracking-tighter text-blue-600 sm:text-5xl text-center">
            <span className="sr-only">ContactRef - </span>Manage Your Contacts
          </h1>
          <div className="w-1/2 mx-auto">
            <div>
              <div className="mt-6 space-y-1 font-display text-xl tracking-tight text-gray-800">
                <p className="text-center">
                  Enter your details to get started
                </p>
                <p className="text-center text-blue-500 text-sm font-semibold animate-bounce">{message}</p>
                {!isUser && <InputField
                  name={"fullName"}
                  type="text"
                  value={values.fullName}
                  placeholder="Enter your full name"
                  error={!!errors.fullName}
                  errorMessage={errors.fullName}
                  onChange={handleChange}
                />}
                <InputField
                  name={"email"}
                  type="email"
                  value={values.email}
                  placeholder="Enter a valid email address"
                  error={!!errors.email}
                  errorMessage={errors.email}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit"
                className={`mt-10 w-full ${isSubmitting || !(isValid && dirty) || (!isUser && !values.fullName) ? 'cursor-not-allowed bg-gray-400 hover:bg-gray-400' : ''}`}
                onClick={() => handleSubmit()} disabled={isSubmitting || !(isValid && dirty)}>
                {isSubmitting ? "Loading..." : userCheck ? "Continue" : "Submit"}
              </Button>
            </div>
          </div>
          </div>
      </Container>
    </div>
  )
}
