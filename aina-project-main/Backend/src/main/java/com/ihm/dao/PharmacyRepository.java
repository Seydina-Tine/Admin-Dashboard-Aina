package com.ihm.dao;



import com.ihm.entites.HealthCare;
import com.ihm.entites.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PharmacyRepository extends JpaRepository<Pharmacy, Long> {
    List<Pharmacy> findByContactIdOrUserBeneficiaire(Long contactId, Long userBeneficiaire);
     
    List<Pharmacy> findByUserBeneficiaire(Long userBeneficiaire);
    
    
}