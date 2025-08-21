"use client"

import { useState, useEffect } from "react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type Patient = {
  iduser: number
  nom: string
  prenom: string
  approle: {
    id_role: number
    nomrole: string
  }
}

type RendezVous = {
  id?: number
  beneficiaireId?: number
  aidantId?: number
  date: string
  motif: string
  statut: "à venir" | "terminé" | "annulé"
}

export default function RendezVousPage() {
  const [beneficiaires, setBeneficiaires] = useState<Patient[]>([])
  const [aidants, setAidants] = useState<Patient[]>([])
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([])
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<RendezVous | null>(null)

  const [form, setForm] = useState<RendezVous>({
    beneficiaireId: 0,
    aidantId: 0,
    date: "",
    motif: "",
    statut: "à venir"
  })

useEffect(() => {
  fetch("http://localhost:9001/auth/users")
    .then((res) => res.json())
    .then((data) => {
      const ben = Array.isArray(data)
        ? data.filter((u: any) => u.approle?.nomrole === "Bénéficiaire")
        : [];
      const aid = Array.isArray(data)
        ? data.filter((u: any) => u.approle?.nomrole === "Proche Aidant")
        : [];
      setBeneficiaires(ben);
      setAidants(aid);
    });

  fetch("http://localhost:9001/api/rendezvous")
    .then((res) => res.json())
    .then((data) =>
      Array.isArray(data)
        ? setRendezVous(data)
        : console.error("Mauvais format RDV", data)
    );
}, []);


  const openModal = (rdv?: RendezVous) => {
    setEditing(rdv ?? null)
    setForm(rdv ?? {
      beneficiaireId: 0,
      aidantId: 0,
      date: "",
      motif: "",
      statut: "à venir"
    })
    setIsOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: name.includes("Id") ? parseInt(value) : value })
  }

const handleSubmit = async () => {
  try {
    const res = await fetch("http://localhost:9001/api/rendezvous", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: form.date,
        motif: form.motif,
        statut: form.statut,
        beneficiaireId: form.beneficiaireId,
        prestataireId: 1 // remplace ce chiffre dynamiquement plus tard si besoin
      })
    });

    const saved = await res.json();
    setRendezVous((prev) => [...prev, saved]);
    setIsOpen(false);
  } catch (err) {
    console.error("Erreur enregistrement RDV", err);
  }
};


  const getNom = (id: number, liste: Patient[]) => {
    const p = liste.find((p) => p.iduser === id)
    return p ? `${p.prenom} ${p.nom}` : "Inconnu"
  }

  const filteredRdv = rendezVous.filter((r) => {
    const nom = getNom(r.beneficiaireId ?? r.aidantId ?? 0, [...beneficiaires, ...aidants])
    return (
      nom.toLowerCase().includes(search.toLowerCase()) ||
      r.motif.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rendez-vous</h1>
        <Button onClick={() => openModal()}>Ajouter</Button>
      </div>

      <Input
        placeholder="Rechercher par nom ou motif"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bénéficiaire / Aidant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRdv.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    {getNom(r.beneficiaireId ?? r.aidantId ?? 0, [...beneficiaires, ...aidants])}
                  </TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.motif}</TableCell>
                  <TableCell>{r.statut}</TableCell>
                </TableRow>
              ))}
              {filteredRdv.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Aucun rendez-vous trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier" : "Nouveau"} rendez-vous</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="beneficiaireId">Bénéficiaire</Label>
              <select
                id="beneficiaireId"
                name="beneficiaireId"
                title="Choisir un bénéficiaire"
                value={form.beneficiaireId}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              >
                <option value={0}>-- Sélectionner --</option>
                {beneficiaires.map((p) => (
                  <option key={p.iduser} value={p.iduser}>
                    {p.prenom} {p.nom}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="aidantId">Proche Aidant</Label>
              <select
                id="aidantId"
                name="aidantId"
                title="Choisir un proche aidant"
                value={form.aidantId}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              >
                <option value={0}>-- Sélectionner --</option>
                {aidants.map((p) => (
                  <option key={p.iduser} value={p.iduser}>
                    {p.prenom} {p.nom}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="date">Date et heure</Label>
              <Input
                id="date"
                type="datetime-local"
                name="date"
                value={form.date}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="motif">Motif</Label>
              <Input
                id="motif"
                name="motif"
                value={form.motif}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="statut">Statut</Label>
              <select
                id="statut"
                name="statut"
                title="Sélectionner le statut"
                value={form.statut}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              >
                <option value="à venir">À venir</option>
                <option value="terminé">Terminé</option>
                <option value="annulé">Annulé</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
            <Button onClick={handleSubmit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
