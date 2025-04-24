package com.ihm.web;


import com.ihm.entites.HealthCare;
import com.ihm.entites.Pharmacy;
import com.ihm.service.PharmacyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/pharmacy")
public class PharmacyController {
    @Autowired
    private PharmacyService pharmacyService;
    
    
    
 // Combiner les deux méthodes @GetMapping en une seule en rendant certains paramètres optionnels
    @GetMapping
    public ResponseEntity<List<Pharmacy>> getPharmacies(@RequestParam(required = false) Long contactId, @RequestParam Long userBeneficiaire) {
        List<Pharmacy> pharmacies;
        if (contactId != null) {
        	pharmacies = pharmacyService.getPharmaciesByUser(contactId, userBeneficiaire);
        } else {
        	pharmacies = pharmacyService.getPharmaciesByUserSelection(userBeneficiaire);
        }
        return ResponseEntity.ok(pharmacies);
    }
    
    
    
    /*

    @GetMapping
    public ResponseEntity<List<Pharmacy>> getPharmacies(@RequestParam Long contactId, @RequestParam Long userBeneficiaire) {
        List<Pharmacy> pharmacies = pharmacyService.getPharmaciesByUser(contactId, userBeneficiaire);
        return ResponseEntity.ok(pharmacies);
    }
 
 
 */
    @PostMapping("/add")
    public ResponseEntity<Pharmacy> addPharmacy(@RequestBody Pharmacy pharmacy) {
        Pharmacy savedPharmacy = pharmacyService.addPharmacy(pharmacy);
        return ResponseEntity.ok(savedPharmacy);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pharmacy> updatePharmacy(@PathVariable Long id, @RequestBody Pharmacy pharmacy){
    	
    	Pharmacy updatepharmacy = pharmacyService.updatePharmacy(id, pharmacy);
    	return ResponseEntity.ok(updatepharmacy);
    	
    }
    
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePharmacy(@PathVariable Long id) {
        pharmacyService.deletePharmacy(id);
        return ResponseEntity.noContent().build();
    }
}