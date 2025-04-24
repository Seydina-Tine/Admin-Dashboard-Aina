package com.ihm.service;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ihm.dao.UtilisateurRepository;
import com.ihm.dao.ContactRepository;
import com.ihm.dao.DemandeamiRepository;
import com.ihm.dao.FonctionnaliteRepository;
import com.ihm.dao.NotificationRepository;
import com.ihm.dao.RappelRepository;
import com.ihm.dao.RoleRepository;
import com.ihm.entites.Utilisateur;
import com.ihm.entites.Contact;
import com.ihm.entites.DemandeAmi;
import com.ihm.entites.Fonctionnalite;
import com.ihm.entites.Notification;
import com.ihm.entites.Rappel;
import com.ihm.entites.Role;

@Service
@Transactional
public class AccountServiceImpl implements AccountService {

	@Autowired
	private UtilisateurRepository utilisateurRepository;

	@Autowired
	private RoleRepository Rolerepository;

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	private DemandeamiRepository demandeamiRepository;

	@Autowired
	private NotificationRepository notificationRepository;

	@Autowired
	private ContactRepository contactRepository;

	@Autowired
	private RappelRepository rappelRepository;

	@Autowired
	private JavaMailSender mailSender;

	@Autowired
	private FonctionnaliteRepository fonctionnaliteRepository;

	public Utilisateur saveUser(String nom, String prenom, int id_role, String mail, String sexe, Date date_naissance,
			String motpasse, String confirmepass, String adresse, String Tele, String numero_permis,
			String titre_professionel, MultipartFile photoFile, boolean isFirstlogin) {

		// Check if user already exists by telephone
        Optional<Utilisateur> userByTele = utilisateurRepository.findByTele(Tele);
        Optional<Utilisateur> userByemail = utilisateurRepository.findByMail(mail);
        if (userByTele.isPresent()) {
            throw new RuntimeException("Un utilisateur avec ce numéro de téléphone existe déjà !");
        }

        if (userByemail.isPresent()) {
            throw new RuntimeException("Un utilisateur avec ce email existe déjà !");
        }

		// Handle photo storage
		String photoUrl = null;
		if (photoFile != null && !photoFile.isEmpty()) {
			String fileName = null;
			try {
				fileName = storeFile(photoFile);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} // Store the file and get the file name
			photoUrl = "/path/to/your/upload/dir/" + fileName;
		}

		// Create new user instance
		Utilisateur newUser = new Utilisateur();
		Role role = new Role();
		role.setId_role(id_role);
		newUser.setAdresse(adresse);
		newUser.setDate_naissance(date_naissance);
		newUser.setMail(mail);
		newUser.setNom(nom);
		newUser.setPrenom(prenom);
		newUser.setSexe(sexe);
		newUser.setTele(Tele);
		newUser.setNumero_permis(numero_permis);
		newUser.setTitre_professionel(titre_professionel);
		newUser.setPhotoUrl(photoUrl); // Set photo URL
		newUser.setMotpasse(bCryptPasswordEncoder.encode(motpasse));
		newUser.setFirstlogin(isFirstlogin);

		// Assign default role
		newUser.setApprole(role);

		return utilisateurRepository.save(newUser);
	}

	private String storeFile(MultipartFile file) throws IOException {
		String originalFileName = file.getOriginalFilename();
		String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
		String fileName = UUID.randomUUID().toString() + fileExtension;

		System.out.println(fileName);
		// Path targetLocation =
		// Paths.get("C:\\Users\\azus\\Documents\\image_application\\" + fileName);
		Path targetLocation = Paths.get("C:\\xampp\\htdocs\\images\\" + fileName);
		Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

		return fileName;
	}

	@Override
	public Role saveRole(Role role) {
		return Rolerepository.save(role);

	}

	public List<Utilisateur> getALLemp() {
		return utilisateurRepository.findAll();
	}

	public List<Role> getALLrole() {
		return Rolerepository.findAll();
	}

