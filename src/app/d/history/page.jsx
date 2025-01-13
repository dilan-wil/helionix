"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { DepositWithdrawButtons } from "@/components/DepositWithdrawal";
import { useAuth } from "@/components/context/auth-context";
import { useEffect } from "react";

export default function TransactionHistory() {
  const { transactions } = useAuth();

  useEffect(() => {
    console.log(transactions);
  }, [transactions]);

  const statusColors = {
    success: "bg-green-100 text-green-800",
    redeemed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  };

  // Sort transactions by date (most recent first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="p-4 space-y-6 pb-20 bg-blue-50">
      <h1 className="text-2xl font-bold text-blue-800">
        Historique de transaction
      </h1>

      <DepositWithdrawButtons />

      {/* Legend for color codes */}
      <div className="flex space-x-4">
        <div className="flex items-center">
          <span className="w-4 h-4 bg-green-100 border border-green-800 rounded-full mr-2"></span>
          <span className="text-sm text-blue-800">Succès/Réalisé</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-yellow-100 border border-yellow-800 rounded-full mr-2"></span>
          <span className="text-sm text-blue-800">En Attente</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-red-100 border border-red-800 rounded-full mr-2"></span>
          <span className="text-sm text-blue-800">Échoué</span>
        </div>
      </div>

      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-blue-800">Transaction Récente</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {sortedTransactions.map((transaction) => (
              <li
                key={transaction.id}
                className={`flex justify-between items-center border-b pb-2 ${statusColors[transaction.status]}`}
              >
                <div>
                  <p className="font-medium">{transaction.type}</p>
                  <p className="text-sm">{transaction.date}</p>
                </div>
                <span
                  className={`flex items-center ${
                    transaction.type === "Deposit" ||
                    transaction.type === "Taches" ||
                    transaction.type === "Tâches"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "Deposit" ||
                  transaction.type === "Taches" ||
                  transaction.type === "Tâches" ? (
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
  );
}
