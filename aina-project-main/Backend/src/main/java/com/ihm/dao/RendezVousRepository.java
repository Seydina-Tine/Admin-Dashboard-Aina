// 1. Repository
package com.ihm.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ihm.entites.RendezVous;

@Repository
public interface RendezVousRepository extends JpaRepository<RendezVous, Long> {
    List<RendezVous> findByBeneficiaireIduser(int beneficiaireId);
    List<RendezVous> findByPrestataireIduser(int prestataireId);
}
