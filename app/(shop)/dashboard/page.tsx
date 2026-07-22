import type { Metadata } from 'next'
import DashboardClient from './dashboardClient'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Real-time sales and inventory overview',
}

// Server Component — no 'use client' here
export default function DashboardPage() {
  return <DashboardClient/>
}