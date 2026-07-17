import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  color?: string
}

const StatCard = React.memo(function StatCard({
  title,
  value,
  subtitle,
  color = 'text-slate-900'
}: StatCardProps) {
  console.log(`StatCard "${title}" rendered`) // remove after profiling
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
})

export default StatCard