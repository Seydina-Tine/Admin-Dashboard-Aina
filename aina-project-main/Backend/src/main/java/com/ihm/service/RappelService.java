package com.ihm.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ihm.dao.RappelRepository;
import com.ihm.entites.Rappel;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RappelService {

    @Autowired
    private RappelRepository rappelRepository;

    public Rappel createRappel(Rappel rappel) {
        return rappelRepository.save(rappel);
    }

    public List<Rappel> getAllRappels() {
        return rappelRepository.findAll();
    }
    
    
    public Optional<Rappel> getRappelById(int id) {
        return rappelRepository.findById(id);
    }

    public void deleteRappel(int id) {
        rappelRepository.deleteById(id);
    }
    
    
    public Rappel updateRappel(int id, Rappel newRappel) throws Exception {
        return rappelRepository.findById(id).map(rappel -> {
          //  rappel.setMessage(newRappel.getMessage());
        	rappel.setReminderDate(newRappel.getReminderDate());
            rappel.setReminderTime(newRappel.getReminderTime());
            rappel.setCategory(newRappel.getCategory());
            rappel.setFrequency(newRappel.getFrequency());
            rappel.setRdvText(newRappel.getRdvText());
            rappel.setMedicamentText(newRappel.getMedicamentText());
            return rappelRepository.save(rappel);
        }).orElseThrow(() -> new Exception("Rappel not found"));
    }

    public List<Rappel> getUpcomingRappels(LocalTime now) {
        return rappelRepository.findAll().stream()
            .filter(rappel -> rappel.getRappelTime().minusMinutes(10).isBefore(now) && rappel.getRappelTime().isAfter(now))
            .collect(Collectors.toList());
    }
}
