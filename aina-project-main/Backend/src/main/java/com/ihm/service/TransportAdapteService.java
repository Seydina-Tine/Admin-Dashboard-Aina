package com.ihm.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ihm.dao.PlanningRepository;
import com.ihm.dao.TransportAdapteRepository;
import com.ihm.entites.Pharmacy;
import com.ihm.entites.Planning;
import com.ihm.entites.TransportAdapte;
import java.util.Optional;



@Service
public class TransportAdapteService {

		@Autowired
		 private TransportAdapteRepository transportAdapteRepository;
		
		@Autowired
		private PlanningService planningservice;
		
		 public TransportAdapteService(TransportAdapteRepository transportAdapteRepository) {
			super();
			this.transportAdapteRepository = transportAdapteRepository;
		}
		
		 // Recuperer la liste des transport adapte pour un proche aidant et un beneficiaire
		 public List<TransportAdapte> getTransportAdapteByuser(Long contactId, Long userbeneficiaire ){
			
			return transportAdapteRepository.findByContactIdOrUserBeneficiaire(contactId,userbeneficiaire);
		}
		 
		 // recuperer la liste des transports adaptes pour un beneficiaire 
		 public List<TransportAdapte> getTransportAdapteByuserbeneficiaire(Long userbeneficiaire){
			 
			 return transportAdapteRepository.findByUserBeneficiaire(userbeneficiaire);
		 } 
		 
		 // Ajouter un transport Adapte 
		 public TransportAdapte AddTransportAdapte(TransportAdapte transportAdapte){
			 
			 Planning planningServiceClient= transportAdapte.getHorairesServiceclient(); // Recuperer les horaires du service client  
			 Planning planningDeplacement= transportAdapte.getHorairesDeplacement();	// Recuperer les horaires du service de deplacement 	
			 
			 
			 
			 if (planningServiceClient != null) {
			// Rechercher s'il existe deja un planning dans la base de donnees avec les horaires identique aux horaires du service client pour eviter les  dupplications d'horaires
			 Planning horaireServiceClient= planningservice.getHorairesfromTransport(planningServiceClient.getHoraires());    
			 if (horaireServiceClient != null) {
				 
					// Si on trouve un planning deja dans la base de donnees avec des horaires identiques a celles du service client on attribue juste ce planning au transport adapte qu'on souhaite ajouter  
						 System.out.println("un planning pour le service client existe deja  ");
						 transportAdapte.setHorairesServiceclient(horaireServiceClient);
					 }
			 }
			
			 if (planningDeplacement != null) {
			 // Rechercher s'il existe deja un planning dans la base de donnees avec les horaires identique aux horaires du service de deplacement pour eviter les  dupplications d'horaires
			 Planning horaireDeplacement= planningservice.getHorairesfromTransport(planningDeplacement.getHoraires());
			 
			
			 
			 if (horaireDeplacement != null) {
			
				// Si on trouve un planning deja dans la base de donnees avec des horaires identiques a celles du service de deplacement on attribue juste ce planning au transport adapte qu'on souhaite ajouter
				 System.out.println("un planning pour le service de deplacement existe deja  ");
				 transportAdapte.setHorairesDeplacement(horaireDeplacement);
			 
			 }
			 } 
			 
			 return transportAdapteRepository.save(transportAdapte);
		 }
		 
		 // Supprimer un transport adapte
		 public void deleteTransportAdapte(Long id){
			 
			 transportAdapteRepository.deleteById(id);
		 }
		
		 // update un transport adapte 
		 public TransportAdapte updateTransportAdapte(Long id, TransportAdapte transportAdapte) {
			 
			 Optional<TransportAdapte> optionaltransportAdapte= transportAdapteRepository.findById(id);
			 
			 
			 
			if(optionaltransportAdapte.isPresent()) {
				
			 TransportAdapte transport= optionaltransportAdapte.get(); 
			 
			 Planning planningServiceClient= transportAdapte.getHorairesServiceclient(); // Recuperer les horaires du service client  
			 Planning planningDeplacement= transportAdapte.getHorairesDeplacement();	// Recuperer les horaires du service de deplacement 	
			 
			 
			 if (planningServiceClient != null) {
					
				 // Rechercher s'il existe deja un planning dans la base de donnees avec les horaires identique aux horaires du service client pour eviter les  dupplications d'horaires
					 Planning horaireServiceClient= planningservice.getHorairesfromTransport(planningServiceClient.getHoraires());    
					 if (horaireServiceClient != null) {
						 
							// Si on trouve un planning deja dans la base de donnees avec des horaires identiques a celles du service client on attribue juste ce planning au transport adapte qu'on souhaite modifier  
								 System.out.println("un planning pour le service client existe deja  ");
								 transport.setHorairesServiceclient(horaireServiceClient);
					}
					 else { 
						 
						 // si on ne trouve pas un planning deja existant dans la base de donnees on attribue juste le nouveau planning au transport qu'on souhaite modifier
						 transport.setHorairesServiceclient(transportAdapte.getHorairesServiceclient());
						 
					 }
					 }
					
					 if (planningDeplacement != null) {
					 // Rechercher s'il existe deja un planning dans la base de donnees avec les horaires identique aux horaires du service de deplacement pour eviter les  dupplications d'horaires
					 Planning horaireDeplacement= planningservice.getHorairesfromTransport(planningDeplacement.getHoraires());
					 
					
					 
					 if (horaireDeplacement != null) {
					
						// Si on trouve un planning deja dans la base de donnees avec des horaires identiques a celles du service de deplacement on attribue juste ce planning au transport adapte qu'on souhaite modifier
						 System.out.println("un planning pour le service de deplacement existe deja  ");
						 transport.setHorairesDeplacement(horaireDeplacement);
					 
					 }
					 
					 else {
						 
						 //si on ne trouve pas un planning deja existant dans la base de donnees on attribue juste le nouveau planning au transport qu'on souhaite modifier
						 
						 transport.setHorairesDeplacement(transportAdapte.getHorairesDeplacement());
						 } 
			 
					 }
			 
			 transport.setName(transportAdapte.getName());
			 transport.setPhoneNumber(transportAdapte.getPhoneNumber());
			 transport.setNumero_poste(transportAdapte.getNumero_poste());
			 
			 return transportAdapteRepository.save(transport);
			 
			 
			 
			 
		 }
			
				else {				throw new RuntimeException(" Transport Adapte Non trouve");
			}
	    }
		 
}

