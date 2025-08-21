"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const formSchema = z.object({
  numberPermis: z.coerce.number(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(4),
  confirmPassword: z.string().min(4),
  phone: z.string().min(6),
  date_naissance: z.string().min(4), // Format YYYY-MM-DD
  //titre_professionel: z.string().min(2),
  
});

export default function CreateAccount() {
  const [photo, setPhoto] = useState<File | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numberPermis: 0,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      //date_naissance: "1990-01-01",
      //titre_professionel: "",
      
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("numero_permis", values.numberPermis.toString());
    formData.append("nom", values.lastName);
    formData.append("prenom", values.firstName);
    formData.append("id_role", "1"); // Par défaut : rôle 1
    formData.append("mail", values.email);
   // formData.append("date_naissance", values.date_naissance);
    formData.append("motpasse", values.password);
    formData.append("tel", values.phone);
   
    

    if (photo) {
      formData.append("photoFile", photo);
    }

    try {
      const res = await fetch("http://localhost:9001/auth/register", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        alert("Échec de l'inscription : " + errText);
      } else {
        alert("Inscription réussie !");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Erreur réseau lors de la création du compte");
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl mb-2">
              Create Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField name="numberPermis" control={form.control} render={({ field }) => (
                  <FormItem><FormControl><Input type="number" placeholder="Numéro Permis" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="firstName" control={form.control} render={({ field }) => (
                  <FormItem><FormControl><Input placeholder="First Name" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="lastName" control={form.control} render={({ field }) => (
                  <FormItem><FormControl><Input placeholder="Last Name" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="email" control={form.control} render={({ field }) => (
                  <FormItem><FormControl><Input type="email" placeholder="Email" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="password" control={form.control} render={({ field }) => (
                  <FormItem><FormControl><Input type="password" placeholder="Password" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="confirmPassword" control={form.control} render={({ field }) => (
                  <FormItem><FormControl><Input type="password" placeholder="Confirm Password" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="phone" control={form.control} render={({ field }) => (
                  <FormItem><FormControl><Input placeholder="Phone Number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                
                
                
              

                <div>
                  <label>Photo (optionnelle)</label>
                  <Input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
                </div>

                <div className="flex justify-between pt-3">
                  <Button type="submit">Sign Up</Button>
                  <Button variant="link">
                    <Link href="/login">Already have an account?</Link>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
