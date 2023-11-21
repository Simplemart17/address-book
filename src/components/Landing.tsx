'use client';

import { BackgroundImage } from '@/components/BackgroundImage'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import InputField from './InputField'
import * as Yup from 'yup'

import { useFormik } from 'formik'

export function Landing(): JSX.Element {
  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    isValid,
    isSubmitting
  } = useFormik({
    initialValues: {
      email: '',
      fullName: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Enter a valid email address').required('Email cannot be empty'),
      fullName: Yup.string().min(3, "Enter minimum of three characters").required('This field is required'),
    }),
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
      console.log(isSubmitting)
    },
  });

  return (
    <div className="relative py-20 sm:pb-24 sm:pt-36">
      <BackgroundImage className="-bottom-14 -top-36" />
      <Container className="relative">
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
                <InputField
                  name={"fullName"}
                  type="text"
                  value={values.fullName}
                  placeholder="Enter your full name"
                  error={!!errors.fullName}
                  errorMessage={errors.fullName}
                  onChange={handleChange}
                />
                <InputField
                  name={"email"}
                  type="email"
                  value={values.email}
                  placeholder="Enter a valid email address"
                  error={!isValid}
                  errorMessage={errors.email}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" className={`mt-10 w-full ${isSubmitting ? 'cursor-not-allowed bg-gray-400 hover:bg-gray-400' : ''}`} onClick={() => handleSubmit()} disabled={isSubmitting}>
                {isSubmitting ? "Loading..." : "Submit"}
              </Button>
            </div>
          </div>
          </div>
      </Container>
    </div>
  )
}
