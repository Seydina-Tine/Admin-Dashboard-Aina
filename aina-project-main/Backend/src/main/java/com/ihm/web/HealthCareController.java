package com.ihm.web;




import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ihm.entites.HealthCare;
import com.ihm.service.HealthCareService;

import java.util.List;

@RestController
@RequestMapping("/api/healthcare")
public class HealthCareController {

    @Autowired
    private HealthCareService healthCareService;

    // Combiner les deux méthodes @GetMapping en une seule en rendant certains paramètres optionnels
    @GetMapping
    public ResponseEntity<List<HealthCare>> getHealthCares(@RequestParam(required = false) Long contactId, @RequestParam Long userBeneficiaire) {
        List<HealthCare> healthCares;
        if (contactId != null) {
            healthCares = healthCareService.getHealthCaresByUser(contactId, userBeneficiaire);
        } else {
            healthCares = healthCareService.getHealthCaresByUserSelection(userBeneficiaire);
        }
        return ResponseEntity.ok(healthCares);
    }

    @PostMapping("/add")
    public ResponseEntity<HealthCare> addHealthCare(@RequestBody HealthCare healthCare) {
        HealthCare newHealthCare = healthCareService.addHealthCare(healthCare);
        return ResponseEntity.ok(newHealthCare);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<HealthCare> updateHealthCare(@PathVariable Long id, @RequestBody HealthCare healthCareDetails) {
        HealthCare updatedHealthCare = healthCareService.updateHealthCare(id, healthCareDetails);
        return ResponseEntity.ok(updatedHealthCare);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHealthCare(@PathVariable Long id) {
        healthCareService.deleteHealthCare(id);
        return ResponseEntity.noContent().build();
    }
}
