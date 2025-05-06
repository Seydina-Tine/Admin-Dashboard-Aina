"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";

export default function AddBeneficiaryForm() {
  const router = useRouter();
  const [beneficiary, setBeneficiary] = useState({
    nom: "",
    prenom: "",
    mail: "",
    sexe: "",
    dateNaissance: "",
    motpasse: "",
    confirmMotpasse: "",
    adresse: "",
    tele: "",
    isFirstlogin: true,
    id_role: 1,
  });

  const [procheAidants, setProcheAidants] = useState([
    {
      nom: "",
      prenom: "",
      mail: "",
      sexe: "",
      dateNaissance: "",
      motpasse: "",
      confirmMotpasse: "",
      adresse: "",
      tele: "",
      isFirstlogin: true,
      id_role: 2,
    },
  ]);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index === null) {
      setBeneficiary({ ...beneficiary, [name]: value });
    } else {
      const updated = [...procheAidants];
      updated[index][name] = value;
      setProcheAidants(updated);
    }
  };

  const handleAddProche = () => {
    setProcheAidants([
      ...procheAidants,
      {
        nom: "",
        prenom: "",
        mail: "",
        sexe: "",
        dateNaissance: "",
        motpasse: "",
        confirmMotpasse: "",
        adresse: "",
        tele: "",
        isFirstlogin: true,
        id_role: 2,
      },
    ]);
  };

  const handleSubmit = async () => {
    try {
      // Enregistrer le bénéficiaire
      const resBenef = await fetch("http://localhost:9001/auth/register", {
        method: "POST",
        body: new URLSearchParams(beneficiary),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!resBenef.ok) throw new Error("Erreur lors de l'ajout du bénéficiaire");

      const newBenef = await resBenef.json();

      // Enregistrer chaque proche aidant
      for (const proche of procheAidants) {
        const resProche = await fetch("http://localhost:9001/auth/register", {
          method: "POST",
          body: new URLSearchParams(proche),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        if (!resProche.ok) throw new Error("Erreur lors de l'ajout d'un proche aidant");

        const newProche = await resProche.json();

        // Relier le proche au bénéficiaire dans le backend (via /contacts ou autre)
        await fetch("http://localhost:9001/auth/contacts", {
          method: "POST",
          body: new URLSearchParams({
            senderId: newBenef.iduser.toString(),
            receiverId: newProche.iduser.toString(),
          }),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }

      toast.success("Bénéficiaire et proches ajoutés avec succès");
      router.push("/beneficiary-list");
    } catch (error) {
      toast.error("Une erreur s'est produite lors de l'enregistrement");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-bold">Ajouter un bénéficiaire</h2>
          {Object.entries(beneficiary).map(([key, val]) => (
            key !== "id_role" &&
            key !== "isFirstlogin" && (
              <div key={key}>
                <Label>{key}</Label>
                <Input
                  name={key}
                  type={key.includes("date") ? "date" : "text"}
                  value={val}
                  onChange={handleChange}
                />
              </div>
            )
          ))}
        </CardContent>
      </Card>

      {procheAidants.map((proche, index) => (
        <Card key={index}>
          <CardContent className="space-y-4 p-4">
            <h3 className="text-lg font-semibold">
              Proche aidant #{index + 1}
            </h3>
            {Object.entries(proche).map(([key, val]) => (
              key !== "id_role" &&
              key !== "isFirstlogin" && (
                <div key={key}>
                  <Label>{key}</Label>
                  <Input
                    name={key}
                    type={key.includes("date") ? "date" : "text"}
                    value={val}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
              )
            ))}
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" onClick={handleAddProche}>
        Ajouter un proche aidant
      </Button>
      <Button className="ml-4" onClick={handleSubmit}>
        Enregistrer
      </Button>
    </div>
  );
}
