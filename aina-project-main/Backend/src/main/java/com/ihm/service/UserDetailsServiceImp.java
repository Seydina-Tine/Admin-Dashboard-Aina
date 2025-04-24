package com.ihm.service;

import java.util.Collections;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ihm.dao.UtilisateurRepository;
import com.ihm.entites.Utilisateur;

@Service
public class UserDetailsServiceImp implements UserDetailsService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Utilisateur> optionalUtilisateur;
        if (username.contains("@")) {
            optionalUtilisateur = utilisateurRepository.findByMail(username);
        } else {
            optionalUtilisateur = utilisateurRepository.findByTele(username);
        }

        if (!optionalUtilisateur.isPresent()) {
            throw new UsernameNotFoundException("User not found with identifier: " + username);
        }

        Utilisateur utilisateur = optionalUtilisateur.get();
        return new User(username, utilisateur.getMotpasse(), Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
    }

    // Nouvelle méthode pour récupérer les détails de l'utilisateur par ID
    public Utilisateur getUserDetailsById(int userId) {
        return utilisateurRepository.findById(userId).orElse(null);
    }
}
