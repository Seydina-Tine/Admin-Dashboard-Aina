package com.ihm.dao;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ihm.entites.DemandeAmi;
import com.ihm.entites.Utilisateur;

public interface DemandeamiRepository extends JpaRepository<DemandeAmi, Integer> {

	@Transactional
	@Modifying
	@Query("UPDATE DemandeAmi d SET d.statut =1 WHERE d.idDemandeAmi = ?1")
	void accepterDemandeAmi(int idDemandeAmi);

	@Transactional
	@Modifying
	@Query("UPDATE DemandeAmi d SET d.statut = 2 WHERE d.idDemandeAmi = ?1")
	void refuserDemandeAmi(int idDemandeAmi);

	List<DemandeAmi> findByContactDestinataireAndStatut(String contactDestinataire, DemandeAmi.Status statut);

	@Query("SELECT da FROM DemandeAmi da WHERE da.contactDestinataire = :receiverId AND da.statut = 'EN_ATTENTE' AND da.idDemandeAmi IN (SELECT MAX(d.idDemandeAmi) FROM DemandeAmi d WHERE d.contactDestinataire = :receiverId AND d.statut = 'EN_ATTENTE' GROUP BY d.deUtilisateurId)")
	List<DemandeAmi> findLatestDemandesEnAttenteByReceiver(String receiverId);

	void deleteByDeUtilisateurIdAndContactDestinataire(Utilisateur deUtilisateurId, String contactDestinataire);

	List<DemandeAmi> findByDeUtilisateurId_iduserAndContactDestinataire(int userId, String contactDestinataire);

	@Query("SELECT d FROM DemandeAmi d WHERE d.deUtilisateurId = :deUtilisateur AND d.contactDestinataire = :contactDestinataire AND d.statut = 'EN_ATTENTE'")
	List<DemandeAmi> findExistingFriendRequest(@Param("deUtilisateur") Utilisateur deUtilisateur,
			@Param("contactDestinataire") String contactDestinataire);
}