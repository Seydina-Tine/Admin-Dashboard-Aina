import { LoginForm } from "@/components/login-form";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" p-6 md:p-10">
      <div className="w-[200px] h-[200px]">
        <Image
          src="/doctor.jpg"
          alt="doctor image"
          width={200}
          height={200}
          style={{objectFit:"contain",borderRadius:"100%"}}
        />
      </div>
      <h1 className="font-medium text-2xl mb-5">Docteur Mouhamed</h1>
      <Button className="mb-4">Ajouter une personne bénéficiaire</Button><br />
      <Button className="mb-4">Ajouter une personne proche aidante</Button><br />
      <Button>Modifier profil</Button>

    </div>
  );
}
