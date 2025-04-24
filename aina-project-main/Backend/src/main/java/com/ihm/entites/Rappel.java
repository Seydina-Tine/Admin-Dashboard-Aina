package com.ihm.entites;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.ihm.entites.Notification.NotificationStatus;

@Entity
@Table(name = "Rappel")
public class Rappel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private String titreRappel;

	private LocalDate reminderDate;
	private LocalTime reminderTime;

	private int minutesrappel;

	@ManyToOne
	@JoinColumn(name = "id_userbenficiare", nullable = true)
	private Utilisateur utilisateurbenficiaire;

	@ManyToOne
	@JoinColumn(name = "id_userproche", nullable = true)
	private Utilisateur utilisateurprocheaidan;

	private String category;
	private String frequency;
	private String rdvText;
	private String medicamentText;
	private String otherCategoryText;

	@ElementCollection
	private List<String> selectedDays;

	private RappelStatus statut;

	private RappelStatusProche statutProche;

	public static enum RappelStatus {
		enattente, accepte, refuse
	}

	public static enum RappelStatusProche {
		enattente, confirmation,
	}

	// Getters et setters
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public RappelStatus getStatut() {
		return statut;
	}

	public void setStatut(RappelStatus statut) {
		this.statut = statut;
	}

	public String getTitreRappel() {
		return titreRappel;
	}

	public void setTitreRappel(String titreRappel) {
		this.titreRappel = titreRappel;
	}

	public LocalDate getReminderDate() {
		return reminderDate;
	}

	public void setReminderDate(LocalDate reminderDate) {
		this.reminderDate = reminderDate;
	}

	public LocalTime getReminderTime() {
		return reminderTime;
	}

	public void setReminderTime(LocalTime reminderTime) {
		this.reminderTime = reminderTime;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getFrequency() {
		return frequency;
	}

	public void setFrequency(String frequency) {
		this.frequency = frequency;
	}

	public String getRdvText() {
		return rdvText;
	}

	public void setRdvText(String rdvText) {
		this.rdvText = rdvText;
	}

	public String getMedicamentText() {
		return medicamentText;
	}

	public void setMedicamentText(String medicamentText) {
		this.medicamentText = medicamentText;
	}

	public String getOtherCategoryText() {
		return otherCategoryText;
	}

	public void setOtherCategoryText(String otherCategoryText) {
		this.otherCategoryText = otherCategoryText;
	}

	public List<String> getSelectedDays() {
		return selectedDays;
	}

	public void setSelectedDays(List<String> selectedDays) {
		this.selectedDays = selectedDays;
	}

	public LocalTime getRappelTime() {
		return reminderTime;
	}

	public Rappel() {
		this.statut = RappelStatus.enattente;
		this.statutProche = RappelStatusProche.enattente;
	}

	public Utilisateur getUtilisateurbenficiaire() {
		return utilisateurbenficiaire;
	}

	public void setUtilisateurbenficiaire(Utilisateur utilisateurbenficiaire) {
		this.utilisateurbenficiaire = utilisateurbenficiaire;
	}

	public RappelStatusProche getStatutProche() {
		return statutProche;
	}

	public void setStatutProche(RappelStatusProche statutProche) {
		this.statutProche = statutProche;
	}

	public Utilisateur getUtilisateurprocheaidan() {
		return utilisateurprocheaidan;
	}

	public void setUtilisateurprocheaidan(Utilisateur utilisateurprocheaidan) {
		this.utilisateurprocheaidan = utilisateurprocheaidan;
	}

	public int getMinutesrappel() {
		return minutesrappel;
	}

	public void setMinutesrappel(int minutesrappel) {
		this.minutesrappel = minutesrappel;
	}

}
