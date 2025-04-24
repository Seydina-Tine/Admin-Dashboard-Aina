package com.ihm.dao;


import com.ihm.entites.HealthCare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthCareRepository extends JpaRepository<HealthCare, Long> {
    List<HealthCare> findByContactIdOrUserBeneficiaire(Long contactId, Long userBeneficiaire);
    
    List<HealthCare> findByUserBeneficiaire(Long userBeneficiaire);
}

