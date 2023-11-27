'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { BackgroundImage } from '@/components/BackgroundImage'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import InputField from './InputField'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import Link from 'next/link';
import FormModal from './modals/FormModal';
import { v2Api } from '@/config/axiosInstance';
import Notification from './modals/NotificationModal';

interface ResponseData {
    success: boolean;
    message?: string;
    error?: string;
    email: string;
    user_type: string;
    full_name: string;
    user_id: string;
    verified: boolean;
}

export type NotificationProps = {
  status: boolean;
  message: string;
}

export function Landing(): JSX.Element {
  const [serverError, setServerError] = useState<string>("");
  const [isUser, setIsUser] = useState<boolean>(true);
  const [userCheck, setUserCheck] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationProps>({status: false, message: ""});
  const [openVerified, setOpenVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem('email');

    if (email) {
      router.push("/contact-lists");
    }
  }, [router]);

  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    isValid,
    isSubmitting,
    dirty,
    resetForm
  } = useFormik({
    initialValues: {
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      code: ''
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
      password: Yup.string().matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
        'password must be at least 8 characters, at least one lower case letter, capital letter, number, and special character',
      ).required('Password cannot be empty'),
      confirmPassword: Yup.string().when(([], schema) => {
        if (!isUser) {
          return schema.test('equal', 'Passwords do not match!', function (v) {
            const ref = Yup.ref('password');
            return v === this.resolve(ref);
          })
          .required('This field is required')
        }
        return schema.notRequired();
      }),
      code: Yup.string().when(([], schema) => {
        if (openVerified) {
          return schema.matches(/^[0-9]{6}$/, "Enter only 6 digits number").required("This is a required field");
        }
        return schema.notRequired();
      }),
    }),
    onSubmit: async values => {
      try {
        if (userCheck) {
          const { data } = await v2Api.post<ResponseData>("/api/v2/users", values);
          if (data.success) {
            setNotification({status: data.success, message: data.message as string});
            setOpenModal(true);
            setOpenVerified(true);
          } else {
            setNotification({status: data.success, message: data.message as string});
            setOpenModal(true);
          }
        } else {
          const { data } = await v2Api.post<ResponseData>("/api/v2/users/login", values);

          if (data?.success) {
            if (data?.user_type === "admin") {
              localStorage.setItem("email", values.email);
              router.push("/admin");
            } else if (data?.user_type === "user" && data?.verified) {
              localStorage.setItem("email", values.email);
              router.push("/contact-lists");
            } else {
              setOpenVerified(true);
            }
          } else {
            if (data.message?.includes("Account not found")) {
              setUserCheck(true);
              setIsUser(false);
              setNotification({status: data.success, message: data.message});
              setOpenModal(true);
            } else {
              setNotification({status: data.success, message: data.message as string});
              setOpenModal(true);
            }
          }
        }
      } catch (error) {
        setNotification({status: false, message: "Something went wrong!"});
        setOpenModal(true);
      }
    },

    
  });

  const accountVerification = async () => {
    setLoading(true);
    const { data } = await v2Api.post("/api/v2/users/verify", {email: values.email, code: values.code});

    if (!data.success) {
      setOpenVerified(false);
      setNotification({status: data.success, message: data.message as string});
      setOpenModal(true);

      return;
    }
    setNotification({status: data.success, message: "Verified successfully! Please login"});

    localStorage.setItem("email", values.email);
    router.push("/contact-lists");
    setOpenModal(true);
    setOpenVerified(false);
    setLoading(false);
    resetForm();
  }

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
                {!isUser && <InputField
                  name={"fullName"}
                  type="text"
                  value={values.fullName}
                  placeholder="Enter your full name"
                  error={!!errors.fullName}
                  errorMessage={errors.fullName}
                  onChange={handleChange}
                  label="Full Name*"
                />}
                <InputField
                  name={"email"}
                  type="email"
                  value={values.email}
                  placeholder="Enter a valid email address"
                  error={!!errors.email}
                  errorMessage={errors.email}
                  onChange={handleChange}
                  label="Email Address*"
                />
                <InputField
                  name={"password"}
                  type="password"
                  value={values.password}
                  placeholder="Enter your password"
                  error={!!errors.password}
                  errorMessage={errors.password}
                  onChange={handleChange}
                  label="Password*"
                />
                {!isUser && <InputField
                  name={"confirmPassword"}
                  type="password"
                  value={values.confirmPassword}
                  placeholder="Re-enter your password"
                  error={!!errors.confirmPassword}
                  errorMessage={errors.confirmPassword}
                  onChange={handleChange}
                  label="Confirm Password*"
                />}
              </div>
              <div className="mt-1 text-sm">
                <span>If you have a verification code?</span>
                <Link
                  href="#"
                  className="ml-1 hover:underline hover:font-semibold text-blue-500"
                  onClick={() => setOpenVerified(!openVerified)}
                >
                Click here!
                </Link>
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
      <FormModal
        open={openVerified}
        setOpen={() => setOpenVerified(!openVerified)}
        title="Account Verification"
        primaryBtn={loading ? "Submitting" : "Submit"}
        onClickPrimaryBtn={accountVerification}
        loading={loading}
        disabled ={!(values.email && values.code)}
      >
        <div className="text-left">
          {/* <p className="mt-5 text-red-600 text-md text-bold animate-bounce text-center">{notification.message}</p> */}
          <InputField
            name={"email"}
            type="email"
            value={values.email}
            placeholder="Enter your email address"
            error={!!errors.email}
            errorMessage={errors.email}
            onChange={handleChange}
            label="Email Address*"
          />
          <InputField
            name={"code"}
            type="text"
            value={values.code}
            placeholder="Enter verification code"
            error={!!errors.code}
            errorMessage={errors.code}
            onChange={handleChange}
            label="Account verification code"
          />
        </div>
      </FormModal>
      <Notification
        show={openModal}
        setShow={setOpenModal}
        status={notification.status}
        message={notification.message}
      />
    </div>
  )
}
