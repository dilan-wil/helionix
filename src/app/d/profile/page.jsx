"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, LogOut, Info } from 'lucide-react'
import { DepositWithdrawButtons } from "@/components/DepositWithdrawal"
import { useAuth } from "@/components/context/auth-context"
import { auth } from "@/functions/firebase";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation"
import { useToast } from '@/hooks/use-toast'
import Link from "next/link"


export default function Profile() {
  const {userInfo} = useAuth()
  const router = useRouter()
  const {toast} = useToast()

  const handleLogout = async () => {
    console.log("User logged out");
    await signOut(auth)
    router.push('/login')
    // Add your logout logic here (e.g., Firebase logout, redirect, etc.)
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, userInfo.email);
      toast({ variant: "success", title: "Email envoyé", description: "Vérifiez votre boîte mail pour réinitialiser le mot de passe." });
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast({ variant: "destructive", title: "Erreur", description: "Impossible d'envoyer l'email de réinitialisation." });
    }
  }

  return (
    <div className="p-4 space-y-4 pb-20 bg-blue-100">
      <h1 className="text-2xl font-bold text-blue-900">Profile</h1>
      
      <Card className="bg-white shadow-lg border-t-4 border-blue-500">
        <CardHeader>
          <CardTitle className="text-blue-900">Recapitulatif</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-blue-700">Solde:</span>
            <span className="font-bold text-blue-900">XAF{userInfo?.balance ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Total Déposé:</span>
            <span className="text-green-600">XAF{userInfo?.deposits ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Total Retiré:</span>
            <span className="text-red-600">XAF{userInfo?.withdrawals ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Gains d'affiliation:</span>
            <span className="text-green-600">XAF{userInfo?.referralEarnings ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Nombre de plans:</span>
            <span className="font-bold text-blue-900">{userInfo?.plans?.length ?? 0}</span>
          </div>
        </CardContent>
      </Card>

      <DepositWithdrawButtons />

      <Card className="bg-white shadow-md border-t-4 border-blue-500">
        <CardHeader>
          <CardTitle className="text-blue-900">Informations Personelle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-700" />
            <span className="text-blue-900">{userInfo?.name}</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-blue-700" />
            <span className="text-blue-900">{userInfo?.email}</span>
          </div>
          {/* <div className="flex items-center">
            <Phone className="h-5 w-5 mr-2 text-blue-700" />
            <span className="text-blue-900">+1 234 567 8900</span>
          </div> */}
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md border-t-4 border-blue-500">
        <CardContent className="pt-6">
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/about">
              <Info className="mr-2 h-4 w-4" /> A propos de nous
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md border-t-4 border-blue-500">
        <CardHeader>
          <CardTitle className="text-blue-900">Paramètres du compte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleResetPassword} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Changer le mot de passe</Button>
          {/* <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Update Profile</Button> */}
          <Button onClick={handleLogout} variant="destructive" className="w-full">
            <LogOut className="mr-2 h-4 w-4" /> Se déconnecter
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

