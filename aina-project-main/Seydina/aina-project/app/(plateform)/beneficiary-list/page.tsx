"use client"

import { useState } from "react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Patient = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
}

const initialPatients: Patient[] = [
  {
    id: "1",
    nom: "Dupont",
    prenom: "Marie",
    email: "marie.dupont@example.com",
    telephone: "0601020304",
    dateNaissance: "1990-05-20"
  },
  {
    id: "2",
    nom: "Martin",
    prenom: "Jean",
    email: "jean.martin@example.com",
    telephone: "0611223344",
    dateNaissance: "1985-10-15"
  }
]

export default function PatientsPage() {
  const [search, setSearch] = useState("")
  const [patients, setPatients] = useState(initialPatients)
  const [editPatient, setEditPatient] = useState<Patient | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const filteredPatients = patients.filter(
    (p) =>
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.prenom.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleEditClick = (patient: Patient) => {
    setEditPatient(patient)
    setIsOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editPatient) return
    setEditPatient({ ...editPatient, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    if (!editPatient) return
    setPatients((prev) =>
      prev.map((p) => (p.id === editPatient.id ? editPatient : p))
    )
    setIsOpen(false)
  }

  const handleDelete = (id: string) => {
    const confirm = window.confirm("Supprimer ce patient ?")
    if (confirm) {
      setPatients((prev) => prev.filter((p) => p.id !== id))
    }
  }
  const router = useRouter()
  function handleClick() {
    router.push("/beneficiary-list/1")
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des personnes bénéficiaires</h1>
        <Link href="/ajouter-beneficiaire">
          <Button>Ajouter une personne bénéficiaire</Button>
        </Link>
      </div>

      <Input
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Date de naissance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id} onClick={handleClick}>
                  <TableCell>{patient.nom}</TableCell>
                  <TableCell>{patient.prenom}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.telephone}</TableCell>
                  <TableCell>{patient.dateNaissance}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(patient)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(patient.id)}
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPatients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Aucun patient trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MODAL EDIT */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le patient</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                name="nom"
                value={editPatient?.nom || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                name="prenom"
                value={editPatient?.prenom || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={editPatient?.email || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                name="telephone"
                value={editPatient?.telephone || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="dateNaissance">Date de naissance</Label>
              <Input
                id="dateNaissance"
                name="dateNaissance"
                type="date"
                value={editPatient?.dateNaissance || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}