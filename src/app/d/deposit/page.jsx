'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownToLine, ChevronLeftCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/context/auth-context'
import { addDeposit } from '@/functions/add-deposit'
import { useToast } from '@/hooks/use-toast'

const paymentMethods = {
  'orange-money': { name: 'Orange Money', number: '+123 456 7890', account: 'test' },
  'mtn-money': { name: 'MTN Money', number: '+234 567 8901', account: 'test' },
  'crypto': { name: 'Crypto', address: '0x1234...5678' },
}

export default function Deposit() {
  const {user} = useAuth()
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const router = useRouter()
  const {toast} = useToast()

  const handleAddMoney = async (e) => {
    e.preventDefault();
    if (!user) {
      return false;
    }
    try {
      setLoading(true);
      const added = await addDeposit({
        userUid: user.uid,
        amount: amount,
        transactionId: transactionId,
        gateway: paymentMethods[paymentMethod].name,
      });
      console.log(added);
      toast({
        variant: "success",
        title: "En attente d'approbation.",
        description:
          "Votre demande de dépôt est en attente d'approbation. Un administrateur se chargera de l'accepter.",
      });
    } catch (error) {
      if (error.message === "This deposit request has already been processed.") {
        // Specific toast for duplicate transaction error
        toast({
          variant: "destructive",
          title: "Erreur de transaction",
          description: "Cette demande de dépôt a déjà été traitée.",
        });
      } else {
        // Generic toast for other errors
        toast({
          variant: "destructive",
          title: "Erreur",
          description:
            "Rassurez-vous que vous avez entré le bon montant et la bonne clé de transaction.",
        });
      }
    } finally {
      setLoading(false);
      setTransactionId("");
      setAmount("");
      setPaymentMethod("");
    }
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      <h1 onClick={() => router.back()} className="flex gap-5 items-center text-2xl font-bold"><ChevronLeftCircle /> Dépot</h1>

      <Card>
        <CardHeader>
          <CardTitle>Faire un dépot</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddMoney} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700">
                Methode
              </label>
              <Select onValueChange={setPaymentMethod}>
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="orange-money">Orange Money</SelectItem>
                  <SelectItem value="mtn-money">MTN Money</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod && (
              <div className="bg-blue-50 p-3 rounded-md text-sm">
                <p>Effectuez une transaction au :</p>
                <p>Numero: {paymentMethods[paymentMethod].number}</p>
                <p>Nom du compte: {paymentMethods[paymentMethod].account}</p>
                <p className="font-bold">
                  Une fois le dépot effectué, veuillez entrez le montant et l'ID de transaction, et vos fonds vous seront crédités dans les 5 minutes.
                </p>
              </div>
            )}

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
              <label htmlFor="transaction-id" className="block text-sm font-medium text-gray-700">
                ID de transaction
              </label>
              <Input
                type="text"
                id="transaction-id"
                placeholder="Enter transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
                readOnly={loading}
              />
            </div>

            <Button disabled={loading} type="submit" className="w-full bg-blue-600">
              <ArrowDownToLine className="mr-2 h-4 w-4" /> Envoyer {loading && <Loader2 className='animate-spin' />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

