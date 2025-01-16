'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpFromLine, ChevronLeftCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/context/auth-context'
import { useToast } from '@/hooks/use-toast'
import { askWithdrawal } from '@/functions/ask-withdrawals'

export default function Withdrawal() {
  const { user, userInfo, setUserInfo, setTransactions } = useAuth()
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [number, setNumber] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const {toast} = useToast()

  const handleWithdrawal = async (e) => {
    e.preventDefault()
    if (!user) {
      return false
    }
    const now = new Date();
    const currentHour = now.getUTCHours() + 1; // Adjust to GMT+1
    const currentMinutes = now.getUTCMinutes();
    console.log({amount, paymentMethod, number, name})

    if (!amount || !paymentMethod || !number || !name) {
      toast({
        variant: "destructive",
        title: "Formulaire imcomplet",
        description: "Veuillez remplir tout les champs.",
      })
      return;
    }

    // Check if the time is outside 9 AM to 7 PM
    if (currentHour < 9 || (currentHour === 20 && currentMinutes > 0) || currentHour > 20) {
      toast({
        variant: "destructive",
        title: "Heure de Retrait.",
        description: "Les demandes de dépot se font exclusvivement entre 9h et 20h.",
      })
      return false;
    }

    try {
      setLoading(true);
      const asked = await askWithdrawal(user.uid, paymentMethod, amount, number, name, userInfo, setUserInfo, setTransactions);
      console.log(asked);
      toast({
        variant: "success",
        title: "Demande de retrait réussi.",
        description: "Votre requete a été envoyée. Vous recevrez vos fonds dans un délai de 24h.",
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Amount must be greater than 1000.") {
        toast({
          variant: "destructive",
          title: "Erreur de retrait.",
          description: "Le montant minimum de retrait est de 1000.",
        });
      } else if (error instanceof Error && error.message === "You need a plan") {
        toast({
          variant: "destructive",
          title: "Aucun plan détecté.",
          description: "Vous devez acheter un plan pour pouvoir faire un retrait.",
        });
      }
      else {
        toast({
          variant: "destructive",
          title: "Erreur de retrait.",
          description: "Rassurez-vous d'avoir les fonds nécessaires et d'entrer les bonnes informations.",
        });
      }
    } finally {
      setLoading(false);
      setAmount("");
      setPaymentMethod("");
      setNumber("");
      setName("")
    }
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      <h1 className="flex gap-5 items-center text-2xl font-bold"><ChevronLeftCircle /> Withdrawal</h1>

      <Card>
        <CardHeader>
          <CardTitle>Request a Withdrawal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleWithdrawal} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700">
                Méthode
              </label>
              <Select onValueChange={(value) => setPaymentMethod(value)}>
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="orange-money">Orange Money</SelectItem>
                  <SelectItem value="mtn-money">MTN Money</SelectItem>
                  <SelectItem value="crypto">crypto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Montant
              </label>
              <Input
                type="number"
                id="amount"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                readOnly={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                {paymentMethod === 'crypto' ? 'USDT TRC20 Wallet Address' : 'Numero de Téléphone'}
              </label>
              <Input
                type="text"
                id="number"
                placeholder={paymentMethod === 'crypto' ? 'Enter wallet address' : 'Enter phone number'}
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                readOnly={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom du compte
              </label>
              <Input
                type="text"
                id="name"
                placeholder="Enter account name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                readOnly={loading}
              />
            </div>

            <Button disabled={loading} type="submit" className="w-full bg-blue-600">
              <ArrowUpFromLine className="mr-2 h-4 w-4" /> Withdraw {loading && <Loader2 className='animate-spin' />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

