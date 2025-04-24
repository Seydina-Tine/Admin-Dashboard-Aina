package com.ihm.entites;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "fonctionnalite")
public class Fonctionnalite {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@ManyToOne
	@JoinColumn(name = "id_fonctionnalite")
	private NomFonctionnalite nomFonctionnalite;

	@ManyToOne
	@JoinColumn(name = "id_userapplique")
	private Utilisateur userapplique;

	@ManyToOne
	@JoinColumn(name = "id_userconfirme")
	private Utilisateur userconfirme;

	private boolean desactiver_fonctionnalite;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Utilisateur getUserapplique() {
		return userapplique;
	}

	public void setUserapplique(Utilisateur userapplique) {
		this.userapplique = userapplique;
	}

	public Utilisateur getUserconfirme() {
		return userconfirme;
	}

	public void setUserconfirme(Utilisateur userconfirme) {
		this.userconfirme = userconfirme;
	}

	public boolean isDesactiver_fonctionnalite() {
		return desactiver_fonctionnalite;
	}

	public void setDesactiver_fonctionnalite(boolean desactiver_fonctionnalite) {
		this.desactiver_fonctionnalite = desactiver_fonctionnalite;
	}

	public Fonctionnalite() {
		super();
	}

	public NomFonctionnalite getNomFonctionnalite() {
		return nomFonctionnalite;
	}

	public void setNomFonctionnalite(NomFonctionnalite nomFonctionnalite) {
		this.nomFonctionnalite = nomFonctionnalite;
	}

}
