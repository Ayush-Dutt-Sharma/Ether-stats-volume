'use client'

import { useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface GasUsageChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blocks: any[]
}

export default function GasUsageChart({ blocks }: GasUsageChartProps) {
  const [data, setData] = useState<{ blockNumber: number; gasUsagePercentage: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function prepareData() {
      setIsLoading(true)
      setError(null)

      try {
        const usageData = blocks.map((block) => ({
          blockNumber: block.number,
          gasUsagePercentage:
            (parseFloat(block.gasUsed) / parseFloat(block.gasLimit)) * 100,
        }))

        setData(usageData)
      } catch (err) {
        console.error('Failed to prepare gas usage data:', err)
        setError('Failed to load gas usage data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    if (blocks.length > 0) {
      prepareData()
    }
  }, [blocks])

  const hasData = data.length > 0

  return (
    <Card className="bg-gray-900 text-white shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Gas Usage Percentage</CardTitle>
      </CardHeader>

      <CardContent className="h-72 relative">
        {isLoading && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-8 w-full rounded" />
            <Skeleton className="h-8 w-full rounded" />
            <Skeleton className="h-8 w-full rounded" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 text-red-500">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {!isLoading && !error && !hasData && (
          <div className="text-gray-400 text-center mt-10">No gas usage data available.</div>
        )}

        {!isLoading && !error && hasData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="blockNumber" stroke="#fff" />
                <YAxis stroke="#fff" unit="%" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#fff' }}
                  labelStyle={{ color: '#a1a1aa' }}
                />
                <Area
                  type="monotone"
                  dataKey="gasUsagePercentage"
                  stroke="#f97316"
                  fillOpacity={0.2}
                  fill="#f97316"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
