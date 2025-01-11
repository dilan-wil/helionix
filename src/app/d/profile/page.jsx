import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, LogOut } from 'lucide-react'
import { DepositWithdrawButtons } from "@/components/DepositWithdrawal"

const accountSummary = {
  currentBalance: 15000,
  totalDeposited: 20000,
  totalWithdrawn: 5000,
  referralEarnings: 500,
  activePlans: 2,
}

export default function Profile() {
  return (
    <div className="p-4 space-y-4 pb-20 bg-blue-100">
      <h1 className="text-2xl font-bold text-blue-900">Profile</h1>
      
      <Card className="bg-white shadow-lg border-t-4 border-blue-500">
        <CardHeader>
          <CardTitle className="text-blue-900">Account Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-blue-700">Current Balance:</span>
            <span className="font-bold text-blue-900">${accountSummary.currentBalance.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Total Deposited:</span>
            <span className="text-green-600">${accountSummary.totalDeposited.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Total Withdrawn:</span>
            <span className="text-red-600">${accountSummary.totalWithdrawn.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Referral Earnings:</span>
            <span className="text-green-600">${accountSummary.referralEarnings.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Active Plans:</span>
            <span className="font-bold text-blue-900">{accountSummary.activePlans}</span>
          </div>
        </CardContent>
      </Card>

      <DepositWithdrawButtons />

      <Card className="bg-white shadow-md border-t-4 border-blue-500">
        <CardHeader>
          <CardTitle className="text-blue-900">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-700" />
            <span className="text-blue-900">John Doe</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-blue-700" />
            <span className="text-blue-900">johndoe@example.com</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-2 text-blue-700" />
            <span className="text-blue-900">+1 234 567 8900</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md border-t-4 border-blue-500">
        <CardHeader>
          <CardTitle className="text-blue-900">Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Change Password</Button>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Update Profile</Button>
          <Button variant="destructive" className="w-full">
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

