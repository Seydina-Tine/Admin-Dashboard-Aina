package com.ihm.dao;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ihm.entites.Rappel;
import com.ihm.entites.Utilisateur;

import org.springframework.stereotype.Repository;

public interface RappelRepository extends JpaRepository<Rappel, Integer> {

	Optional<Rappel> findById(int id);

	List<Rappel> findByReminderDate(LocalDate date);

	List<Rappel> findByUtilisateurbenficiaire(Optional<Utilisateur> utilisateur);

	List<Rappel> findByUtilisateurbenficiaire(Utilisateur utilisateur);

	List<Rappel> findByUtilisateurprocheaidan(Utilisateur utilisateur);

	List<Rappel> findByUtilisateurprocheaidanOrUtilisateurbenficiaire(Utilisateur utilisateur,
			Utilisateur utilisateur1);

	List<Rappel> findByUtilisateurbenficiaireIn(List<Utilisateur> beneficiaries);

}