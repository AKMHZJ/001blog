package com._blog.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {
    // This is a secret key. In production, keep this very safe!
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long jwtExpirationInMs = 3600000; // 1 hour

    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public String extractUsername(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key) // your secret key / public key
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject(); // directly get username (sub)
        } catch (Exception e) {
            // You can choose what to do here depending on your needs
            throw new RuntimeException("Invalid or expired JWT token", e);
            // or: return null;
            // or: throw new UsernameNotFoundException("Cannot extract username");
        }
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key) // your secret key / public key
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration(); // directly get expiration date
        } catch (Exception e) {
            // Handle invalid/expired/malformed tokens gracefully
            throw new RuntimeException("Invalid or expired JWT token", e);
            // or: return null;
            // or: throw new JwtException("Cannot extract expiration");
        }
    }
}
