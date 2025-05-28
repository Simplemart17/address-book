'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { BackgroundImage } from '@/components/BackgroundImage'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Layout } from '@/components/Layout'


interface VerificationState {
  loading: boolean
  message: string
  messageType: 'success' | 'error' | 'info' | 'loading'
  isVerified: boolean
  userExists: boolean
}

export default function VerifyPage(): JSX.Element {
  const searchParams = useSearchParams()
  const [state, setState] = useState<VerificationState>({
    loading: true,
    message: '',
    messageType: 'loading',
    isVerified: false,
    userExists: false
  })

  useEffect(() => {
    const verifyUser = async () => {
      const verificationId = searchParams?.get('verificationId')

      if (!verificationId) {
        setState({
          loading: false,
          message: 'Invalid verification link. No verification ID found.',
          messageType: 'error',
          isVerified: false,
          userExists: false
        })
        return
      }

      try {
        // Call the verification endpoint
        const response = await fetch(`/api/v3/verify/${verificationId}`)
        const result = await response.json()

        if (!result.success) {
          setState({
            loading: false,
            message: result.message || 'Invalid verification link. User not found.',
            messageType: 'error',
            isVerified: false,
            userExists: false
          })
          return
        }

        const { alreadyVerified } = result.data

        if (alreadyVerified) {
          setState({
            loading: false,
            message: 'Your email is already verified! You can now log in to your account.',
            messageType: 'info',
            isVerified: true,
            userExists: true
          })
        } else {
          setState({
            loading: false,
            message: '🎉 Email verified successfully! Welcome to Address Book. You can now log in to your account.',
            messageType: 'success',
            isVerified: true,
            userExists: true
          })
        }

      } catch (error) {
        console.error('Verification error:', error)
        setState({
          loading: false,
          message: 'Something went wrong during verification. Please try again later.',
          messageType: 'error',
          isVerified: false,
          userExists: false
        })
      }
    }

    verifyUser()
  }, [searchParams])

  const getMessageStyles = () => {
    switch (state.messageType) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'loading':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getIconColor = () => {
    switch (state.messageType) {
      case 'success':
        return 'text-green-400'
      case 'error':
        return 'text-red-400'
      case 'info':
        return 'text-blue-400'
      case 'loading':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <Layout showFooter={false}>
      <div className="relative flex h-full items-center py-20 sm:py-36">
        <BackgroundImage className="-top-36 bottom-0" />
        <Container className="relative flex w-full flex-col items-center">
          <div className="w-full max-w-md">
            {/* Loading State */}
            {state.loading && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Verifying your email...</span>
                </div>
              </div>
            )}

            {/* Message Display */}
            {!state.loading && state.message && (
              <div className={`mb-6 rounded-lg border p-4 ${getMessageStyles()}`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {state.messageType === 'success' && (
                      <svg className={`h-5 w-5 ${getIconColor()}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {state.messageType === 'error' && (
                      <svg className={`h-5 w-5 ${getIconColor()}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    {state.messageType === 'info' && (
                      <svg className={`h-5 w-5 ${getIconColor()}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{state.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            {!state.loading && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                {state.messageType === 'success' && (
                  <>
                    <div className="text-center mb-6">
                      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Email Verified Successfully!
                      </h1>
                      <p className="text-gray-600">
                        Welcome to Address Book! Your account is now active and ready to use.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Button href="/" className="w-full">
                        Continue to Login
                      </Button>
                    </div>
                  </>
                )}

                {state.messageType === 'info' && state.isVerified && (
                  <>
                    <div className="text-center mb-6">
                      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                        <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Already Verified
                      </h1>
                      <p className="text-gray-600">
                        Your email is already verified. You can log in to your account anytime.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Button href="/" className="w-full">
                        Go to Login Page
                      </Button>
                    </div>
                  </>
                )}

                {state.messageType === 'error' && (
                  <>
                    <div className="text-center mb-6">
                      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                        <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Verification Failed
                      </h1>
                      <p className="text-gray-600">
                        We couldn&apos;t verify your email. This could be due to an invalid or expired link.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Button href="/" className="w-full">
                        Go to Login Page
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </Container>
      </div>
    </Layout>
  )
}
