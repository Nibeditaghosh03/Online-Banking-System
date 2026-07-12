package com.nibedita.online_banking_system.security;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
private JwtService jwtService;
    
    @Override
protected void doFilterInternal( 
     HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
)throws ServletException, IOException {
    String authHeader = request.getHeader("Authorization");
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
         String token = authHeader.substring(7);
}
        filterChain.doFilter(request, response);
}
}