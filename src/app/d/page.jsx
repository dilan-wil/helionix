"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp } from "lucide-react";
import { DepositWithdrawButtons } from "@/components/DepositWithdrawal";
import { useAuth } from "@/components/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogAction, AlertDialogCancel, AlertDialogFooter } from '@/components/ui/alert-dialog'
import { Label } from "@/components/ui/label"
import { doc, updateDoc, arrayUnion, addDoc, collection, increment } from "firebase/firestore";
import { db } from "@/functions/firebase";
import { v4 as uuidv4 } from "uuid"; // Import if using the uuid library
import { useToast } from '@/hooks/use-toast'
import addReferralBonus from '@/functions/add-referral-bonus'


const plans = [
  { id: 1, name: 'Helionix Nova', prix: 3000, duree: 40, daily: 600, image: 'https://img.freepik.com/free-vector/electrical-windmill-generators-sunset_1182-1351.jpg?t=st=1736603222~exp=1736606822~hmac=f6803e8862fe30116ca88e02ed6a5477bf573b5a4689c00c09fde0ec212c8395&w=740' },
  { id: 2, name: 'Helionix Zenith', prix: 7000, duree: 40, daily: 1400, image: 'https://img.freepik.com/free-photo/front-view-wind-turbines-with-copy-space_23-2148895360.jpg?t=st=1736604445~exp=1736608045~hmac=0070bd961716e84436d5a47176f78f923a8191412374de100afb774357c42631&w=1060' },
  { id: 3, name: 'Helionix Aurora', prix: 15000, duree: 40, daily: 3000, image: 'https://img.freepik.com/free-photo/wind-turbine-trophy-victory-tranquil-scene-beauty-nature_1134-1341.jpg?t=st=1736604468~exp=1736608068~hmac=6ec14411e5c2915c8d60361aff0deadc3b48b3d17d15948f5adcd01937350710&w=900' },
  { id: 4, name: 'Helionix Velocity', prix: 20000, duree: 40, daily: 4000, image: 'https://img.freepik.com/free-photo/windmills_1048-4499.jpg?t=st=1736604493~exp=1736608093~hmac=2afa6752969152a802e0385a007aef38ec2426e6a3ca87d9808f847c8163153e&w=826' },
  { id: 5, name: 'Helionix Horizon', prix: 50000, duree: 40, daily: 10000, image: 'https://img.freepik.com/free-photo/side-view-wind-turbine-silhouette-generating-electricity_23-2148895390.jpg?t=st=1736604505~exp=1736608105~hmac=5b4dd863d47ea4c630793d36f8b800e56df093ec76a2bae71769f0e02acb7711&w=900' },
  { id: 6, name: 'Helionix Catalyst', prix: 100000, duree: 40, daily: 20000, image: 'https://img.freepik.com/free-photo/medium-shot-smiley-engineer-holding-tablet_23-2149354001.jpg?t=st=1736604526~exp=1736608126~hmac=6f12f15ae0e7d775eed39ecec3fc362365ce65d95a9bb99ae08b8dd01ba9ce18&w=900' },
  { id: 7, name: 'Helionix Orbit', prix: 250000, duree: 40, daily: 50000, image: 'https://img.freepik.com/free-photo/wind-turbines-field_329181-1638.jpg?t=st=1736604550~exp=1736608150~hmac=413fb62c739d63d296292e65a44117524f78783bc7c550639d3977229d5b8b47&w=900' },
  { id: 8, name: 'Helionix Pulsar', prix: 250000, duree: 40, daily: 100000, image: 'https://img.freepik.com/free-photo/wind-fans-with-cloudless-day_1160-406.jpg?t=st=1736604592~exp=1736608192~hmac=72b67ffddf1cfc411458b8c6eecd5815b412331eb26b2107e649e7c529d29f27&w=996' },
]

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { userInfo, setUserInfo, setTransactions } = useAuth();
  const router = useRouter()
  const now = new Date();
  const { toast } = useToast()

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);


  // Render skeleton while userInfo is null
  if (!userInfo) {
    return (
      <div className="p-4 space-y-4 pb-20 bg-blue-50">
        <h1 className="text-2xl font-bold text-blue-800">Dashboard</h1>

        <Card className="bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="w-24 h-5" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="w-32 h-6 mb-2" />
            <Skeleton className="w-20 h-4" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="w-28 h-5" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="w-24 h-6" />
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="w-28 h-5" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="w-24 h-6" />
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-md">
          <CardHeader>
            <Skeleton className="w-40 h-5" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <li key={i} className="flex justify-between items-center">
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-16 h-4" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20 bg-blue-50">
      <h1 className="text-2xl font-bold text-blue-800">Accueil</h1>

      <Card className="bg-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-600">
            Current Balance
          </CardTitle>
          <Wallet className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-800">
            {userInfo.balance ?? 0}
          </div>
        </CardContent>
      </Card>
      <DepositWithdrawButtons />

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">
              Total Investi
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-800">XAF{userInfo.deposits ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">
              Total Gagné
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">XAF{userInfo.earned ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-blue-800">Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span className="text-blue-600">Nombre de plans</span>
              <span className="font-bold text-blue-800">{userInfo.plans === null ? 0 : userInfo.plans.length}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-blue-600">Referral Earnings</span>
              <span className="font-bold text-green-600">XAF{userInfo.referralEarnings}</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-blue-800">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span className="text-blue-600">Deposit</span>
              <span className="text-green-600 flex items-center">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                XAF500.00
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-blue-600">Withdrawal</span>
              <span className="text-red-600 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                XAF200.00
              </span>
            </li>
          </ul>
        </CardContent>
      </Card> */}

      <h1 className="text-2xl font-bold text-blue-800">Nos Plans</h1>

      {plans.map((plan) => (
        <Card key={plan.id} className="bg-white shadow-lg border-t-4 border-blue-500">
          <CardHeader
            style={{
              background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2)), url(${plan.image}) center/cover no-repeat`,
              height: "150px", // Optional: Define a fixed height for consistent visuals
              borderRadius: "8px 8px 0 0", // Optional: Smooth corners at the top
            }}
          >
            <CardTitle className="flex items-center gap-2 text-white">
              {plan.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex justify-between">
              <span className="text-blue-700">Prix:</span>
              <span className="font-bold text-blue-900">{plan.prix}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Durée:</span>
              <span className="text-blue-900">{plan.duree} J</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Revenu Quotidien:</span>
              <span className="text-blue-900">XAF{plan.daily}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Revenu Total:</span>
              <span className="text-blue-900">XAF{plan.daily * plan.duree}</span>
            </div>
            <Button onClick={() => router.push("/d/plans")} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white" >
              <TrendingUp className="mr-2 h-4 w-4" /> Acheter {loading && <Loader2 className='animate-spin' />}
            </Button>

          </CardContent>

        </Card>
      ))}
    </div>
  );
}
