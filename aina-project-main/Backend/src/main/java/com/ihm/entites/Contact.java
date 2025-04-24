package com.ihm.entites;

import javax.persistence.Entity;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "contacts")
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "envoyeurId")
    private Utilisateur envoyeur; // Utilisateur qui envoie la demande

    @ManyToOne
    @JoinColumn(name = "receveurId")
    private Utilisateur receveur; // Utilisateur qui reçoit la demande


    // Constructeurs, Getters et Setters

    public Contact() {
        super();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Utilisateur getEnvoyeur() {
        return envoyeur;
    }

    public void setEnvoyeur(Utilisateur envoyeur) {
        this.envoyeur = envoyeur;
    }

    public Utilisateur getReceveur() {
        return receveur;
    }

    public void setReceveur(Utilisateur receveur) {
        this.receveur = receveur;
    }

 
}

