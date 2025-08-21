package com.ihm.web;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ihm.dao.RendezVousRepository;
import com.ihm.dao.UtilisateurRepository;
import com.ihm.entites.RendezVous;
import com.ihm.entites.Utilisateur;
import com.ihm.dto.RendezVousDTO;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rendezvous")
@CrossOrigin(origins = "*")
public class RendezVousController {

    @Autowired
    private RendezVousRepository rendezVousRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @GetMapping
    public List<RendezVous> getAll() {
        return rendezVousRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody RendezVousDTO dto) {
        try {
            RendezVous rdv = new RendezVous();
            rdv.setMotif(dto.getMotif());
            rdv.setStatut(dto.getStatut());
            

            LocalDateTime date = LocalDateTime.parse(dto.getDate(), DateTimeFormatter.ISO_DATE_TIME);
            rdv.setDate(date);

            // Charger les utilisateurs liés
            Optional<Utilisateur> beneficiaire = utilisateurRepository.findById(dto.getBeneficiaireId());
            Optional<Utilisateur> prestataire = utilisateurRepository.findById(dto.getPrestataireId());

            if (beneficiaire.isPresent()) {
                rdv.setBeneficiaire(beneficiaire.get());
            }

            if (prestataire.isPresent()) {
                rdv.setPrestataire(prestataire.get());
            }

            RendezVous saved = rendezVousRepository.save(rdv);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur d'enregistrement : " + e.getMessage());
        }
    }
}
