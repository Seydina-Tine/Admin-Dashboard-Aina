package com.ihm.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ihm.dao.RendezVousRepository;
import com.ihm.entites.RendezVous;

@RestController
@RequestMapping("/api/rendezvous")
@CrossOrigin(origins = "*")
public class RendezVousController {

    @Autowired
    private RendezVousRepository rendezVousRepository;

    @GetMapping
    public List<RendezVous> getAll() {
        return rendezVousRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<RendezVous> create(@RequestBody RendezVous rdv) {
        RendezVous saved = rendezVousRepository.save(rdv);
        return ResponseEntity.ok(saved);
    }
}
