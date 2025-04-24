package com.ihm.entites;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "demandeami")
public class DemandeAmi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idDemandeAmi;

    @ManyToOne
    @JoinColumn(name = "deUtilisateurId")
    private Utilisateur deUtilisateurId;

    private String contactDestinataire;  // Champ unique pour email ou téléphone

    private Status statut;

    private Date dateCreation = new Date();

    private Date dateMiseAJour = new Date();

    public enum Status {
        EN_ATTENTE,
        ACCEPTEE,
        REFUSEE
    }

    // Getters et setters
    public int getIdDemandeAmi() {
        return idDemandeAmi;
    }

    public void setIdDemandeAmi(int idDemandeAmi) {
        this.idDemandeAmi = idDemandeAmi;
    }

    public Utilisateur getDeUtilisateurId() {
        return deUtilisateurId;
    }

    public void setDeUtilisateurId(Utilisateur deUtilisateurId) {
        this.deUtilisateurId = deUtilisateurId;
    }

    public String getContactDestinataire() {
        return contactDestinataire;
    }

    public void setContactDestinataire(String contactDestinataire) {
        this.contactDestinataire = contactDestinataire;
    }

    public Status getStatut() {
        return statut;
    }

    public void setStatut(Status statut) {
        this.statut = statut;
    }

    public Date getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(Date dateCreation) {
        this.dateCreation = dateCreation;
    }

    public Date getDateMiseAJour() {
        return dateMiseAJour;
    }

    public void setDateMiseAJour(Date dateMiseAJour) {
        this.dateMiseAJour = dateMiseAJour;
    }

    public DemandeAmi() {
        super();
    }

    // Constructeur optionnel avec contact
    public DemandeAmi(Utilisateur deUtilisateur, String contact, Status statut) {
        this.deUtilisateurId = deUtilisateur;
        this.contactDestinataire = contact;
        this.statut = statut;
        this.dateCreation = new Date();
        this.dateMiseAJour = new Date();
    }
}