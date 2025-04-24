package com.ihm.service;

import com.ihm.entites.HealthCare;
import com.ihm.entites.Pharmacy;
import com.ihm.dao.HealthCareRepository;
import com.ihm.dao.PharmacyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PharmacyService {
    @Autowired
    private PharmacyRepository pharmacyRepository;
    
    public PharmacyService(PharmacyRepository pharmacyRepository) {
        this.pharmacyRepository = pharmacyRepository;
    }
    


    public List<Pharmacy> getPharmaciesByUser(Long contactId, Long userBeneficiaire) {
        return pharmacyRepository.findByContactIdOrUserBeneficiaire(contactId, userBeneficiaire);
    }
    
    //   
  
    
    public List<Pharmacy>getPharmaciesByUserSelection(Long userBeneficiaire) {
    	return pharmacyRepository.findByUserBeneficiaire(userBeneficiaire);
    }

    public Pharmacy addPharmacy(Pharmacy pharmacy) {
        return pharmacyRepository.save(pharmacy);
    }

    public void deletePharmacy(Long id) {
        pharmacyRepository.deleteById(id);
    }
    
    
    public Pharmacy updatePharmacy(Long id, Pharmacy pharmacyDetails) {
        Optional<Pharmacy> optionalPharmacy = pharmacyRepository.findById(id);
        if (optionalPharmacy.isPresent()) {
        	Pharmacy pharmacy = optionalPharmacy.get();
            pharmacy.setName(pharmacyDetails.getName());
            pharmacy.setAddress(pharmacyDetails.getAddress());
            pharmacy.setPhoneNumber(pharmacyDetails.getPhoneNumber());
            return pharmacyRepository.save(pharmacy);
        } else {
            throw new RuntimeException("Pharmacie non trouvée");
        }
    }
}