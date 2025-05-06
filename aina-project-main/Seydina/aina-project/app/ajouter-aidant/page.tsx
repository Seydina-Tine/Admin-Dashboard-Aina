"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function AjouterAidant() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    mail: "",
    tele: "",
    motpasse: "",
    confirmMotpasse: "",
    isFirstlogin: true
  })

  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const form = new FormData()
    for (const key in formData) {
      form.append(key, formData[key as keyof typeof formData])
    }
    form.append("id_role", "2") // Proche Aidant
    form.append("photo", "") // vide pour l’instant

    try {
      const res = await fetch("http://localhost:9001/auth/register", {
        method: "POST",
        body: form
      })

      if (!res.ok) {
        const text = await res.text()
        setError("Erreur: " + text)
        return
      }

      router.push("/")
    } catch (err) {
      setError("Erreur réseau ou serveur.")
      console.error(err)
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Ajouter une personne proche aidante</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Nom</Label>
          <Input name="nom" value={formData.nom} onChange={handleChange} required />
        </div>
        <div>
          <Label>Prénom</Label>
          <Input name="prenom" value={formData.prenom} onChange={handleChange} required />
        </div>
        <div>
          <Label>Email</Label>
          <Input name="mail" type="email" value={formData.mail} onChange={handleChange} required />
        </div>
        <div>
          <Label>Téléphone</Label>
          <Input name="tele" value={formData.tele} onChange={handleChange} required />
        </div>
        <div>
          <Label>Mot de passe</Label>
          <Input name="motpasse" type="password" value={formData.motpasse} onChange={handleChange} required />
        </div>
        <div>
          <Label>Confirmation mot de passe</Label>
          <Input name="confirmMotpasse" type="password" value={formData.confirmMotpasse} onChange={handleChange} required />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <Button type="submit">Créer le compte aidant</Button>
      </form>
    </div>
  )
}
