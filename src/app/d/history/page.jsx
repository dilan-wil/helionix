"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { DepositWithdrawButtons } from "@/components/DepositWithdrawal"
import { useAuth } from "@/components/context/auth-context"
import { useEffect } from "react"

// const transactions = [
//   { id: 1, type: 'Deposit', amount: 500, date: '2023-06-01' },
//   { id: 2, type: 'Withdrawal', amount: 200, date: '2023-06-02' },
//   { id: 3, type: 'Deposit', amount: 1000, date: '2023-06-03' },
//   { id: 4, type: 'Withdrawal', amount: 300, date: '2023-06-04' },
// ]

export default function TransactionHistory() {

  const {transactions} = useAuth()

  useEffect(() => {
    console.log(transactions)
  },[transactions])

  return (
    <div className="p-4 space-y-4 pb-20 bg-blue-50">
      <h1 className="text-2xl font-bold text-blue-800">Historique de transaction</h1>
      
      <DepositWithdrawButtons />

      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-blue-800">Transaction Récente</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {transactions.map((transaction) => (
              <li key={transaction.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium text-blue-600">{transaction.type}</p>
                  <p className="text-sm text-blue-400">{transaction.date}</p>
                </div>
                <span className={`flex items-center ${transaction.type === 'Deposit' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'Deposit' ? (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  )}
                  ${transaction.amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

