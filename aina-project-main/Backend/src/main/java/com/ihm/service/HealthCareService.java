package com.ihm.service;


import org.springframework.stereotype.Service;
import com.ihm.dao.HealthCareRepository;
import com.ihm.entites.HealthCare;

import java.util.List;
import java.util.Optional;

@Service
public class HealthCareService {

    private final HealthCareRepository healthCareRepository;

    public HealthCareService(HealthCareRepository healthCareRepository) {
        this.healthCareRepository = healthCareRepository;
    }

    public List<HealthCare> getHealthCaresByUser(Long contactId, Long userBeneficiaire) {
        // Implémentation pour récupérer les soins de santé par contactId et userBeneficiaire
        // Placeholder
        return healthCareRepository.findByContactIdOrUserBeneficiaire(contactId, userBeneficiaire);
    }

    public List<HealthCare> getHealthCaresByUserSelection(Long userBeneficiaire) {
        return healthCareRepository.findByUserBeneficiaire(userBeneficiaire);
    }

    public HealthCare addHealthCare(HealthCare healthCare) {
        return healthCareRepository.save(healthCare);
    }

    public void deleteHealthCare(Long id) {
        healthCareRepository.deleteById(id);
    }
    
    public HealthCare updateHealthCare(Long id, HealthCare healthCareDetails) {
        Optional<HealthCare> optionalHealthCare = healthCareRepository.findById(id);
        if (optionalHealthCare.isPresent()) {
            HealthCare healthCare = optionalHealthCare.get();
            healthCare.setType(healthCareDetails.getType());
            healthCare.setName(healthCareDetails.getName());
            healthCare.setAddress(healthCareDetails.getAddress());
            healthCare.setPhoneNumber(healthCareDetails.getPhoneNumber());
            return healthCareRepository.save(healthCare);
        } else {
            throw new RuntimeException("Soins de santé non trouvé");
        }
    }
}
