package com.ihm.service;

import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.ihm.entites.Rappel;
import java.util.List;

@Service
public class RappelScheduler {

    @Autowired
    private RappelService rappelService;

    @Scheduled(fixedRate = 60000) // Exécuter toutes les minutes
    public void sendReminders() {
        LocalTime now = LocalTime.now();
        List<Rappel> rappels = rappelService.getUpcomingRappels(now);
        
        for (Rappel rappel : rappels) {
            // Envoyer la notification (ici simplement affichée dans la console)
            System.out.println("Rappel: " + rappel.getTitreRappel());
            
            // Vous pouvez intégrer une méthode pour envoyer des notifications via un service de messagerie
        }
    }
}
