import React from "react"
import { Suspense } from 'react'

export const metadata = {
  title: 'LinguaAI - Authentication',
  description: 'Sign in or create an account to start translating',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Suspense fallback={null}>{children}</Suspense>
}
