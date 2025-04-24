package com.ihm.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ihm.entites.Planning;
import com.ihm.entites.Horaire;

@Repository
public interface PlanningRepository extends JpaRepository<Planning ,Long> {
	
	// Optional <Planning> findByHoraires(List <Horaire> horaires);
	 
//	 @Query("SELECT p FROM Planning p WHERE p.horaires = :horaires")
//	 Optional<Planning> findByExactHoraires(@Param("horaires") List<Horaire> horaires);

//	 @Query("SELECT p FROM Planning p JOIN p.horaires h WHERE h IN :horaires")
//	 List<Planning> findPlanningsContainingHoraires(@Param("horaires") List<Horaire> horaires);

	 List<Planning> findAll(); // Pour récupérer tous les Plannings, ou selon un critère initial

}
