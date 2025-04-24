package com.ihm.sec;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ihm.entites.Utilisateur;

public class JWTAuthentificationFilter extends UsernamePasswordAuthenticationFilter {

	private AuthenticationManager authenticationManager;

	public JWTAuthentificationFilter(AuthenticationManager authenticationManager) {
		this.authenticationManager = authenticationManager;
	}

	// Dans JWTAuthenticationFilter
	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
	        throws AuthenticationException {
	    try {
	        Utilisateur credentials = new ObjectMapper().readValue(request.getInputStream(), Utilisateur.class);
	        String username = determineUsername(credentials);

	        if (username == null || username.trim().isEmpty()) {
	            throw new AuthenticationServiceException("Email and telephone cannot both be null or empty");
	        }

	        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
	            username, credentials.getMotpasse(), new ArrayList<>());
	        return authenticationManager.authenticate(authenticationToken);
	    } catch (IOException e) {
	        throw new AuthenticationServiceException("Failed to parse authentication request body", e);
	    }
	}

	private String determineUsername(Utilisateur credentials) {
	    if (credentials.getMail() != null && !credentials.getMail().isEmpty()) {
	        System.out.println("User found with email: " + credentials.getMail());
	        return credentials.getMail();
	    } else if (credentials.getTele() != null && !credentials.getTele().isEmpty()) {
	        System.out.println("User found with telephone: " + credentials.getTele());
	        return credentials.getTele();
	    }
	    return null;
	}


	@Override
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
			Authentication authResult) throws IOException, ServletException {
		// TODO Auto-generated method stub
		User user = (User) authResult.getPrincipal();
		List<String> roles = new ArrayList<>();
		user.getAuthorities().forEach(a -> {
			roles.add(a.getAuthority());
		});

		String jwt = JWT.create().withIssuer(request.getRequestURI()).withSubject(user.getUsername())
				.withArrayClaim("roles", roles.toArray(new String[roles.size()]))
				.withExpiresAt(new Date(System.currentTimeMillis() + SecurityParams.EXPIRATION_TIME))
				.sign(Algorithm.HMAC256(SecurityParams.SECRET));
		response.addHeader(SecurityParams.HEADER_STRING, SecurityParams.TOKEN_PREFIX + jwt);

	}

}
