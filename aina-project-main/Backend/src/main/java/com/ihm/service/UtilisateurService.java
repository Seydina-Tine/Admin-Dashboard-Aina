package com.ihm.service;

import com.ihm.dao.UtilisateurRepository;
import com.ihm.entites.NomFonctionnalite;
import com.ihm.entites.Utilisateur;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public void updateOnlineStatus(int userId, boolean isOnline) {
        Optional<Utilisateur> optionalUtilisateur = utilisateurRepository.findById(userId);
        if (optionalUtilisateur.isPresent()) {
            Utilisateur utilisateur = optionalUtilisateur.get();
            utilisateur.setIsOnline(isOnline);
            utilisateurRepository.save(utilisateur);
            System.out.println("Updated user " + userId + " isOnline status to " + isOnline);
        } else {
            System.out.println("User with ID " + userId + " not found");
        }
    }

    // Mettre a jour la valeur de first login apres la premiere connexion pour un telephone adroid
    public void updateFirstlogin(int userId, boolean isFirstlogin) {
        Optional<Utilisateur> optionalUtilisateur = utilisateurRepository.findById(userId);
        if (optionalUtilisateur.isPresent()) {
            Utilisateur utilisateur = optionalUtilisateur.get();
            utilisateur.setFirstlogin(isFirstlogin);
            utilisateurRepository.save(utilisateur);
            System.out.println("Updated user " + userId + " isFirstlogin status to " + isFirstlogin);
        } else {
            System.out.println("User with ID " + userId + " not found");
        }
    }

    public Utilisateur authenticateUser(String identifier, String password) {
        Optional<Utilisateur> optionalUtilisateur;
        if (identifier.contains("@")) {
            optionalUtilisateur = utilisateurRepository.findByMail(identifier);
        } else {
            optionalUtilisateur = utilisateurRepository.findByTele(identifier);
        }

        if (optionalUtilisateur.isPresent()) {
            Utilisateur utilisateur = optionalUtilisateur.get();
            if (utilisateur.getMotpasse().equals(password)) {
                return utilisateur;
            }
        }
        return null;
    }
    	
	public void  addFonctionnaliteforuserBeneficiaire(int iduser, List<NomFonctionnalite> fonctionnalites) {
		
		
		Optional<Utilisateur> optuser= utilisateurRepository.findById(iduser);
		
		if(optuser.isPresent()) { 
			
			Utilisateur user=optuser.get();
			user.setFonctionnalites(fonctionnalites);
			utilisateurRepository.save(user);
			
		} else {
		            throw new RuntimeException("Utilisateur non trouvé");
		        }
	}
		
	
	//public void updateFonctionnaliteforuserBeneficiaire()
	
	public List<NomFonctionnalite> getFonctionnalitesforuserBeneficiaire(int iduser){ 
		
		Optional<Utilisateur> optuser= utilisateurRepository.findById(iduser);
		
		if(optuser.isPresent()) { 
			
			Utilisateur user=optuser.get();
			List<NomFonctionnalite> result= user.getFonctionnalites();
			
			System.out.println("valeur de result  "+result);
			
		return	result;			
			
		} else {
		            throw new RuntimeException("Utilisateur non trouvé");
		        }
	}
}
