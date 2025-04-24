package com.ihm.entites;

import java.time.LocalTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;



@Entity
public class TransportAdapte {
	
	 @Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Long id;
	 private String name;
	 private String PhoneNumber;
	 private String Numero_poste;
	 
//	 @ElementCollection
//	 private List<Horaire> horairesServiceclient;
//	 
//	 @ElementCollection
//	 private List<Horaire> horairesDeplacement;
	 
	 @ManyToOne(cascade = CascadeType.PERSIST)
	 @JoinColumn(name = "id_horairesServiceclient", nullable = true)
	 private Planning horairesServiceclient;
	 
	 @ManyToOne(cascade = CascadeType.PERSIST)
	 @JoinColumn(name = "id_horairesDeplacement", nullable = true)
	 private Planning horairesDeplacement;
	 

	 private Long userBeneficiaire;
	 private Long contactId; // id du proche aidant associe a la personne beneficiaire  
	 
	  
	 public Long getId() {
		return id;
	}





	public void setId(Long id) {
		this.id = id;
	}





	public String getName() {
		return name;
	}





	public void setName(String name) {
		this.name = name;
	}





	public String getPhoneNumber() {
		return PhoneNumber;
	}





	public void setPhoneNumber(String phoneNumber) {
		PhoneNumber = phoneNumber;
	}





	public String getNumero_poste() {
		return Numero_poste;
	}





	public void setNumero_poste(String numero_poste) {
		Numero_poste = numero_poste;
	}





	public Long getUserBeneficiaire() {
		return userBeneficiaire;
	}





	public void setUserbeneficiaire(Long userbeneficiaire) {
		this.userBeneficiaire = userbeneficiaire;
	}





	public Long getContactId() {
		return contactId;
	}





	public void setContactId(Long contactId) {
		this.contactId = contactId;
	}





	public Planning getHorairesServiceclient() {
		return horairesServiceclient;
	}





	public void setHorairesServiceclient(Planning horairesServiceclient) {
		this.horairesServiceclient = horairesServiceclient;
	}





	public Planning getHorairesDeplacement() {
		return horairesDeplacement;
	}





	public void setHorairesDeplacement(Planning horairesDeplacement) {
		this.horairesDeplacement = horairesDeplacement;
	}





	public void setUserBeneficiaire(Long userBeneficiaire) {
		this.userBeneficiaire = userBeneficiaire;
	}

   

	



	
	

}
