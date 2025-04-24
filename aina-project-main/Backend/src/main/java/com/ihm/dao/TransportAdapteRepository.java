package com.ihm.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ihm.entites.HealthCare;
import com.ihm.entites.TransportAdapte;

@Repository
public interface TransportAdapteRepository extends JpaRepository <TransportAdapte, Long > {
	
	List<TransportAdapte> findByContactIdOrUserBeneficiaire(Long contactId, Long userBeneficiaire);
    
	List<TransportAdapte> findByUserBeneficiaire(Long userBeneficiaire);

}
