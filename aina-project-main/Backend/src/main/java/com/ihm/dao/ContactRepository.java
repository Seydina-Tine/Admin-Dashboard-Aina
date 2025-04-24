package com.ihm.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ihm.entites.Contact;
import com.ihm.entites.Utilisateur;

public interface ContactRepository extends JpaRepository<Contact, Integer> {

	List<Contact> findByenvoyeur_iduser(int iduser);

	List<Contact> findByreceveur_iduser(int iduser);

	void deleteByEnvoyeurAndReceveur(Utilisateur envoyeur, Utilisateur receveur);

	List<Contact> findByReceveur(Utilisateur utilisateur);

	List<Contact> findByEnvoyeur(Utilisateur utilisateur);
	
	
}
