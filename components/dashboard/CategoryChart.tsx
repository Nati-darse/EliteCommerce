import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CategoryChartProps {
  data: { name: string; count: number }[]
}

// React Query gives new reference only when data actually changed
const CategoryChart = React.memo(function CategoryChart({ data }: CategoryChartProps) {
  console.log('CategoryChart rendered') // remove after profiling
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Products by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})

export default CategoryChart