	public boolean envoyerDemandeAmi(String identifiantDe, String identifiantA) {
		Optional<Utilisateur> de;

		boolean deEstEmail = identifiantDe.contains("@");

		if (deEstEmail) {
			de = utilisateurRepository.findByMail(identifiantDe);
		} else {
			de = utilisateurRepository.findByTele(identifiantDe);
		}

		if (de.isPresent()) {
			List<DemandeAmi> existingRequests = demandeamiRepository.findExistingFriendRequest(de.get(), identifiantA);

			if (!existingRequests.isEmpty()) {
				// Une demande d'ami en attente existe déjà
				return false;
			}

			DemandeAmi nouvelleDemande = new DemandeAmi();
			nouvelleDemande.setDeUtilisateurId(de.get());
			nouvelleDemande.setContactDestinataire(identifiantA);
			nouvelleDemande.setStatut(DemandeAmi.Status.EN_ATTENTE);
			demandeamiRepository.save(nouvelleDemande);
			return true;
		} else {
			// Utilisateur introuvable
			return false;
		}
	}

	 public boolean createNotification(String senderId, String receiverId, String title, String message,
			 String type_notification) {
			 // Vérification et nettoyage des identifiants
			 senderId = senderId.trim();
			 receiverId = receiverId.trim();

			 Optional<Utilisateur> sender = senderId.contains("@") ? utilisateurRepository.findByMail(senderId)
			 : utilisateurRepository.findByTele(senderId);
			 Optional<Utilisateur> receiver = receiverId.contains("@") ? utilisateurRepository.findByMail(receiverId)
			 : utilisateurRepository.findByTele(receiverId);

			 if (!sender.isPresent()) {
			 System.out.println("Expéditeur non trouvé : " + senderId);
			 return false;
			 }
			 if (!receiver.isPresent()) {
			 System.out.println("Destinataire non trouvé : " + receiverId);
			 return false;
			 }

			 Notification notification = new Notification();
			 notification.setSenderId(sender.get());
			 notification.setReceiverId(receiver.get());
			 notification.setTitle(title);
			 notification.setMessage(message);
			 notification.setType_notification(type_notification);
			 notification.setStatut(Notification.NotificationStatus.SENT);
			 notificationRepository.save(notification);

			 System.out.println("Notification créée avec succès pour : " + receiverId);
			 return true;
			 }

	public List<Notification> getNotificationsByReceiverId(int receiverId) {
		return notificationRepository.findByReceiverId_iduser(receiverId);
	}
//	@Override
//	public Utilisateur loadUserByEmail(String email) {
//		return utilisateurRepository.findByMail(email); // Assume findByMail is a method in your repository
//	}

	@Override
	public boolean createContact(String senderId, String receiverId) {
		// Vérification et nettoyage des identifiants
		senderId = senderId.trim();
		receiverId = receiverId.trim();

		Optional<Utilisateur> sender = senderId.contains("@") ? utilisateurRepository.findByMail(senderId)
				: utilisateurRepository.findByTele(senderId);
		Optional<Utilisateur> receiver = receiverId.contains("@") ? utilisateurRepository.findByMail(receiverId)
				: utilisateurRepository.findByTele(receiverId);

		if (!sender.isPresent()) {
			System.out.println("Expéditeur non trouvé : " + senderId);
			return false;
		}
		if (!receiver.isPresent()) {
			System.out.println("Destinataire non trouvé : " + receiverId);
			return false;
		}

		Contact contact = new Contact();
		contact.setEnvoyeur(sender.get());
		contact.setReceveur(receiver.get());
		contactRepository.save(contact);

		System.out.println("contact créée avec succès pour : " + receiverId);
		return true;
	}

	@Override
	public List<Contact> getContactsByReceiver(int receiverId) {

		return contactRepository.findByenvoyeur_iduser(receiverId);

	}

	@Override
	public List<Contact> getContactsByEnvoyer(int envoyerId) {

		return contactRepository.findByreceveur_iduser(envoyerId);

	}

	@Override
	public void sendDemandeAmiByMail(String to, String subject, String text) {

		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom("issam");
		message.setTo(to);
		message.setSubject(subject);
		message.setText(text);
		mailSender.send(message);

	}

	public List<DemandeAmi> getDemandesByReceiver(String receiverId) {
		// Clean up the receiverId input
		receiverId = receiverId.trim();

		// Determine if the receiverId is an email or phone number
		Optional<Utilisateur> receiver = receiverId.contains("@") ? utilisateurRepository.findByMail(receiverId)
				: utilisateurRepository.findByTele(receiverId);

		if (!receiver.isPresent()) {
			// Log the event for internal tracking
			System.out.println("Destinataire non trouvé : " + receiverId);
			// Return an empty list instead of null to indicate no results were found
			return Collections.emptyList();
		}

		// Fetching demands where status is EN_ATTENTE
		String contactInfo = receiverId.contains("@") ? receiver.get().getMail() : receiver.get().getTele();
		return demandeamiRepository.findLatestDemandesEnAttenteByReceiver(contactInfo);
	}

