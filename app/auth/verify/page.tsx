'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, XCircle, Mail, ArrowRight } from 'lucide-react'
import Card from '@/components/Card'
import { supabase } from '@/packages/supabase/src/client'

export default function VerifyEmailPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [verifying, setVerifying] = useState(true)
    const [verified, setVerified] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Supabase automatically handles email verification via the Auth callback
        // We just need to check the session
        const checkVerification = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()

                if (sessionError) {
                    setError(sessionError.message)
                    setVerifying(false)
                    return
                }

                if (session) {
                    setVerified(true)
                    setVerifying(false)
                    // Auto-redirect to dashboard after 3 seconds
                    setTimeout(() => {
                        router.push('/student')
                    }, 3000)
                } else {
                    setError('Verification link may be invalid or expired')
                    setVerifying(false)
                }
            } catch (err: any) {
                setError(err.message || 'An error occurred during verification')
                setVerifying(false)
            }
        }

        checkVerification()
    }, [router])

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white dark:from-background-dark dark:via-emerald-950/20 dark:to-background-dark flex items-center justify-center py-12 px-4">
            <div className="max-w-2xl w-full">
                <Card className="text-center animate-fade-in">
                    <div className="py-12 px-6">
                        {verifying ? (
                            <>
                                {/* Loading State */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-24 h-24 border-4 border-primary-light dark:border-primary-dark border-t-transparent rounded-full animate-spin"></div>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-3">
                                    Verifying Your Email...
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400">
                                    Please wait while we confirm your email address
                                </p>
                            </>
                        ) : verified ? (
                            <>
                                {/* Success State */}
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-full flex items-center justify-center animate-scale-in shadow-lg">
                                            <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={2.5} />
                                        </div>
                                        <div className="absolute inset-0 w-24 h-24 bg-green-500/30 dark:bg-green-600/30 rounded-full animate-ping" />
                                    </div>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-3">
                                    Email Verified! ✅
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                    Your email has been successfully verified. You're all set!
                                </p>

                                {/* Success Card */}
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 mb-8 max-w-lg mx-auto">
                                    <div className="flex justify-center mb-4">
                                        <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md">
                                            <Mail className="w-8 h-8 text-primary-light dark:text-primary-dark" />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg text-text-light dark:text-text-dark mb-3">
                                        What's Next?
                                    </h3>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                                        You'll be automatically redirected to your dashboard in a few seconds. You can now access all features and start your learning journey!
                                    </p>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Redirecting in 3 seconds...
                                    </div>
                                </div>

                                {/* Manual Navigation */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <Link
                                        href="/student"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg font-medium hover:opacity-90 transition-opacity duration-200"
                                    >
                                        Go to Dashboard Now
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Error State */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-full flex items-center justify-center shadow-lg">
                                        <XCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
                                    </div>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-3">
                                    Verification Failed
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                    {error || 'We could not verify your email address'}
                                </p>

                                {/* Error Card */}
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8 max-w-lg mx-auto">
                                    <h3 className="font-bold text-lg text-text-light dark:text-text-dark mb-3">
                                        Possible Reasons
                                    </h3>
                                    <ul className="text-left text-sm text-gray-700 dark:text-gray-300 space-y-2">
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>The verification link may have expired</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>The link may have already been used</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>The link may be invalid or corrupted</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Actions */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        Please try signing up again or contact support if the issue persists.
                                    </p>
                                    <Link
                                        href="/auth/signup"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg font-medium hover:opacity-90 transition-opacity duration-200"
                                    >
                                        Sign Up Again
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}
