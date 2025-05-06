package com.ihm.web;

import java.security.Key;
import java.time.LocalDate;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.ihm.dao.NomFonctionnaliteRepository;
import com.ihm.dao.RappelRepository;
import com.ihm.dao.UtilisateurRepository;
import com.ihm.entites.Contact;
import com.ihm.entites.DemandeAmi;
import com.ihm.entites.Fonctionnalite;
import com.ihm.entites.NomFonctionnalite;
import com.ihm.entites.Notification;
import com.ihm.entites.Rappel;
import com.ihm.entites.Rappel.RappelStatusProche;
import com.ihm.entites.Role;
import com.ihm.entites.Utilisateur;
import com.ihm.service.AccountService;
import com.ihm.service.RappelService;
import com.ihm.service.UtilisateurService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
@CrossOrigin(origins = "*") // Autoriser les requêtes de toutes les origines
@RestController
@RequestMapping("/auth")
public class AuthController {
	private static final Key jwtKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

	@Autowired
	private AccountService accountService;

	@Autowired
	private RappelService service;

	@Autowired
	private UtilisateurRepository utilisateurRepository;

	@Autowired
	private RappelRepository rappelRepository;

	@Autowired
	private UtilisateurService utilisateurService;
	
	@Autowired
	private NomFonctionnaliteRepository NomfonctionnaliteRepository;
	
	
	// private static final String API_KEY = "644aca7a2ba3107c919402112696aaee04ff5f873a2cc52e386cdb174fd552e8";
	 
	private static final String API_KEY = "dcde1b16934a67229e92ee4bbaeb645eeb4885888585db34f0049428b1c03e41";
	 @GetMapping("/create-room")
	 public ResponseEntity<String> createRoom() {
	     RestTemplate restTemplate = new RestTemplate();
	     String url = "https://api.daily.co/v1/rooms";
	     HttpHeaders headers = new HttpHeaders();
	     headers.set("Authorization", "Bearer " + API_KEY);
	     headers.set("Content-Type", "application/json");

	     JSONObject request = new JSONObject();
	     request.put("properties", new JSONObject().put("enable_chat", true).put("enable_prejoin_ui", false));

	     HttpEntity<String> entity = new HttpEntity<>(request.toString(), headers);
	     ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

	     // Extraire l'URL de la salle à partir de la réponse JSON
	     JSONObject responseObject = new JSONObject(response.getBody());
	     String roomUrl = responseObject.getString("url");  // Assurez-vous que "url" est bien le champ renvoyé par l'API

	     return ResponseEntity.ok(roomUrl); // Retourne directement l'URL de la salle
	 }


	// Méthode de mise à jour des utilisateurs
	@PutMapping("/users/{id}")
	public ResponseEntity<?> updateUser(@PathVariable("id") int id, @RequestBody Utilisateur updatedUser) {
		Optional<Utilisateur> userOptional = utilisateurRepository.findById(id);

		if (!userOptional.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
		}

		Utilisateur existingUser = userOptional.get();

		// Mettre à jour les informations de l'utilisateur
		existingUser.setNom(updatedUser.getNom());
		existingUser.setPrenom(updatedUser.getPrenom());
		existingUser.setMail(updatedUser.getMail());
		existingUser.setTele(updatedUser.getTele());
		existingUser.setSexe(updatedUser.getSexe());
		existingUser.setAdresse(updatedUser.getAdresse());

		try {
			utilisateurRepository.save(existingUser);
			return ResponseEntity.ok(existingUser);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error updating user: " + e.getMessage());
		}
	}

	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@RequestParam("nom") String nom, @RequestParam("prenom") String prenom,
			@RequestParam("id_role") int idRole, @RequestParam("mail") String mail,
			@RequestParam(value = "sexe", required = false) String sexe,
			@RequestParam(value = "dateNaissance", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dateNaissance,
			@RequestParam("motpasse") String motpasse, @RequestParam("confirmMotpasse") String confirmMotpasse,
			@RequestParam(value = "adresse", required = false) String adresse, @RequestParam("tele") String tele,
			@RequestParam(value = "numeroPermis", required = false) String numeroPermis,
			@RequestParam(value = "titreProfessionel", required = false) String titreProfessionel,
			@RequestPart(value = "photo", required = false) MultipartFile photoFile,
			@RequestParam("isFirstlogin")boolean isFirstlogin) {
		// Check if the confirm password matches the password entered
		if (!motpasse.equals(confirmMotpasse)) {
			return ResponseEntity.badRequest().body("Password and Confirm Password do not match.");
		}

		try {
			Utilisateur utilisateur = accountService.saveUser(nom, prenom, idRole, mail, sexe, dateNaissance, motpasse,
					confirmMotpasse, adresse, tele, numeroPermis, titreProfessionel, photoFile, isFirstlogin);

			return ResponseEntity.ok(utilisateur);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Failed to register user: " + e.getMessage());
		}
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
    String identifier = request.get("mail");
    String motpasse = request.get("motpasse");

    Optional<Utilisateur> optionalUtilisateur = identifier.contains("@")
        ? utilisateurRepository.findByMail(identifier)
        : utilisateurRepository.findByTele(identifier);

    if (optionalUtilisateur.isEmpty()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Utilisateur introuvable"));
    }

    Utilisateur utilisateur = optionalUtilisateur.get();

    // Vérification du mot de passe avec BCrypt
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    if (!encoder.matches(motpasse, utilisateur.getMotpasse())) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Mot de passe incorrect"));
    }

