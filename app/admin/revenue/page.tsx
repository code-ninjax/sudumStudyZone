'use client'

import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, Users, CreditCard } from 'lucide-react'
import CountingAnimation from '@/components/CountingAnimation'
import { DashboardSkeleton } from '@/components/SkeletonLoader'

export default function AdminRevenuePage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const stats = [
    { label: 'Total Revenue', value: 45678, prefix: '$', color: 'text-green-500', bgColor: 'bg-green-500/10', icon: DollarSign },
    { label: 'This Month', value: 8950, prefix: '$', color: 'text-blue-500', bgColor: 'bg-blue-500/10', icon: TrendingUp },
    { label: 'Paying Students', value: 892, color: 'text-purple-500', bgColor: 'bg-purple-500/10', icon: Users },
    { label: 'Transactions', value: 1234, color: 'text-orange-500', bgColor: 'bg-orange-500/10', icon: CreditCard },
  ]

  const recentTransactions = [
    { id: 1, student: 'John Doe', matricNumber: 'CSC/2020/001', amount: 50, date: '2024-01-15', status: 'Completed' },
    { id: 2, student: 'Jane Smith', matricNumber: 'CSC/2020/002', amount: 50, date: '2024-01-15', status: 'Completed' },
    { id: 3, student: 'Mike Johnson', matricNumber: 'CSC/2020/003', amount: 50, date: '2024-01-14', status: 'Completed' },
    { id: 4, student: 'Sarah Williams', matricNumber: 'CSC/2020/004', amount: 50, date: '2024-01-14', status: 'Pending' },
    { id: 5, student: 'David Brown', matricNumber: 'CSC/2020/005', amount: 50, date: '2024-01-13', status: 'Completed' },
  ]

  const monthlyRevenue = [
    { month: 'Jan', revenue: 8950 },
    { month: 'Feb', revenue: 7800 },
    { month: 'Mar', revenue: 9200 },
    { month: 'Apr', revenue: 8500 },
    { month: 'May', revenue: 9800 },
    { month: 'Jun', revenue: 10200 },
  ]

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
          Revenue & Payments
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your earnings and payment transactions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6">
            <div className={`inline-flex p-3 rounded-lg ${stat.bgColor} mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-text-light dark:text-text-dark">
              <CountingAnimation end={stat.value} prefix={stat.prefix || ''} />
            </p>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-6">
          Monthly Revenue
        </h2>
        <div className="flex items-end justify-between space-x-4 h-64">
          {monthlyRevenue.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t-lg relative" style={{ height: `${(data.revenue / 12000) * 100}%` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark rounded-t-lg"></div>
              </div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-2">{data.month}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">${data.revenue}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-subtle-dark rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
            Recent Transactions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Matric Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-text-light dark:text-text-dark">{transaction.student}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {transaction.matricNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      ${transaction.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      transaction.status === 'Completed'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
