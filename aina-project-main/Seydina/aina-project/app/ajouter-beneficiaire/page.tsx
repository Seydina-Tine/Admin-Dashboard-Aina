"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";

type Beneficiary = {
  id: number;
  nom: string;
  prenom: string;
  mail: string;
};

export default function AddBeneficiaryForm() {
  const router = useRouter();
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [showBeneficiaryList, setShowBeneficiaryList] = useState(false);

  // Fonction pour récupérer les bénéficiaires existants
  const fetchBeneficiaries = async () => {
    try {
      const res = await fetch("http://localhost:9001/beneficiaries");
      if (!res.ok) throw new Error("Erreur lors de la récupération des bénéficiaires");
      const data = await res.json();
      setBeneficiaries(data);
    } catch (error) {
      toast.error("Impossible de récupérer les bénéficiaires");
    }
  };

  // Afficher la liste des bénéficiaires
  const handleShowBeneficiaries = () => {
    fetchBeneficiaries();
    setShowBeneficiaryList(true);
  };

  // Sélectionner un bénéficiaire
  interface HandleSelectBeneficiary {
    (selectedBeneficiary: Beneficiary): void;
  }

  const handleSelectBeneficiary: HandleSelectBeneficiary = (selectedBeneficiary) => {
    setBeneficiary(selectedBeneficiary);
    setShowBeneficiaryList(false);
    toast.success("Bénéficiaire sélectionné");
  };

  return (
    <div className="p-6 space-y-6">
      <Button variant="outline" onClick={handleShowBeneficiaries}>
        Ajouter un bénéficiaire
      </Button>

      {showBeneficiaryList && (
        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold">Sélectionnez un bénéficiaire</h3>
          <ul>
            {beneficiaries.map((b) => (
              <li key={b.id} className="flex justify-between items-center">
                <span>{b.nom} {b.prenom}</span>
                <Button
                  variant="outline"
                  onClick={() => handleSelectBeneficiary(b)}
                >
                  Sélectionner
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {beneficiary && (
        <Card>
          <CardContent className="space-y-4 p-4">
            <h2 className="text-xl font-bold">Bénéficiaire sélectionné</h2>
            <p>Nom : {beneficiary.nom}</p>
            <p>Prénom : {beneficiary.prenom}</p>
            <p>Email : {beneficiary.mail}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}