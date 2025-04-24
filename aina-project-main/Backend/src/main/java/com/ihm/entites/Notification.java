package com.ihm.entites;

import java.util.Date;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.ihm.entites.DemandeAmi.Status;

@Entity
@Table(name = "notifications")
public class Notification {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@ManyToOne
	@JoinColumn(name = "deUtilisateurId")
	private Utilisateur senderId;

	@ManyToOne
	@JoinColumn(name = "aUtilisateurId")
	private Utilisateur receiverId;

	@Column(length = 255)
	private String title;

	@Column(columnDefinition = "TEXT")
	private String message;

	private NotificationStatus statut;
	
	private String type_notification;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "created_at", nullable = false, updatable = false, insertable = true)
	private Date createdAt = new Date();

	public static enum NotificationStatus {
		SENT, DELIVERED, READ
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Utilisateur getSenderId() {
		return senderId;
	}

	public void setSenderId(Utilisateur senderId) {
		this.senderId = senderId;
	}

	public Utilisateur getReceiverId() {
		return receiverId;
	}

	public void setReceiverId(Utilisateur receiverId) {
		this.receiverId = receiverId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public NotificationStatus getStatut() {
		return statut;
	}

	public void setStatut(NotificationStatus statut) {
		this.statut = statut;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}
	
	

	public String getType_notification() {
		return type_notification;
	}

	public void setType_notification(String type_notification) {
		this.type_notification = type_notification;
	}

	public Notification() {
		super();
	}
	
	

}
