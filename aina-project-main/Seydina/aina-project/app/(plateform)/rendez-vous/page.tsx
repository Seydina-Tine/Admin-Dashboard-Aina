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
  id: number
  nom: string
  prenom: string
}

type RendezVous = {
  id?: number
  patientId: number
  date: string
  motif: string
  statut: "à venir" | "terminé" | "annulé"
}

export default function RendezVousPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([])
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<RendezVous | null>(null)

  const [form, setForm] = useState<RendezVous>({
    patientId: 0,
    date: "",
    motif: "",
    statut: "à venir"
  })

  useEffect(() => {
    fetch("http://localhost:9001/auth/users")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((u: any) =>
          u.approle?.nomrole === "Bénéficiaire" || u.approle?.nomrole === "Proche Aidant"
        )
        setPatients(filtered)
      })

    fetch("http://localhost:9001/api/rendezvous")
      .then((res) => res.json())
      .then((data) => setRendezVous(data))
  }, [])

  const openModal = (rdv?: RendezVous) => {
    if (rdv) {
      setEditing(rdv)
      setForm(rdv)
    } else {
      setEditing(null)
      setForm({
        patientId: 0,
        date: "",
        motif: "",
        statut: "à venir"
      })
    }
    setIsOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: name === "patientId" ? parseInt(value) : value })
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
          beneficiaire: { iduser: form.patientId },
          prestataire: { iduser: 1 } // Exemple statique
        })
      })

      const saved = await res.json()
      setRendezVous((prev) => [...prev, saved])
      setIsOpen(false)
    } catch (err) {
      console.error("Erreur enregistrement RDV", err)
    }
  }

  const getPatientName = (id: number) => {
    const p = patients.find((p) => p.id === id)
    return p ? `${p.prenom} ${p.nom}` : "Inconnu"
  }

  const filteredRdv = rendezVous.filter((r) => {
    const patient = getPatientName(r.patientId).toLowerCase()
    return (
      patient.includes(search.toLowerCase()) ||
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
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRdv.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{getPatientName(r.patientId)}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.motif}</TableCell>
                  <TableCell>{r.statut}</TableCell>
                </TableRow>
              ))}
              {filteredRdv.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
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
              <Label htmlFor="patientId">Patient</Label>
              <select
                id="patientId"
                name="patientId"
                aria-label="Patient"
                title="Sélectionner un patient"
                value={form.patientId}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              >
                <option value="">-- Sélectionner --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.prenom} {p.nom}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="date">Date et heure</Label>
              <Input
                type="datetime-local"
                id="date"
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
                aria-label="Statut du rendez-vous"
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
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
