package com.ihm.entites;

import java.time.Instant;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

@Entity
@Table(name = "utilisateur")
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "iduser")
    private int iduser;

    private String nom;
    private String prenom;

    @Column(nullable = true)
    private String mail;

    @Column(nullable = true)
    private String sexe;

    @Column(nullable = true)
    private Date date_naissance;

    @JsonProperty(access = Access.WRITE_ONLY)
    private String motpasse;

    @Column(nullable = true)
    private String adresse;

    private String tele;

    @Column(nullable = true)
    private String numero_permis;

    @Column(nullable = true)
    private String titre_professionel;

    @Transient
    private String confirmPassword;

    @Column(nullable = true)
    private String photoUrl;

    @ManyToOne
    @JoinColumn(name = "id_role")
    private Role approle;

    @Column(name = "reset_code", nullable = true)
    private String resetCode;

    @Column(name = "code_expiry", nullable = true)
    private Instant codeExpiry;

    @Column(name = "is_online")
    private Boolean isOnline = false;

    private boolean isFirstlogin;

    @ManyToMany
    @JoinTable(
        name = "UserBeneficaire_Nomfonctionnalite",
        joinColumns = @JoinColumn(name = "id_userbeneficiare"),
        inverseJoinColumns = @JoinColumn(name = "id_fonctionnalite")
    )
    private List<NomFonctionnalite> fonctionnalites;

    // Ajout de la relation prestataire <-> bénéficiaires
    @ManyToMany
    @JoinTable(
        name = "prestataire_beneficiaire",
        joinColumns = @JoinColumn(name = "id_prestataire"),
        inverseJoinColumns = @JoinColumn(name = "id_beneficiaire")
    )
    private List<Utilisateur> beneficiaires;

    // Getters and Setters

    public int getIduser() {
        return iduser;
    }

    public void setIduser(int iduser) {
        this.iduser = iduser;
    }

    public boolean isFirstlogin() {
        return isFirstlogin;
    }

    public void setFirstlogin(boolean isFirstlogin) {
        this.isFirstlogin = isFirstlogin;
    }

    public List<NomFonctionnalite> getFonctionnalites() {
        return this.fonctionnalites;
    }

    public void setFonctionnalites(List<NomFonctionnalite> fonctionnalites) {
        this.fonctionnalites = fonctionnalites;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getSexe() {
        return sexe;
    }

    public void setSexe(String sexe) {
        this.sexe = sexe;
    }

    public Date getDate_naissance() {
        return date_naissance;
    }

    public void setDate_naissance(Date date_naissance) {
        this.date_naissance = date_naissance;
    }

    public String getMotpasse() {
        return motpasse;
    }

    public void setMotpasse(String motpasse) {
        this.motpasse = motpasse;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getTele() {
        return tele;
    }

    public void setTele(String tele) {
        this.tele = tele;
    }

    public String getNumero_permis() {
        return numero_permis;
    }

    public void setNumero_permis(String numero_permis) {
        this.numero_permis = numero_permis;
    }

    public String getTitre_professionel() {
        return titre_professionel;
    }

    public void setTitre_professionel(String titre_professionel) {
        this.titre_professionel = titre_professionel;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public Role getApprole() {
        return approle;
    }

    public void setApprole(Role approle) {
        this.approle = approle;
    }

    public String getResetCode() {
        return resetCode;
    }

    public void setResetCode(String resetCode) {
        this.resetCode = resetCode;
    }

    public Instant getCodeExpiry() {
        return codeExpiry;
    }

    public void setCodeExpiry(Instant codeExpiry) {
        this.codeExpiry = codeExpiry;
    }

    public Boolean getIsOnline() {
        return isOnline;
    }

    public void setIsOnline(Boolean isOnline) {
        this.isOnline = isOnline;
    }

    public List<Utilisateur> getBeneficiaires() {
        return beneficiaires;
    }

    public void setBeneficiaires(List<Utilisateur> beneficiaires) {
        this.beneficiaires = beneficiaires;
    }

    // Constructors

    public Utilisateur() {
        super();
    }

    public Utilisateur(int id_emp, String nom, String prenom, String mail, String sexe,
                       Date date_naissance, String motpasse, String adresse, String tele, Role approle) {
        super();
        this.iduser = id_emp;
        this.nom = nom;
        this.prenom = prenom;
        this.mail = mail;
        this.sexe = sexe;
        this.date_naissance = date_naissance;
        this.motpasse = motpasse;
        this.adresse = adresse;
        this.tele = tele;
        this.approle = approle;
        this.isOnline = false;
    }

    public Utilisateur(String nom, String prenom, String mail, String sexe, Date date_naissance,
                       String motpasse, String adresse, String tele, Role approle) {
        super();
        this.nom = nom;
        this.prenom = prenom;
        this.mail = mail;
        this.sexe = sexe;
        this.date_naissance = date_naissance;
        this.motpasse = motpasse;
        this.adresse = adresse;
        this.tele = tele;
        this.approle = approle;
        this.isOnline = false;
    }
}
