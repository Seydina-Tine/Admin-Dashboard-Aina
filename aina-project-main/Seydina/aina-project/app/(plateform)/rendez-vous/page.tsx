"use client"

import { useState } from "react"
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
  id: string
  nom: string
  prenom: string
}

type RendezVous = {
  id: string
  patientId: string
  date: string
  motif: string
  statut: "à venir" | "terminé" | "annulé"
}

const patients: Patient[] = [
  { id: "1", nom: "Dupont", prenom: "Marie" },
  { id: "2", nom: "Martin", prenom: "Jean" }
]

const initialRdv: RendezVous[] = [
  {
    id: "a1",
    patientId: "1",
    date: "2025-05-01T14:00",
    motif: "Suivi post-opératoire",
    statut: "à venir"
  },
  {
    id: "b2",
    patientId: "2",
    date: "2025-04-20T10:30",
    motif: "Bilan annuel",
    statut: "terminé"
  }
]

export default function RendezVousPage() {
  const [rendezVous, setRendezVous] = useState(initialRdv)
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<RendezVous | null>(null)

  const [form, setForm] = useState<RendezVous>({
    id: "",
    patientId: "",
    date: "",
    motif: "",
    statut: "à venir"
  })

  const openModal = (rdv?: RendezVous) => {
    if (rdv) {
      setEditing(rdv)
      setForm(rdv)
    } else {
      setEditing(null)
      setForm({ id: crypto.randomUUID(), patientId: "", date: "", motif: "", statut: "à venir" })
    }
    setIsOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    if (editing) {
      setRendezVous((prev) => prev.map((r) => (r.id === form.id ? form : r)))
    } else {
      setRendezVous((prev) => [...prev, form])
    }
    setIsOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Supprimer ce rendez-vous ?")) {
      setRendezVous((prev) => prev.filter((r) => r.id !== id))
    }
  }

  const getPatientName = (id: string) => {
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRdv.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{getPatientName(r.patientId)}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.motif}</TableCell>
                  <TableCell>{r.statut}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openModal(r)}>
                      Modifier
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(r.id)}>
                      Supprimer
                    </Button>
                  </TableCell>
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
              <Label>Patient</Label>
              <select
                name="patientId"
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
              <Label>Date et heure</Label>
              <Input
                type="datetime-local"
                name="date"
                value={form.date}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label>Motif</Label>
              <Input name="motif" value={form.motif} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Statut</Label>
              <select
                name="statut"
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