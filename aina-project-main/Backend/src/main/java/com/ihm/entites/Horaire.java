package com.ihm.entites;

import java.time.LocalTime;
import java.util.Objects;

import javax.persistence.Embeddable;


@Embeddable
public class Horaire {

	
	private Jour jour;
    private LocalTime heureOuverture;
    private LocalTime heureFermeture;
    
  

public Jour getJour() {
    return jour;
}

public void setJour(Jour jour) {
    this.jour = jour;
}

public LocalTime getHeureOuverture() {
    return heureOuverture;
}

public void setHeureOuverture(LocalTime heureOuverture) {
    this.heureOuverture = heureOuverture;
}

public LocalTime getHeureFermeture() {
    return heureFermeture;
}

public void setHeureFermeture(LocalTime heureFermeture) {
    this.heureFermeture = heureFermeture;
}


@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Horaire horaire = (Horaire) o;
    return jour == horaire.jour &&
           Objects.equals(heureOuverture, horaire.heureOuverture) &&
           Objects.equals(heureFermeture, horaire.heureFermeture);
}

@Override
public int hashCode() {
    return Objects.hash(jour, heureOuverture, heureFermeture);
}
    // Enumération pour les jours de la semaine
    public enum Jour {
        Lundi,
        Mardi,
        Mercredi,
        Jeudi,
        Vendredi,
        Samedi,
        Dimanche
    }
}
