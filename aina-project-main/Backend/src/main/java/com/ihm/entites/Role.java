package com.ihm.entites;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "role")

public class Role implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int Id_role;
	private String nomrole;

	public int getId_role() {
		return Id_role;
	}

	public void setId_role(int id_role) {
		Id_role = id_role;
	}

	public Role() {

	}

	public String getNomrole() {
		return nomrole;
	}

	public void setNomrole(String nomrole) {
		this.nomrole = nomrole;
	}

	public Role(int id_role, String nomrole) {
		super();
		Id_role = id_role;
		this.nomrole = nomrole;
	}

	public Role(String nomrole) {
		super();

		this.nomrole = nomrole;
	}

}
