package com.ihm;

import java.util.TimeZone;

import javax.annotation.PostConstruct;

import org.springframework.boot.SpringApplication;

import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication

public class Adel_version2024 {

	public static void main(String[] args) {
		SpringApplication.run(Adel_version2024.class, args);
	}

	@PostConstruct
	public void init() {
		// Set JVM timezone to America/Montreal
		TimeZone.setDefault(TimeZone.getTimeZone("America/Montreal"));
	}

}
