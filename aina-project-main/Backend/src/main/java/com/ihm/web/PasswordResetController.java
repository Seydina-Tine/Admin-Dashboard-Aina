package com.ihm.web;



import com.ihm.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
public class PasswordResetController {

    private static final Logger logger = LoggerFactory.getLogger(PasswordResetController.class);

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        logger.debug("Requête reçue pour /forgot-password avec email: {}", email);
        try {
            passwordResetService.sendPasswordResetCode(email);
            return ResponseEntity.ok("Code de réinitialisation de mot de passe envoyé");
        } catch (Exception e) {
            logger.error("Erreur lors de la demande de réinitialisation de mot de passe", e);
            return ResponseEntity.status(400).body("Erreur: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String code, @RequestParam String newPassword) {
        logger.debug("Requête reçue pour /reset-password avec code: {} et newPassword: {}", code, newPassword);
        try {
            passwordResetService.resetPassword(code, newPassword);
            return ResponseEntity.ok("Mot de passe réinitialisé avec succès");
        } catch (Exception e) {
            logger.error("Erreur lors de la réinitialisation du mot de passe", e);
            return ResponseEntity.status(400).body("Erreur: " + e.getMessage());
        }
    }
}
