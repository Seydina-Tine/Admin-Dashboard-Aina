package com.ihm.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ihm.dao.PlanningRepository;
import com.ihm.entites.Horaire;
import com.ihm.entites.Planning;

@Service
public class PlanningService {
	
	
	@Autowired
	private PlanningRepository planningrepository;
	
	public Planning  getHorairesfromTransport(List<Horaire> horaires) {
		
		Optional <Planning> optplanning=findPlanningWithExactHoraires(horaires);
				
			
		if (optplanning.isPresent()) {
		return optplanning.get();
	}
		else {
			return null;
		}


	}
	
	
	public Optional<Planning> findPlanningWithExactHoraires(List<Horaire> horaires) {
        // Récupère tous les Plannings
        List<Planning> allPlannings = planningrepository.findAll();

        // Recherche le Planning avec les horaires exacts
        return allPlannings.stream()
                .filter(planning -> hasExactHoraires(planning.getHoraires(), horaires))
                .findFirst();
    }

    // Méthode pour comparer deux listes d'horaires
    private boolean hasExactHoraires(List<Horaire> horaires1, List<Horaire> horaires2) {
        if (horaires1.size() != horaires2.size()) return false;

        // Utilise un Set pour comparer les deux listes d'horaires sans ordre particulier
        Set<Horaire> set1 = new HashSet<>(horaires1);
        Set<Horaire> set2 = new HashSet<>(horaires2);

        return set1.equals(set2); // Vérifie que les ensembles sont identiques
    }

}