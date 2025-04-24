package com.ihm.service;




import com.ihm.entites.Utilisateur;
import com.ihm.dao.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PasswordResetService {

    private static final Logger logger = LoggerFactory.getLogger(PasswordResetService.class);

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private JavaMailSender mailSender;
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Transactional
    public void sendPasswordResetCode(String email) {
        Utilisateur utilisateur = utilisateurRepository.findByMail(email).orElseThrow(
            () -> new UsernameNotFoundException("Utilisateur non trouvé avec l'email : " + email)
        );

        String code = String.valueOf((int) (Math.random() * 900000) + 100000); // Code à 6 chiffres
        utilisateur.setResetCode(code);
        utilisateur.setCodeExpiry(Instant.now().plusSeconds(3600)); // Expire dans 1 heure

        logger.info("Avant l'appel à save(): resetCode={}, codeExpiry={}", utilisateur.getResetCode(), utilisateur.getCodeExpiry());

        utilisateurRepository.save(utilisateur);

        logger.info("Après l'appel à save(): resetCode={}, codeExpiry={}", utilisateur.getResetCode(), utilisateur.getCodeExpiry());

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(utilisateur.getMail());
        message.setSubject("Code de réinitialisation de mot de passe");
        message.setText("Votre code de réinitialisation est : " + code);

        try {
            mailSender.send(message);
            logger.info("Email de réinitialisation de mot de passe envoyé à {}", email);
        } catch (Exception e) {
            logger.error("Erreur lors de l'envoi de l'email", e);
            throw new RuntimeException("Erreur lors de l'envoi de l'email", e);
        }
    }

    @Transactional
    public void resetPassword(String code, String newPassword) {
        Utilisateur utilisateur = utilisateurRepository.findByResetCode(code).orElseThrow(
            () -> new RuntimeException("Code de réinitialisation invalide ou expiré")
        );

        if (utilisateur.getCodeExpiry().isBefore(Instant.now())) {
            throw new RuntimeException("Code de réinitialisation invalide ou expiré");
        }

        utilisateur.setMotpasse(bCryptPasswordEncoder.encode(newPassword));

      //  utilisateur.setMotpasse(newPassword);
        utilisateur.setResetCode(null);
        utilisateur.setCodeExpiry(null);
        utilisateurRepository.save(utilisateur);
    }
}
