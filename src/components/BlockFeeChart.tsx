'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
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

interface BlockFeeChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blocks: any[]
}

export default function BlockFeeChart({ blocks }: BlockFeeChartProps) {
  const [data, setData] = useState<{ blockNumber: number; baseFee: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function prepareData() {
      setIsLoading(true)
      setError(null)

      try {
        const feeData = blocks.map((block) => ({
          blockNumber: block.number,
          baseFee: parseFloat(block.baseFeePerGas) / 1e9, // Convert wei to Gwei
        }))

        setData(feeData)
      } catch (err) {
        console.error('Failed to prepare baseFee data:', err)
        setError('Failed to load base fee data. Please try again later.')
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
        <CardTitle className="text-lg font-semibold">Base Fee Per Gas (Gwei)</CardTitle>
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
          <div className="text-gray-400 text-center mt-10">No base fee data available.</div>
        )}

        {!isLoading && !error && hasData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="blockNumber" stroke="#fff" />
                <YAxis stroke="#fff" unit=" Gwei" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#fff' }}
                  labelStyle={{ color: '#a1a1aa' }}
                />
                <Line
                  type="monotone"
                  dataKey="baseFee"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