	@Transactional
	public void accepterDemandeAmi(int friendRequestId) {
		demandeamiRepository.accepterDemandeAmi(friendRequestId);
	}

	@Transactional
	public void refuserDemandeAmi(int friendRequestId) {
		demandeamiRepository.refuserDemandeAmi(friendRequestId);
	}

	@Override
	public void LireNotification(int id) {
		notificationRepository.lireNotification(id);

	}

	
	
	
	public boolean checkExistingRequest(int userId, String contact) {
		List<DemandeAmi> existingRequests = demandeamiRepository
				.findByDeUtilisateurId_iduserAndContactDestinataire(userId, contact);

		// Vérifier si une demande d'ami existe et si son statut est soit EN_ATTENTE
		// soit ACCEPTEE
		for (DemandeAmi demandeAmi : existingRequests) {
			if (demandeAmi.getStatut() == DemandeAmi.Status.EN_ATTENTE
					|| demandeAmi.getStatut() == DemandeAmi.Status.ACCEPTEE) {
				return true; // Retourner true si une demande valide est trouvée
			}
		}

		return false; // Retourner false si aucune demande valide n'est trouvée
	}
	
	

	@Override
	public void deleteContact(Utilisateur envoyeur, Utilisateur receveur) {
		contactRepository.deleteByEnvoyeurAndReceveur(envoyeur, receveur);

	}

	public List<Rappel> getRappelsByDate(LocalDate date, Utilisateur utilisateur) {
		// Trouver tous les rappels pour l'utilisateur
		List<Rappel> rappels = rappelRepository.findByUtilisateurbenficiaire(utilisateur);

		// Récupérer le jour de la semaine pour la date spécifiée
		String dayOfWeek = date.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.FRENCH);

		// Filtrer les rappels pour ne conserver que ceux qui correspondent à la
		// fréquence et à la date d'aujourd'hui
		List<Rappel> filteredRappels = rappels.stream().filter(rappel -> shouldIncludeRappel(rappel, dayOfWeek, date))
				.collect(Collectors.toList());

		// Trier les rappels par heure de rappel en ordre croissant
		filteredRappels.sort(Comparator.comparing(Rappel::getReminderTime));

