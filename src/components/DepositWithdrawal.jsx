import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'

export function DepositWithdrawButtons() {
  return (
    <div className="flex gap-4 mt-4">
      <Button asChild className="flex-1 bg-green-500 hover:bg-green-600">
        <Link href="/d/deposit">
          <ArrowDownToLine className="mr-2 h-4 w-4" /> Dépot
        </Link>
      </Button>
      <Button asChild className="flex-1 bg-red-500 hover:bg-red-600">
        <Link href="/d/withdrawal">
          <ArrowUpFromLine className="mr-2 h-4 w-4" /> Retrait
        </Link>
      </Button>
    </div>
  )
}