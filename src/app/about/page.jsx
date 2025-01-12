"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Wind, Droplet, Leaf, CircleChevronLeft } from 'lucide-react'
import { useRouter } from "next/navigation"

export default function About() {
    const router = useRouter()
  return (
    <div className="p-4 space-y-6 pb-20 bg-blue-50">
      <h1 className="flex gap-5 items-center text-3xl font-bold text-blue-900 text-center">
        <CircleChevronLeft onClick={() => router.back()} />
        À propos de Helionix</h1>
      
      <Card className="bg-white shadow-lg border-t-4 border-blue-500">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800">Notre mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700">
            Chez Helionix, notre mission est de démocratiser l'investissement dans l'énergie renouvelable et de le rendre accessible à tous. 
            Nous croyons que la transition énergétique est l'affaire de tous et que chacun devrait pouvoir y contribuer et en bénéficier. 
            Notre plateforme est conçue pour permettre à chacun de participer à un avenir énergétique durable 
            grâce à des investissements intelligents, éclairés et faciles à gérer dans le secteur des énergies renouvelables.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white shadow-md border-t-4 border-blue-500">
          <CardHeader>
            <CardTitle className="text-xl text-blue-800 flex items-center">
              <Sun className="mr-2 h-6 w-6 text-yellow-500" />
              Énergie solaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700">
              Investissez dans des projets solaires, des panneaux photovoltaïques aux centrales solaires thermiques. 
              Participez à la révolution de l'énergie propre et abondante du soleil.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md border-t-4 border-blue-500">
          <CardHeader>
            <CardTitle className="text-xl text-blue-800 flex items-center">
              <Wind className="mr-2 h-6 w-6 text-blue-600" />
              Énergie éolienne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700">
              Soutenez le développement de parcs éoliens terrestres et offshore. 
              Contribuez à la production d'électricité propre et renouvelable grâce à la puissance du vent.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md border-t-4 border-blue-500">
          <CardHeader>
            <CardTitle className="text-xl text-blue-800 flex items-center">
              <Droplet className="mr-2 h-6 w-6 text-blue-400" />
              Hydroélectricité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700">
              Investissez dans des projets hydroélectriques, des petites centrales aux grands barrages. 
              Participez à la production d'énergie stable et renouvelable à partir de nos ressources en eau.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md border-t-4 border-blue-500">
          <CardHeader>
            <CardTitle className="text-xl text-blue-800 flex items-center">
              <Leaf className="mr-2 h-6 w-6 text-green-500" />
              Innovations vertes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700">
              Découvrez des opportunités dans les technologies émergentes comme le stockage d'énergie, 
              l'hydrogène vert et d'autres innovations prometteuses pour un avenir énergétique durable.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-lg border-t-4 border-blue-500">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800">Notre histoire</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700">
            Fondée en 2025, Helionix est née de la vision d'un groupe d'experts en énergie renouvelable et en technologie financière. 
            Face à l'urgence climatique et au besoin croissant de solutions énergétiques durables, nos fondateurs ont reconnu 
            l'importance de mobiliser les investissements individuels pour accélérer la transition énergétique.
          </p>
          <p className="mt-4 text-blue-700">
            Aujourd'hui, nous sommes fiers de connecter des milliers d'investisseurs à des projets d'énergie renouvelable 
            dans le monde entier, contribuant ainsi à la lutte contre le changement climatique tout en offrant des opportunités 
            de croissance financière. Notre engagement reste inébranlable : fournir une plateforme transparente, accessible et 
            performante pour investir dans un avenir énergétique propre et durable.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}