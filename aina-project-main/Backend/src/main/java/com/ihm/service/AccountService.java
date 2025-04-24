package com.ihm.service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.mail.MessagingException;
import javax.mail.internet.AddressException;

import org.springframework.web.multipart.MultipartFile;

import com.ihm.entites.Utilisateur;
import com.ihm.entites.Contact;
import com.ihm.entites.DemandeAmi;
import com.ihm.entites.Fonctionnalite;
import com.ihm.entites.Notification;
import com.ihm.entites.Rappel;
import com.ihm.entites.Role;

public interface AccountService {

	public Utilisateur saveUser(String nom, String prenom, int id_role, String mail, String sexe, Date date_naissance,
			String motpasse, String confirmepass, String adresse, String Tele, String numero_permis,
			String titre_professionel, MultipartFile photoFile, boolean isFirstlogin);

	public Role saveRole(Role role);

	public List<Utilisateur> getALLemp();

	public List<Role> getALLrole();

	public boolean createNotification(String senderId, String receiverId, String title, String message,
			String type_notification);

	public boolean envoyerDemandeAmi(String identifiantDe, String identifiantA);

	public List<Notification> getNotificationsByReceiverId(int receiverId);

	public List<Contact> getContactsByReceiver(int receiverId);

	public List<Contact> getContactsByEnvoyer(int envoyeurId);

	public boolean createContact(String senderId, String receiverId);
	// public Utilisateur loadUserByEmail(String email);

	public void sendDemandeAmiByMail(String to, String subject, String text);

	public List<DemandeAmi> getDemandesByReceiver(String receiverId);

	public void refuserDemandeAmi(int idDemandeAmi);

	public void accepterDemandeAmi(int friendRequestId);

	public void LireNotification(int id);

	public boolean checkExistingRequest(int userId, String contact);

	public void deleteContact(Utilisateur envoyeur, Utilisateur receveur);

	public List<Rappel> getRappelsByDate(LocalDate date, Utilisateur utilisateur);

	public List<Rappel> getRappelsByDateproche(LocalDate date, Utilisateur utilisateur);

	List<Rappel> getRappelsByDateprocheUpdate(LocalDate date, Utilisateur utilisateur);

	public Optional<Rappel> updateRappelStatusProche(int id, Rappel.RappelStatusProche newStatus);

	public List<Fonctionnalite> getFonctionnalitesForUserApplique(int userAppliqueId);

	public Fonctionnalite createOrUpdateFonctionnalite(Fonctionnalite fonctionnalite);

	public Utilisateur updateUser(int id, String nom, String prenom, String mail, String sexe, Date date_naissance,
			String motpasse, String adresse, String tele, String numero_permis, String titre_professionel,
			MultipartFile photoFile);

	public List<Rappel> getRappelsForBeneficiaire(int identifier);

	public void deleteDemandeAmi(Utilisateur envoyeur, String contact);
}