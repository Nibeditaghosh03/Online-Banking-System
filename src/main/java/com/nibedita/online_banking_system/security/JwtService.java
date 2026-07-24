package com.nibedita.online_banking_system.security;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;



@Service
public class JwtService {
    @Value("${jwt.secret}")
private String SECRET_KEY;
   public String generateToken(String email) {
    return Jwts.builder()
            .subject(email)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
            .signWith(getKey())
            .compact();
}
public String extractEmail(String token) {
             return Jwts.parser()
             .verifyWith(getKey())
             .build()
             .parseSignedClaims(token)
             .getPayload()
             .getSubject();
}
public boolean isTokenValid(String token) {
            try {
    Jwts.parser()
            .verifyWith(getKey())
            .build()
            .parseSignedClaims(token);

    return true;
} catch (Exception e) {
    System.out.println("TOKEN VALIDATION ERROR: " + e.getMessage());
    return false;
}
}
private SecretKey getKey() {
     byte[] keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);
     return Keys.hmacShaKeyFor(keyBytes);
}

}
