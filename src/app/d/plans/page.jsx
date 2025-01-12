'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Check, Loader2 } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogAction, AlertDialogCancel, AlertDialogFooter } from '@/components/ui/alert-dialog'
import { useAuth } from '@/components/context/auth-context'
import { doc, updateDoc, arrayUnion, addDoc, collection, increment } from "firebase/firestore";
import { db } from "@/functions/firebase";
import { useRouter } from "next/navigation";
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

export default function Investments() {
  const [showMyInvestments, setShowMyInvestments] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userPLans, setUserPlans] = useState([]);
  const { userInfo, setUserInfo, setTransactions } = useAuth();
  const router = useRouter()
  const now = new Date();
  const { toast } = useToast()

  useEffect(() => {
    console.log(userInfo)
    if(userInfo?.plans){
      setUserPlans(userInfo?.plans)
    } else {
      setUserPlans([])
    }
  }, [userInfo])

  const handleBuyClick = (plan) => {
    setSelectedPlan(plan);
    setDialogOpen(true);
  };

  const confirmPurchase = async () => {
    console.log(selectedPlan)
    setLoading(true)
    if (!userInfo?.uid || !selectedPlan) return;

    if (userInfo.balance < selectedPlan.prix) {
      toast({
        variant: "destructive",
        title: "Solde Insuffisant.",
        description: "Veuillez Rechargez votre compte pour payer ce plan.",
      })
      router.push("/d/deposit");
      return;
    }

    try {
      const userDocRef = doc(db, "users", userInfo.uid);
      const newBalance = userInfo.balance - selectedPlan.prix;

      const newPlan = {
        id: selectedPlan.id,
        instanceId: uuidv4(),
        name: selectedPlan.name,
        prix: selectedPlan.prix,
        daily: selectedPlan.daily,
        purchaseDate: new Date().toISOString(),
        times: 40,
        lastClicked: now.toISOString(),
        image: selectedPlan.image
      };

      await updateDoc(userDocRef, {
        balance: newBalance,
        plans: arrayUnion(newPlan),
      });

      const transactionsCollectionRef = collection(userDocRef, "transactions");
      const newTransaction = {
        description: `Achat du plan ${selectedPlan.name}`,
        transactionId: selectedPlan.name,
        type: "Achat",
        amount: -selectedPlan.prix,
        charge: 0,
        status: "success",
        method: "system",
        date: new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
      }

      await addDoc(transactionsCollectionRef, newTransaction);

      setUserInfo({ ...userInfo, balance: newBalance, plans: [...(userInfo?.plans || []), newPlan], });
      // Update transactions by appending the new transaction
      setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);

      if (!userInfo.plan) {
        await addReferralBonus(userInfo.referredBy, selectedPlan.prix)
      }

      toast({
        variant: "success",
        title: "Achat Réussi.",
        description: "Votre plan a été ajouté. Rendez-vous dans la section taches pour éfféctuer vos taches.",
      })
    } catch (error) {
      console.error("Error purchasing plan: ", error);

      toast({
        variant: "destructive",
        title: "Erreur.",
        description: "Recommencer s'ils vous plait.",
      })
    } finally {
      setLoading(false)
      setDialogOpen(false);
    }
  };

  const handleTaskClick = async (plan) => {
    if (loading) return;

    const now = new Date();
    const lastClicked = plan.lastClicked ? new Date(plan.lastClicked) : null;

    // Enforce 24-hour cooldown
    if (lastClicked && now.getTime() - lastClicked.getTime() < 24 * 60 * 60 * 1000) {
      const timeLeft = 24 * 60 * 60 * 1000 - (now.getTime() - lastClicked.getTime());
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

      toast({
        variant: "destructive",
        title: "24h.",
        description: `Vous devez attendre encore ${hours} heures et ${minutes} minutes avant de refaire cette tâche.`,
      })
      return;
    }

    // Prevent further clicks if times are exhausted
    if (plan.times <= 0) {
      toast({
        variant: "destructive",
        title: "Plus de taches.",
        description: "Vous avez épuisé le nombre de taches pour ce plan.",
      })
      return;
    }

    setLoading(true);

    try {
      const userDocRef = doc(db, "users", userInfo?.uid);

      // Update the clicked plan
      const updatedPlans = userInfo?.plans.map((p) =>
        p.id === plan.id
          ? {
            ...p,
            times: p.times - 1,
            lastClicked: now.toISOString(),
          }
          : p
      );

      const totalDailyEarnings = userInfo?.plans
        .filter((p) => p.id === plan.id)
        .reduce((sum, p) => sum + (p.times > 0 ? p.daily : 0), 0);

      const newBalance = userInfo?.balance + totalDailyEarnings;

      // Update Firestore with new plans data and balance
      await updateDoc(userDocRef, {
        plans: updatedPlans,
        balance: newBalance,
        earned: increment(totalDailyEarnings)
      });

      const transactionsCollectionRef = collection(userDocRef, "transactions");
      const newTransaction = {
        description: `Gain du plan ${plan.name}`,
        transactionId: plan.name,
        type: "Taches",
        amount: totalDailyEarnings,
        charge: 0,
        status: "success",
        method: "system",
        date: new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
      };

      await addDoc(transactionsCollectionRef, newTransaction);

      // Update local state
      setUserInfo({
        ...userInfo,
        plans: updatedPlans,
        balance: newBalance,
      });
      // Update transactions by appending the new transaction
      setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);

      toast({
        variant: "success",
        title: "Taches éffectué avec succès.",
        description: "Vous avez éffectué votre taches. Vos gains ont été crédités.",
      });
    } catch (error) {
      console.error("Error completing task:", error);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // const handleInvest = (planId) => {
  //   console.log('Invested in plan:', planId)
  //   setActivePlans([...activePlans, planId])
  // }

  return (
    <div className="p-4 space-y-4 pb-20 bg-blue-100">
      <h1 className="text-2xl font-bold text-blue-900">Plans d'Investissement</h1>

      <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow">
        <Switch
          id="show-my-investments"
          checked={showMyInvestments}
          onCheckedChange={setShowMyInvestments}
        />
        <Label htmlFor="show-my-investments" className="text-blue-800 font-medium">
          {showMyInvestments ? 'Mes Plans' : 'Tout les Plans'}
        </Label>
      </div>

      {!showMyInvestments && plans.map((plan) => (
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
            <Button onClick={() => handleBuyClick({ id: plan.id, name: plan.name, prix: plan.prix, daily: plan.daily, image: plan.image })} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white" >
              <TrendingUp className="mr-2 h-4 w-4" /> Acheter {loading && <Loader2 className='animate-spin' />}
            </Button>

          </CardContent>

        </Card>
      ))}

      {showMyInvestments && (
        <Card className="bg-white shadow-lg border-t-4 border-blue-500">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-900">Mes Plans Active</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {userPLans.length > 0 ? (
              <ul className="space-y-2">
                {userPLans.map((plan) => {
                  return (
                    <Card key={plan.instanceId} className="bg-white shadow-lg border-t-4 border-blue-500">
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
                          <span className="text-blue-700">Revenu Restant:</span>
                          <span className="text-blue-900">XAF{plan.daily * plan.times}</span>
                        </div>
                        <Button
                          onClick={() => handleTaskClick({ daily: plan.daily, id: plan.id, image: plan.image, instanceId: plan.instanceId, lastClicked: plan.lastClicked, name: plan.name, prix: plan.prix, purchaseDate: plan.purchaseDate, times: plan.times })} 
                          disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white" >
                          <TrendingUp className="mr-2 h-4 w-4" /> Effectuez la tache {loading && <Loader2 className='animate-spin' />}
                        </Button>

                      </CardContent>

                    </Card>
                  )
                })}
              </ul>
            ) : (
              <p className="text-center text-blue-700">Vous n'avez aucun plan.</p>
            )}
          </CardContent>
        </Card>
      )}
      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <AlertDialogHeader>
            <h2 className="text-lg font-semibold">Confirmer l'Achat</h2>
          </AlertDialogHeader>
          <p className="text-gray-700">Confirmez votre l'achat du plan {selectedPlan?.name}</p>
          <AlertDialogFooter className="mt-4 flex justify-end space-x-2">
            <AlertDialogCancel onClick={() => setDialogOpen(false)} className="text-red-600">Annuler</AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={confirmPurchase} className="bg-blue-600 text-white hover:bg-blue-700">
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

