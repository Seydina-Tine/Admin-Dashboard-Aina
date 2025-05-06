"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-6 md:p-10">
      <div className="w-[200px] h-[200px]">
        <Image
          src="/doctor.jpg"
          alt="doctor image"
          width={200}
          height={200}
          style={{ objectFit: "contain", borderRadius: "100%" }}
        />
      </div>
      <h1 className="font-medium text-2xl mb-5">
        Bienvenue, {user.nom} {user.prenom}
      </h1>
      <p className="mb-4 text-gray-600">Rôle : {user.approle?.nomrole}</p>

      <Link href="/ajouter-beneficiaire">
        <Button className="mb-4">Ajouter une personne bénéficiaire</Button>
      </Link>
      <br />

      <Link href="/ajouter-aidant">
        <Button className="mb-4">Ajouter une personne proche aidante</Button>
      </Link>
      <br />
      <Button>Modifier profil</Button>
    </div>
  );
}