    // Génération du JWT
    String jwt = Jwts.builder()
            .setSubject(identifier)
            .claim("userId", utilisateur.getIduser())
            .claim("role", utilisateur.getApprole().getNomrole())
            .signWith(jwtKey)
            .compact();

    // Réponse avec token + infos utilisateur
    Map<String, Object> response = new HashMap<>();
    response.put("token", jwt);
    response.put("user", utilisateur);

    return ResponseEntity.ok(response);
}


	@GetMapping("/users")
	public ResponseEntity<List<Utilisateur>> getAllUsers() {
		List<Utilisateur> users = accountService.getALLemp();
		return ResponseEntity.ok(users);
	}

	@GetMapping("/roles")
	public ResponseEntity<List<Role>> getAllRoles() {
		List<Role> roles = accountService.getALLrole();
		return ResponseEntity.ok(roles);
	}

	@GetMapping("/user/me")
	public ResponseEntity<Utilisateur> getCurrentUser(Authentication authentication) {
		String identifier = authentication.getPrincipal().toString();
		Optional<Utilisateur> utilisateur;

		if (identifier.contains("@")) {
			utilisateur = this.utilisateurRepository.findByMail(identifier);
		} else {
			utilisateur = this.utilisateurRepository.findByTele(identifier);
		}

		return utilisateur.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PostMapping("/envoyerDemandeAmi")
	public ResponseEntity<?> envoyerDemandeAmi(@RequestParam String identifiantDe, @RequestParam String identifiantA) {
		boolean resultat = accountService.envoyerDemandeAmi(identifiantDe, identifiantA);
		if (resultat) {
			return ResponseEntity.ok().body("{\"message\": \"Demande d'ami envoyée avec succès\"}");
		} else {
			return ResponseEntity.badRequest().body("{\"error\": \"Échec de l'envoi de la demande d'ami\"}");
		}
	}

	@PostMapping("/notifications")
	public ResponseEntity<?> createNotification(@RequestParam("senderId") String senderId,
			@RequestParam("receiverId") String receiverId, @RequestParam("title") String title,
			@RequestParam("message") String message, @RequestParam("type_notification") String type_notification) {

		boolean result = accountService.createNotification(senderId, receiverId, title, message, type_notification);

		if (result) {
			return ResponseEntity.ok().body("{\"message\": \"Notification créée avec succès\"}");
		} else {
			return ResponseEntity.badRequest().body(
					"{\"error\": \"Échec de la création de la notification. Vérifiez les identifiants des utilisateurs.\"}");
		}
	}

	@GetMapping("/notifications/{receiverId}")
	public ResponseEntity<List<Notification>> getNotificationsByReceiverId(@PathVariable int receiverId) {
		List<Notification> notifications = accountService.getNotificationsByReceiverId(receiverId);
		return ResponseEntity.ok(notifications);
	}

	@PostMapping("/contacts")
	public ResponseEntity<?> createContacts(@RequestParam("senderId") String senderId,
			@RequestParam("receiverId") String receiverId) {

		boolean result = accountService.createContact(senderId, receiverId);

		if (result) {
			return ResponseEntity.ok().body("{\"message\": \"Contact créée avec succès\"}");
		} else {
			return ResponseEntity.badRequest().body(
					"{\"error\": \"Échec de la création de la notification. Vérifiez les identifiants des utilisateurs.\"}");
		}
	}

	@GetMapping("/contacts/{receiverId}")
	public ResponseEntity<List<Contact>> getContactsByReceiver(@PathVariable int receiverId) {
		List<Contact> contact = accountService.getContactsByReceiver(receiverId);
		return ResponseEntity.ok(contact);
	}

	@GetMapping("/contacts/envoyer/{envoyerId}")
	public ResponseEntity<List<Contact>> getContactsByEnvoyer(@PathVariable int envoyerId) {
		List<Contact> contact = accountService.getContactsByEnvoyer(envoyerId);
		return ResponseEntity.ok(contact);
	}

	@GetMapping("/users/by-role")
	public ResponseEntity<List<Utilisateur>> getUsersByRole(@RequestParam("roleId") int roleId) {
	List<Utilisateur> users = accountService.getALLemp();
	List<Utilisateur> filtered = users.stream()
		.filter(user -> user.getApprole() != null && user.getApprole().getId_role() == roleId)
		.collect(Collectors.toList());
	return ResponseEntity.ok(filtered);
}


	/*@PostMapping("/rendezvous")
	public ResponseEntity<RendezVous> createRendezVous(@RequestBody RendezVous rdv) {
    RendezVous savedRdv = rendezVousRepository.save(rdv);
    return ResponseEntity.ok(savedRdv);
}*/



	@PostMapping("/send-email")
	public ResponseEntity<?> sendEmail(@RequestParam("to") String to, @RequestParam("subject") String subject,
			@RequestParam("text") String text) {
		accountService.sendDemandeAmiByMail(to, subject, text);
		return ResponseEntity.ok("Email sent successfully");
	}

	@GetMapping("/receiver/{receiverId}")
	public List<DemandeAmi> getDemandesByReceiver(@PathVariable String receiverId) {
		List<DemandeAmi> demandes = accountService.getDemandesByReceiver(receiverId);
		if (demandes == null || demandes.isEmpty()) {
			System.out.println("Aucune demande en attente trouvée pour l'identifiant spécifié : " + receiverId);
			return null;
		}
		return demandes;
	}

	@PostMapping("/accepter/{idDemandeAmi}")
	public void accepterDemandeAmi(@PathVariable int idDemandeAmi) {
		accountService.accepterDemandeAmi(idDemandeAmi);
	}

	@PostMapping("/refuser/{idDemandeAmi}")
	public void refuserDemandeAmi(@PathVariable int idDemandeAmi) {
		accountService.refuserDemandeAmi(idDemandeAmi);
	}

	@PostMapping("/rappel")
	public Rappel createRappel(@RequestBody Rappel rappel) {
		return service.createRappel(rappel);
	}

	@PutMapping("/user/update")
	public ResponseEntity<Utilisateur> updateUser(@RequestParam("id") int id,
			@RequestParam(value = "nom", required = false) String nom,
			@RequestParam(value = "prenom", required = false) String prenom,
			@RequestParam(value = "mail", required = false) String mail,
			@RequestParam(value = "sexe", required = false) String sexe,
			@RequestParam(value = "date_naissance", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date date_naissance,
			@RequestParam(value = "motpasse", required = false) String motpasse,
			@RequestParam(value = "adresse", required = false) String adresse,
			@RequestParam(value = "tele", required = false) String tele,
			@RequestParam(value = "numero_permis", required = false) String numero_permis,
			@RequestParam(value = "titre_professionel", required = false) String titre_professionel,
			@RequestParam(value = "photo", required = false) MultipartFile photoFile) {

		try {
			Utilisateur updatedUser = accountService.updateUser(id, nom, prenom, mail, sexe, date_naissance, motpasse,
					adresse, tele, numero_permis, titre_professionel, photoFile);
			return ResponseEntity.ok(updatedUser);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}

	@GetMapping
	public List<Rappel> getAllRappels() {
		return service.getAllRappels();
	}

	@PostMapping("/notifications/{id}")
	public void lireNotification(@PathVariable int id) {
		accountService.LireNotification(id);
	}

	@GetMapping("/check/{userId}")
	public ResponseEntity<?> checkExistingFriendRequest(@PathVariable int userId, @RequestParam String contact) {
		try {
			boolean exists = accountService.checkExistingRequest(userId, contact);
			return ResponseEntity.ok(exists);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@DeleteMapping("/delete")
	public ResponseEntity<String> deleteContact(@RequestParam int envoyeurId, @RequestParam int receveurId) {
		Utilisateur envoyeur = new Utilisateur();
		envoyeur.setIduser(envoyeurId);

		Utilisateur receveur = new Utilisateur();
		receveur.setIduser(receveurId);

		accountService.deleteContact(envoyeur, receveur);
		return ResponseEntity.ok("Contact deleted successfully");
	}

	@GetMapping("/rappels")
	public ResponseEntity<List<Rappel>> getUserRappels(Authentication authentication) {
		String identifier = authentication.getPrincipal().toString();
		Optional<Utilisateur> utilisateur;

		if (identifier.contains("@")) {
			utilisateur = utilisateurRepository.findByMail(identifier);
		} else {
			utilisateur = utilisateurRepository.findByTele(identifier);
		}

		if (utilisateur.isPresent()) {
			LocalDate today = LocalDate.now();
			List<Rappel> rappels = accountService.getRappelsByDate(today, utilisateur.get());

			return ResponseEntity.ok(rappels);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@GetMapping("/rappels/proche")
	public ResponseEntity<List<Rappel>> getUserRappelsProche(Authentication authentication) {
		String identifier = authentication.getPrincipal().toString();
		Optional<Utilisateur> utilisateur;

		if (identifier.contains("@")) {
			utilisateur = utilisateurRepository.findByMail(identifier);
		} else {
			utilisateur = utilisateurRepository.findByTele(identifier);
		}

		if (utilisateur.isPresent()) {
			LocalDate today = LocalDate.now();
			List<Rappel> rappels = accountService.getRappelsByDateproche(today, utilisateur.get());

			return ResponseEntity.ok(rappels);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@GetMapping("/rappels/procheupdate")
	public ResponseEntity<List<Rappel>> getUserRappelsProcheUpdate(Authentication authentication) {
		String identifier = authentication.getPrincipal().toString();
		Optional<Utilisateur> utilisateur;

		if (identifier.contains("@")) {
			utilisateur = utilisateurRepository.findByMail(identifier);
		} else {
			utilisateur = utilisateurRepository.findByTele(identifier);
		}

		if (utilisateur.isPresent()) {
			LocalDate today = LocalDate.now();
			List<Rappel> rappels = accountService.getRappelsByDateprocheUpdate(today, utilisateur.get());

			return ResponseEntity.ok(rappels);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@PutMapping("/rappels/{id}/status")
	public ResponseEntity<Rappel> updateRappelStatus(@PathVariable int id, @RequestBody Map<String, String> request) {

		String statusStr = request.get("status");
		if (statusStr == null) {
			return ResponseEntity.badRequest().build();
		}

		Rappel.RappelStatus status;
		try {
			status = Rappel.RappelStatus.valueOf(statusStr);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().build();
		}

		return rappelRepository.findById(id).map(rappel -> {
			rappel.setStatut(status);
			rappelRepository.save(rappel);
			return ResponseEntity.ok(rappel);
		}).orElse(ResponseEntity.notFound().build());
	}

	@PutMapping("/rappels/{id}/statutProche")
	public ResponseEntity<Rappel> updateRappelStatusProche(@PathVariable int id) {

		Optional<Rappel> updatedRappel = accountService.updateRappelStatusProche(id, RappelStatusProche.confirmation);
		return updatedRappel.map(rappel -> ResponseEntity.ok(rappel))
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@GetMapping("/fonctionnalite/{userId}")
	public ResponseEntity<List<Fonctionnalite>> getFonctionnalitesForUserApplique(@PathVariable int userId) {
		List<Fonctionnalite> fonctionnalites = accountService.getFonctionnalitesForUserApplique(userId);
		return ResponseEntity.ok(fonctionnalites);
	}

	@PostMapping("/fonctionnalite/applique")
	public ResponseEntity<Fonctionnalite> createOrUpdateFonctionnalite(@RequestBody Fonctionnalite fonctionnalite) {
		Fonctionnalite savedFonctionnalite = accountService.createOrUpdateFonctionnalite(fonctionnalite);
		return ResponseEntity.ok(savedFonctionnalite);
	}




	// Endpoint de déconnexion
	@PostMapping("/logout")
	public ResponseEntity<String> logout(@RequestBody LogoutRequest logoutRequest) {
		int userId = logoutRequest.getUserId();
		utilisateurService.updateOnlineStatus(userId, false); // Set isOnline to false
		System.out.println("User " + userId + " logged out and set isOnline to false");
		return ResponseEntity.ok("User logged out and offline");
	}

	// Classe interne pour le corps de la requête de déconnexion
	public static class LogoutRequest {
		private int userId;

		public int getUserId() {
			return userId;
		}

		public void setUserId(int userId) {
			this.userId = userId;
		}
	}
	
	// endpoint pour mettre à jour firstlogin 
	@PutMapping("user/statutfirstlogin/{userId}")
	public ResponseEntity<String> updateUserFirstlogin (@PathVariable int userId, 
			@RequestParam(value = "isFirstlogin") boolean isFirstlogin ){
		
		utilisateurService.updateFirstlogin( userId, isFirstlogin);
		
		
		return ResponseEntity.ok("User set isFirstlogin");
		
	}
	
	@PutMapping("user/addFonctionnalites/{userId}")
	public ResponseEntity<String> addFonctionnalitesforuser(@PathVariable int userId,@RequestBody List<NomFonctionnalite> fonctionnalites) { 
		
		// @RequestBody List<FonctionnaliteRequest> fonctionnalitesreqest
//		List<NomFonctionnalite> fonctionnalites = fonctionnalitesreqest.stream()
//                .map(dto -> NomfonctionnaliteRepository.findById(dto.getId_fonctionnalite())
//                        .orElseThrow(() -> new RuntimeException("Fonctionnalité non trouvée : " + dto.getId_fonctionnalite())))
//                .collect(Collectors.toList());
//		
		utilisateurService.addFonctionnaliteforuserBeneficiaire(userId, fonctionnalites);
		
		return ResponseEntity.ok("User set fonctionnalites ");
	}
	
	@GetMapping("user/Fonctionnalites/{userId}")
	public ResponseEntity<List<NomFonctionnalite>> getFonctionnalitesforuser(@PathVariable(name = "userId")  int userId){
		
		List<NomFonctionnalite> fonctionnalites= utilisateurService.getFonctionnalitesforuserBeneficiaire(userId);
		
		return ResponseEntity.ok(fonctionnalites); 
	}
	
	
	
//	public static class FonctionnaliteRequest {
//	    private int id_fonctionnalite;
//	    private String nom_fonctionnalite;
//
//	    // Getters et setters
//	    public int getId_fonctionnalite() {
//	        return id_fonctionnalite;
//	    }
//
//	    public void setId_fonctionnalite(int id_fonctionnalite) {
//	        this.id_fonctionnalite = id_fonctionnalite;
//	    }
//
//	    public String getNom_fonctionnalite() {
//	        return nom_fonctionnalite;
//	    }
//
//	    public void setNom_fonctionnalite(String nom_fonctionnalite) {
//	        this.nom_fonctionnalite = nom_fonctionnalite;
//	    }
//	}


	@GetMapping("/rappels/beneficiaire/{userId}")
	public List<Rappel> getRappelsForBeneficiaire(@PathVariable int userId) {
		// Get the identifier of the authenticated user (e.g., email, username)

		// Return the list of rappels for the found Utilisateur
		return accountService.getRappelsForBeneficiaire(userId);
	}

	@DeleteMapping("/deletedemandeami")
	public ResponseEntity<String> deleteContact(@RequestParam int envoyeurId, @RequestParam String contact) {
		Utilisateur envoyeur = new Utilisateur();
		envoyeur.setIduser(envoyeurId);

		accountService.deleteDemandeAmi(envoyeur, contact);
		return ResponseEntity.ok("Contact deleted successfully");
	}
	
	
	
}