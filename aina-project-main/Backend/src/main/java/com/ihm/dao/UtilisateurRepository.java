package com.ihm.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ihm.entites.Utilisateur;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {
   
    Optional<Utilisateur> findByMail(String mail);

    Optional<Utilisateur> findByTele(String tele);
   
    Optional<Utilisateur> findByResetCode(String resetCode);
}