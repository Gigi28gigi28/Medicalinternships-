"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

// Types
type Role = "etudiant" | "docteur" | "chef_service" | "admin";

interface FormData {
  nom: string;
  prenom: string;
  matricule: string;
  email: string;
  password: string;
  telephone: string;
  role: Role;
}

// Validation manuelle (plus fiable avec logique conditionnelle)
const validateForm = (data: FormData): Partial<Record<keyof FormData, string>> => {
  const errors: Partial<Record<keyof FormData, string>> = {};

  if (!data.nom || data.nom.trim().length < 2) {
    errors.nom = "Le nom doit contenir au moins 2 caractères";
  }
  if (!data.prenom || data.prenom.trim().length < 2) {
    errors.prenom = "Le prénom doit contenir au moins 2 caractères";
  }
  if (!data.password || data.password.length < 6) {
    errors.password = "Le mot de passe doit avoir au moins 6 caractères";
  }

  if (data.role === "etudiant") {
    if (!data.matricule || data.matricule.trim() === "") {
      errors.matricule = "Le matricule est requis pour un étudiant";
    }
  } else {
    if (!data.email || data.email.trim() === "") {
      errors.email = "L'email est requis";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      errors.email = "Email invalide";
    }
  }

  return errors;
};

export default function CreateAccountPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState<Role>("etudiant");
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      nom: "",
      prenom: "",
      matricule: "",
      email: "",
      password: "",
      telephone: "",
      role: "etudiant",
    },
  });

  const onSubmit = (data: FormData) => {
    setRole(data.role);

    const errors = validateForm(data);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    // 🔧 À remplacer par un appel API réel
    console.log("Données soumises :", {
      ...data,
      identifiant: data.role === "etudiant" ? data.matricule : data.email,
    });

    // Simulation
    setTimeout(() => {
      alert("Compte créé avec succès !");
      setIsSubmitting(false);
      reset();
      router.push("/dashboard/admin/users");
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Créer un nouveau compte</h1>
        <p className="text-muted-foreground">Ajouter un utilisateur au système</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="nom">Nom *</Label>
            <Input id="nom" {...register("nom")} />
            {formErrors.nom && <p className="text-sm text-destructive">{formErrors.nom}</p>}
          </div>

          {/* Prénom */}
          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom *</Label>
            <Input id="prenom" {...register("prenom")} />
            {formErrors.prenom && <p className="text-sm text-destructive">{formErrors.prenom}</p>}
          </div>

          {/* Rôle */}
          <div className="space-y-2">
            <Label htmlFor="role">Rôle *</Label>
            <Select
              value={role}
              onValueChange={(value) => {
                const newRole = value as Role;
                setRole(newRole);
                setFormErrors({}); // Réinitialiser erreurs au changement de rôle
              }}
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="etudiant">Étudiant</SelectItem>
                <SelectItem value="docteur">Docteur</SelectItem>
                <SelectItem value="chef_service">Chef de service</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Champ conditionnel */}
          {role === "etudiant" ? (
            <div className="space-y-2">
              <Label htmlFor="matricule">Matricule *</Label>
              <Input id="matricule" placeholder="Ex: 22123456" {...register("matricule")} />
              {formErrors.matricule && (
                <p className="text-sm text-destructive">{formErrors.matricule}</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@domaine.com"
                {...register("email")}
              />
              {formErrors.email && <p className="text-sm text-destructive">{formErrors.email}</p>}
            </div>
          )}

          {/* Mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe *</Label>
            <Input id="password" type="password" {...register("password")} />
            {formErrors.password && (
              <p className="text-sm text-destructive">{formErrors.password}</p>
            )}
          </div>

          {/* Téléphone */}
          <div className="space-y-2">
            <Label htmlFor="telephone">Numéro de téléphone (facultatif)</Label>
            <Input id="telephone" type="tel" placeholder="+213 55 123 4567" {...register("telephone")} />
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création en cours..." : "Créer le compte"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}