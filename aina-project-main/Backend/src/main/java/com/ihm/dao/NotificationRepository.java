package com.ihm.dao;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.ihm.entites.Notification;
import com.ihm.entites.Role;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

	@Transactional
	@Modifying
	@Query("UPDATE Notification n SET n.statut = 2 WHERE n.id = ?1")
	void lireNotification(int id);

	List<Notification> findByReceiverId_iduser(int iduser);
}
