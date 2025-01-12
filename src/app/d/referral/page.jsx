"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Copy } from "lucide-react";
import { useAuth } from "@/components/context/auth-context";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const referralLevels = [
  { level: 1, count: 5, earnings: 100 },
  { level: 2, count: 3, earnings: 50 },
  { level: 3, count: 1, earnings: 25 },
];

export default function Referral() {
  const { userInfo } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState("");

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
    <div className="p-4 space-y-4">
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

      <Card>
        <CardHeader>
          <CardTitle>Gains d'affiliation</CardTitle>
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
            ${userInfo?.referralEarnings}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
