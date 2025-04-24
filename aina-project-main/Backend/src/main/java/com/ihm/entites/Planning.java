package com.ihm.entites;

import java.time.LocalTime;
import java.util.List;

import javax.persistence.ElementCollection;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

//import com.ihm.entites.TransportAdapte.Horaire.Jour;

@Entity
public class Planning {
	
	
	 @Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Long id;
	
	 @ElementCollection
	 private List<Horaire> horaires;
	 
	public Long getId() {
		return id;
	}



	public void setId(Long id) {
		this.id = id;
	}



	public List<Horaire> getHoraires() {
		return horaires;
	}



	public void setHoraires(List<Horaire> horaires) {
		this.horaires = horaires;
	}



//	@Embeddable
//	public static class Horaire{
//		
//		    
//	        
//	        
//	 }
	
	

}
