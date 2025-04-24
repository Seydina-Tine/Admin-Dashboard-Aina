package com.ihm.sec;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

public class JWTAuthorizationFilter extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		

		response.addHeader("Access-Control-Allow-Origin",  "*");
		response.addHeader("Access-Control-Allow-Headers",  "Origin,  Accept,  X-Requested-With, content-Type,  Access-Control-Request-Method,  Access-Control-Request-Headers,authorization");
		response.addHeader("Access-Control-Expose-Headers",  "Access-Control-Allow-Origin, Access-Control-Allow-Credentials,  Authorization");
		response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, POST, DELETE");
		if(request.getMethod().equals("OPTIONS")){
		response.setStatus(HttpServletResponse.SC_OK);
		}
		else {	
		
	String jwtToken=request.getHeader(SecurityParams.HEADER_STRING);
	
if(jwtToken==null || !jwtToken.startsWith(SecurityParams.TOKEN_PREFIX)) {
		
		filterChain.doFilter(request, response);	
		return;
	}
	
	JWTVerifier verfier=JWT.require(Algorithm.HMAC256(SecurityParams.SECRET)).build();
	String jwt=jwtToken.substring(SecurityParams.TOKEN_PREFIX.length());
	DecodedJWT decodedJWT=verfier.verify(jwt);
	System.out.println("jwt= "+jwt);
	String username=decodedJWT.getSubject();
	List<String> roles=decodedJWT.getClaims().get("roles").asList(String.class);
	System.out.println("username= "+username);
	System.out.println("roles= "+roles);
	Collection<GrantedAuthority>authorites=new ArrayList<GrantedAuthority>();
	//authorites.add(new SimpleGrantedAuthority(roles.get(0)));
	
	roles.forEach(r->{
	authorites.add(new SimpleGrantedAuthority(r));
	});
		
	
	UsernamePasswordAuthenticationToken user=
			new UsernamePasswordAuthenticationToken(username,null,authorites);
	
	SecurityContextHolder.getContext().setAuthentication(user);
	filterChain.doFilter(request, response);
	
		
	}
}
	
}
