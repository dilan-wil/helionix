import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Copy } from 'lucide-react'

const referralLevels = [
  { level: 1, count: 5, earnings: 100 },
  { level: 2, count: 3, earnings: 50 },
  { level: 3, count: 1, earnings: 25 },
]

export default function Referral() {
  const referralCode = 'ABC123'

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Referral Program</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <span className="font-mono">{referralCode}</span>
            <Button variant="ghost" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <Button className="w-full">Share Referral Link</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {referralLevels.map((level) => (
              <li key={level.level} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Level {level.level}</p>
                  <p className="text-sm text-gray-500">{level.count} referrals</p>
                </div>
                <span className="font-bold">${level.earnings}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-center">
            ${referralLevels.reduce((sum, level) => sum + level.earnings, 0)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