		// Retourner tous les rappels triés en ordre croissant
		return filteredRappels;
	}

	public List<Rappel> getRappelsByDateproche(LocalDate date, Utilisateur utilisateur) {
		// Trouver tous les contacts de l'utilisateur où il est le proche aidant
		List<Contact> contacts = contactRepository.findByEnvoyeur(utilisateur);

		// Extraire les bénéficiaires des contacts
		List<Utilisateur> beneficiaries = contacts.stream().map(Contact::getReceveur).distinct()
				.collect(Collectors.toList());

		// Trouver tous les rappels créés par les bénéficiaires
		List<Rappel> rappels = rappelRepository.findByUtilisateurbenficiaireIn(beneficiaries);

		// Récupérer le jour de la semaine pour la date spécifiée
		String dayOfWeek = date.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.FRENCH);

		// Filtrer les rappels pour ne conserver que ceux qui correspondent à la
		// fréquence,
		// qui ont dépassé l'heure de rappel, et qui ont un statut différent de
		// "enattente"
		LocalTime currentTime = LocalTime.now();

		return rappels.stream().filter(rappel -> shouldIncludeRappel(rappel, dayOfWeek, date)).filter(
				rappel -> rappel.getReminderDate().isEqual(date) && rappel.getReminderTime().isBefore(currentTime))
				.filter(rappel -> rappel.getStatut() == Rappel.RappelStatus.refuse).collect(Collectors.toList());
	}

	public List<Rappel> getRappelsByDateprocheUpdate(LocalDate date, Utilisateur utilisateur) {
		// Trouver tous les contacts de l'utilisateur où il est le proche aidant
		List<Contact> contacts = contactRepository.findByEnvoyeur(utilisateur);

		// Extraire les bénéficiaires des contacts
		List<Utilisateur> beneficiaries = contacts.stream().map(Contact::getReceveur).distinct()
				.collect(Collectors.toList());

		// Trouver tous les rappels créés par les bénéficiaires
		List<Rappel> rappels = rappelRepository.findByUtilisateurbenficiaireIn(beneficiaries);

		// Filtrer les rappels pour ne conserver que ceux qui correspondent à la
		// fréquence
		return rappels.stream()

				.collect(Collectors.toList());
	}

	private boolean shouldIncludeRappel(Rappel rappel, String dayOfWeek, LocalDate date) {
		if ("Tous les jours".equals(rappel.getFrequency())) {
			return true;
		}

		if ("Jamais".equals(rappel.getFrequency())) {
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
			// Convert the reminder date to LocalDate for comparison
			LocalDate reminderDate = LocalDate.parse(rappel.getReminderDate().toString(), formatter);
			return date.equals(reminderDate);
		}

		// Diviser la fréquence en jours individuels
		String[] days = rappel.getFrequency().split(",\\s*");
		for (String day : days) {
			if (day.equalsIgnoreCase(dayOfWeek)) {
				return true;
			}
		}

		return false;
	}

	public Optional<Rappel> updateRappelStatusProche(int id, Rappel.RappelStatusProche newStatus) {
		Optional<Rappel> optionalRappel = rappelRepository.findById(id);
		if (optionalRappel.isPresent()) {
			Rappel rappel = optionalRappel.get();
			rappel.setStatutProche(newStatus);
			rappelRepository.save(rappel);
		}
		return optionalRappel;
	}

	public List<Fonctionnalite> getFonctionnalitesForUserApplique(int userAppliqueId) {
		return fonctionnaliteRepository.findByUserapplique_iduser(userAppliqueId);
	}

	public Fonctionnalite createOrUpdateFonctionnalite(Fonctionnalite fonctionnalite) {
		return fonctionnaliteRepository.save(fonctionnalite);
	}

	public Utilisateur updateUser(int id, String nom, String prenom, String mail, String sexe, Date date_naissance,
			String motpasse, String adresse, String tele, String numero_permis, String titre_professionel,
			MultipartFile photoFile) {

		Optional<Utilisateur> optionalUser = utilisateurRepository.findById(id);
		if (!optionalUser.isPresent()) {
			throw new RuntimeException("User not found");
		}

		Utilisateur user = optionalUser.get();

// Update fields if provided
		if (nom != null && !nom.isEmpty()) {
			user.setNom(nom);
		}
		if (prenom != null && !prenom.isEmpty()) {
			user.setPrenom(prenom);
		}
		if (mail != null && !mail.isEmpty()) {
			user.setMail(mail);
		}
		if (sexe != null && !sexe.isEmpty()) {
			user.setSexe(sexe);
		}
		if (date_naissance != null) {
			user.setDate_naissance(date_naissance);
		}
		if (motpasse != null && !motpasse.isEmpty()) {
			user.setMotpasse(bCryptPasswordEncoder.encode(motpasse));
		}
		if (adresse != null && !adresse.isEmpty()) {
			user.setAdresse(adresse);
		}
		if (tele != null && !tele.isEmpty()) {
			user.setTele(tele);
		}
		if (numero_permis != null && !numero_permis.isEmpty()) {
			user.setNumero_permis(numero_permis);
		}
		if (titre_professionel != null && !titre_professionel.isEmpty()) {
			user.setTitre_professionel(titre_professionel);
		}
		if (photoFile != null && !photoFile.isEmpty()) {
			String fileName = null;
			try {
				fileName = storeFile(photoFile);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			user.setPhotoUrl("/path/to/your/upload/dir/" + fileName);
		}

		return utilisateurRepository.save(user);
	}

	public List<Rappel> getRappelsForBeneficiaire(int userid) {

		Optional<Utilisateur> utilisateur = this.utilisateurRepository.findById(userid);

		if (utilisateur != null) {
			return rappelRepository.findByUtilisateurbenficiaire(utilisateur);
		} else {
			// Handle the case where the user is not found
			return List.of(); // Return an empty list or throw an exception
		}
	}

	@Override
	public void deleteDemandeAmi(Utilisateur envoyeur, String contact) {
		demandeamiRepository.deleteByDeUtilisateurIdAndContactDestinataire(envoyeur, contact);

	}

}