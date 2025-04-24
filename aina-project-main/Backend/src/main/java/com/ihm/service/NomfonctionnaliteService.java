package com.ihm.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ihm.dao.NomFonctionnaliteRepository;
import com.ihm.dao.UtilisateurRepository;
import com.ihm.entites.NomFonctionnalite;
import com.ihm.entites.Utilisateur;

@Service
public class NomfonctionnaliteService {
	
	
	@Autowired
	NomFonctionnaliteRepository nomfonctionnaliterepository;
	
	
	
}
