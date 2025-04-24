package com.ihm.sec;



import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    // Extraction de l'ID utilisateur du token
    public String extractUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                            .setSigningKey(secretKey)
                            .parseClaimsJws(token)
                            .getBody();
        return claims.getSubject();
    }

    // Génération d'un JWT signé
    public String generateToken(String userId) {
        return Jwts.builder()
                   .setSubject(userId)
                   .setIssuedAt(new Date(System.currentTimeMillis()))
                   .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 heures d'expiration
                   .signWith(SignatureAlgorithm.HS256, secretKey)
                   .compact();
    }

    // Validation d'un token JWT
    public boolean validateToken(String token, String userId) {
        final String extractedUserId = extractUserIdFromToken(token);
        return (extractedUserId.equals(userId) && !isTokenExpired(token));
    }

    // Vérification de l'expiration du token
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extraction de la date d'expiration du token
    private Date extractExpiration(String token) {
        return Jwts.parser()
                   .setSigningKey(secretKey)
                   .parseClaimsJws(token)
                   .getBody()
                   .getExpiration();
    }
}


