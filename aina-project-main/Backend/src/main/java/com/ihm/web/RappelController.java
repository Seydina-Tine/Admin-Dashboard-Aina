package com.ihm.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ihm.entites.Rappel;
import com.ihm.service.RappelService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rappels")
public class RappelController {
    @Autowired
    private RappelService rappelService;

    @PostMapping("/rappel")
    public ResponseEntity<Rappel> createRappel(@RequestBody Rappel rappel) {
        Rappel savedRappel = rappelService.createRappel(rappel);
        return ResponseEntity.ok(savedRappel);
    }

    @GetMapping
    public ResponseEntity<List<Rappel>> getAllRappels() {
        List<Rappel> rappels = rappelService.getAllRappels();
        return ResponseEntity.ok(rappels);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rappel> getRappelById(@PathVariable int id) {
        Optional<Rappel> rappel = rappelService.getRappelById(id);
        return rappel.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRappel(@PathVariable int id) {
        rappelService.deleteRappel(id);
        return ResponseEntity.noContent().build();
    }
    
    
    @PutMapping("/{id}")
    public ResponseEntity<Rappel> updateRappel(@PathVariable int id, @RequestBody Rappel rappel) {
        try {
            Rappel updatedRappel = rappelService.updateRappel(id, rappel);
            return ResponseEntity.ok(updatedRappel);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
