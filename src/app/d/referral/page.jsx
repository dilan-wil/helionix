"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Copy, Layers } from "lucide-react";
import { useAuth } from "@/components/context/auth-context";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { listenToSubCollection } from "../../../functions/get-a-sub-collection";

const referralLevels = [
  { level: 1, count: 5, earnings: 100 },
  { level: 2, count: 3, earnings: 50 },
  { level: 3, count: 1, earnings: 25 },
];

export default function Referral() {
  const { userInfo, user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState("");
  const [referrals, setReferrals] = useState([])

  useEffect(() => {
    if (userInfo?.uid) {
      setReferralLink(`https://helionix.vercel.app/register?code=${userInfo?.uid}`);
    }
  }, [userInfo]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy the referral link: ", err);
    }
  };

  const shareLink = async () => {
    try {
      await navigator.share({
        title: "Invite to Bitcoin Works",
        url: referralLink,
      });
    } catch (err) {
      console.error("Failed to share the referral link: ", err);
    }
  };


  useEffect(() => {
    if (!user) {
      console.error("User is not authenticated")
      return
    }

    const unsubscribe = listenToSubCollection("users", user.uid, "referrals", setReferrals);

    // Cleanup listener on component unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };

  }, [user, setReferrals])

  useEffect(() => {
    console.log(referrals)
  }, [user, referrals])


  if (!userInfo) {
    return (
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">
          <Skeleton width={200} />
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton width={150} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton height={20} />
              <Skeleton height={40} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton width={150} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton height={100} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton width={150} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton height={50} width={100} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-20 p-4 space-y-4">
      <h1 className="text-2xl font-bold">Programme d'affiliation</h1>

      <Card>
        <CardHeader>
          <CardTitle>Votre lien d'affiliation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <span className="font-mono truncate max-w-xs" title={referralLink}>
              {referralLink}
            </span>
            <Button variant="ghost" size="sm" onClick={copyLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          {copied && (
            <div className="text-sm text-green-600">Lien copié dans le presse-papiers!</div>
          )}
          <Button onClick={shareLink} className="bg-blue-600 w-full">
            Partager votre lien
          </Button>
        </CardContent>
      </Card>

      {/* New Special Reward Card */}
      <Card>
        <CardHeader>
          <CardTitle>Récompense spéciale</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700">
            Invitez <span className="font-bold">10 personnes</span> à investir un montant minimum
            de <span className="font-bold">20 000 XAF</span> chacune, et recevez une
            <span className="font-bold"> récompense de 50 000 XAF</span> !
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Partagez votre lien d'affiliation et commencez à inviter dès maintenant.
            C'est simple et rapide !
          </p>
          <Button onClick={shareLink} className="mt-4 bg-blue-600 w-full">
            Partager le lien d'invitation
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg border-t-4 border-blue-500">
        <CardHeader>
          <CardTitle className="text-xl text-blue-800">Niveaux de Parrainage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Layers className="h-5 w-5 mr-2 text-blue-600" />
                <span className="font-semibold text-blue-800">Niveau 1</span>
              </div>
              <span className="text-green-600 font-bold">20%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Layers className="h-5 w-5 mr-2 text-blue-500" />
                <span className="font-semibold text-blue-700">Niveau 2</span>
              </div>
              <span className="text-green-600 font-bold">3%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Layers className="h-5 w-5 mr-2 text-blue-400" />
                <span className="font-semibold text-blue-600">Niveau 3</span>
              </div>
              <span className="text-green-600 font-bold">1%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card >
        <CardHeader >
          <CardTitle>Total Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-center">
            XAF{userInfo?.referralEarnings}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-blue-800">Vos Parrainages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {referrals.map((referral) => (
              <Card key={referral.id} className="bg-blue-50 shadow-md">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center text-blue-800">
                    <User className="h-5 w-5 mr-2" />
                    <span className="font-semibold">{referral.name}</span>
                  </div>
                  {/* <div className="text-blue-600 text-sm">{referral.email}</div>
                  <div className="flex items-center text-green-600">
                    <DollarSign className="h-5 w-5 mr-1" />
                    <span className="font-semibold">{referral.earnings.toFixed(2)} €</span>
                  </div>
                  <div className="text-blue-500 text-sm">Rejoint le : {referral.date}</div> */}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
