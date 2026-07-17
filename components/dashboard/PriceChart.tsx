import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd']

interface PriceChartProps {
  data: { range: string; count: number }[]
}

const PriceChart = React.memo(function PriceChart({ data }: PriceChartProps) {
  console.log('PriceChart rendered') // remove after profiling
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Price Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="range"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ range, percent }) =>
                `${range} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})

export default PriceChart