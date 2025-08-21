// DTO: RendezVousDTO.java
package com.ihm.dto;

public class RendezVousDTO {
    private String date;
    private String motif;
    private String statut;
    private Integer beneficiaireId;
    private Integer aidantId; // Optionnel si plus tard tu veux lier un proche aidant
    private Integer prestataireId;

    // Getters & setters
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public Integer getBeneficiaireId() { return beneficiaireId; }
    public void setBeneficiaireId(Integer beneficiaireId) { this.beneficiaireId = beneficiaireId; }

    public Integer getAidantId() { return aidantId; }
    public void setAidantId(Integer aidantId) { this.aidantId = aidantId; }

    public Integer getPrestataireId() { return prestataireId; }
    public void setPrestataireId(Integer prestataireId) { this.prestataireId = prestataireId; }
}
