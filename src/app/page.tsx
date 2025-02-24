'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchLatestBlocks } from '@/lib/fetchBlocks'
import TokenVolumeChart from '@/components/TokenVolumeChart'
import BlockFeeChart from '@/components/BlockFeeChart'
import GasUsageChart from '@/components/GasUsageChart'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle, RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blocks, setBlocks] = useState<any[]>([])

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['blocks'],
    queryFn: fetchLatestBlocks,
    refetchInterval: 12000, // Auto refresh every 12s
  })

  useEffect(() => {
    if (data) {
      setBlocks(data)
    }
  }, [data])

  useEffect(() => {
    if (error) {
      toast.error('Failed to load blocks. Please try again later.', {
        description: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }, [error])

  return (
    <div className="p-6 bg-gradient-to-br from-gray-950 to-gray-900 min-h-screen text-white">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">📊 Real-Time Blockchain Dashboard</h1>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2 text-white border-gray-700 bg-gray-800 hover:bg-gray-700"
        >
          <RefreshCcw className={`w-5 h-5 ${isFetching && 'animate-spin'}`} />
          {isFetching ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-[70vh] items-center justify-center">
          <Spinner className="h-12 w-12 text-gray-300" />
        </div>
      ) : error ? (
        <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-red-400">
          <AlertCircle className="w-10 h-10" />
          <p className="text-lg">Failed to load blockchain data.</p>
          <Button variant="outline" onClick={() => refetch()} className="bg-red-800 hover:bg-red-700">
            Try Again
          </Button>
        </div>
      ) : blocks.length === 0 ? (
        <div className="flex h-[70vh] items-center justify-center text-gray-400">
          <p>No blockchain data available.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid gap-6"
        >
          <TokenVolumeChart blocks={blocks} tokenAddress={process.env.NEXT_PUBLIC_TOKEN_ADDRESS!} />
          <BlockFeeChart blocks={blocks} />
          <GasUsageChart blocks={blocks} />
        </motion.div>
      )}
    </div>
  )
}
