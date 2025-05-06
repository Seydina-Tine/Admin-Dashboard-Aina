// 1. Entité RendezVous
package com.ihm.entites;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class RendezVous {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime date;

    private String motif;

    private String statut; // "à venir", "terminé", "annulé"

    @ManyToOne
    private Utilisateur beneficiaire;

    @ManyToOne
    private Utilisateur prestataire;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public Utilisateur getBeneficiaire() { return beneficiaire; }
    public void setBeneficiaire(Utilisateur beneficiaire) { this.beneficiaire = beneficiaire; }

    public Utilisateur getPrestataire() { return prestataire; }
    public void setPrestataire(Utilisateur prestataire) { this.prestataire = prestataire; }
}
