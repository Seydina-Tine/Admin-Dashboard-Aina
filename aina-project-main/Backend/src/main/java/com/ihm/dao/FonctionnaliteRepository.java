package com.ihm.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ihm.entites.Fonctionnalite;

public interface FonctionnaliteRepository extends JpaRepository<Fonctionnalite, Integer> {
	
    List<Fonctionnalite> findByUserapplique_iduser(int userappliqueId);
    List<Fonctionnalite> findByUserconfirme_iduser(int userconfirmeId);
}
