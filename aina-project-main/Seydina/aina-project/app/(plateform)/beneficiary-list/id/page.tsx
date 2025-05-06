"use client";

import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

type Patient = {
  iduser: string;
  nom: string;
  prenom: string;
  mail: string;
  tele: string;
  dateNaissance: string;
};

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchBeneficiaires() {
      try {
        const res = await fetch("http://localhost:9001/auth/users");
        const data = await res.json();
        console.log("Données utilisateurs : ", data);

        const beneficiaires = data.filter((user: any) => user.approle?.id_role === 1);
        setPatients(beneficiaires);
      } catch (error) {
        console.error("Erreur lors du chargement des bénéficiaires", error);
      }
    }

    fetchBeneficiaires();
  }, []);

  



  const filteredPatients = patients.filter(
    (p) =>
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.prenom.toLowerCase().includes(search.toLowerCase()) ||
      p.mail.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (patient: Patient) => {
    setEditPatient(patient);
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editPatient) return;
    setEditPatient({ ...editPatient, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!editPatient) return;
    // TODO: Envoi des modifications au backend
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    const confirm = window.confirm("Supprimer ce patient ?");
    if (confirm) {
      // TODO: supprimer côté backend aussi
      setPatients((prev) => prev.filter((p) => p.iduser !== id));
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des personnes bénéficiaires</h1>
        <Button onClick={() => router.push("/ajouter-beneficiaire")}>
          Ajouter une personne bénéficiaire
        </Button>
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
                <TableRow key={patient.iduser}>
                  <TableCell>{patient.nom}</TableCell>
                  <TableCell>{patient.prenom}</TableCell>
                  <TableCell>{patient.mail}</TableCell>
                  <TableCell>{patient.tele}</TableCell>
                  <TableCell>{patient.dateNaissance?.substring(0, 10)}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(patient)}>
                      Modifier
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(patient.iduser)}>
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPatients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Aucun patient trouvé.</TableCell>
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
            {["nom", "prenom", "mail", "tele", "dateNaissance"].map((field) => (
              <div key={field}>
                <Label htmlFor={field}>{field}</Label>
                <Input
                  id={field}
                  name={field}
                  value={(editPatient as any)?.[field] || ""}
                  onChange={handleInputChange}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
