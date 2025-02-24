'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { getERC20TransferVolume } from '@/lib/fetchBlocks'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Block } from 'alchemy-sdk'

interface TokenVolumeChartProps {
  blocks: any[]
  tokenAddress: string
}

export default function TokenVolumeChart({ blocks, tokenAddress }: TokenVolumeChartProps) {
  const [data, setData] = useState<{ blockNumber: number; volume: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVolumeData() {
      setIsLoading(true)
      setError(null)

      try {
        const volumeData = await Promise.all(
          blocks.map(async (block:Block) => ({
            blockNumber: block.number,
            volume: await getERC20TransferVolume(block, tokenAddress),
          }))
        )

        setData(volumeData)
      } catch (err) {
        console.error('Failed to fetch token volume data:', err)
        setError('Failed to load token volume data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    if (blocks.length > 0 && tokenAddress) {
      fetchVolumeData()
    }
  }, [blocks, tokenAddress])

  const hasData = data.length > 0 && data.some((d) => d.volume > 0)

  return (
    <Card className="bg-gray-900 text-white shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">ERC20 Token Transfer Volume</CardTitle>
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
          <div className="text-gray-400 text-center mt-10">No transfer data available for the latest blocks.</div>
        )}

        {!isLoading && !error && hasData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="blockNumber" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
                <Bar dataKey="volume" fill="#6366F1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
