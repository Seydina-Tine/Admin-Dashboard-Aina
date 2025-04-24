package com.ihm.entites;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "nomFonctionnalite")
public class NomFonctionnalite {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id_fonctionnalite;

	private String nom_fonctionnalite;
	
	@ManyToMany(mappedBy = "fonctionnalites")
	@JsonIgnore // Empêche la propriété d'être incluse dans la réponse JSON
	private List<Utilisateur> users;

	public List<Utilisateur> getUsers() {
		return users;
	}

	public void setUsers(List<Utilisateur> users) {
		this.users = users;
	}

	public int getId_fonctionnalite() {
		return id_fonctionnalite;
	}

	public void setId_fonctionnalite(int id_fonctionnalite) {
		this.id_fonctionnalite = id_fonctionnalite;
	}

	public String getNom_fonctionnalite() {
		return nom_fonctionnalite;
	}

	public void setNom_fonctionnalite(String nom_fonctionnalite) {
		this.nom_fonctionnalite = nom_fonctionnalite;
	}

	public NomFonctionnalite() {
		super();
	}

}
