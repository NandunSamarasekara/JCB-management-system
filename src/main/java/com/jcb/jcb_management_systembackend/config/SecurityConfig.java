package com.jcb.jcb_management_systembackend.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for testing (not for production)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/**").permitAll() // Allow all requests to /api/** without authentication
                        .anyRequest().authenticated()
                );
        return http.build();
    }
}