package com.study.spring.domain.security.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.study.spring.domain.security.util.JWTCheckFilter;
import com.study.spring.domain.security.util.JWTUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Configuration
@Log4j2
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JWTUtil jwtUtil;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        log.info("--------------------- security config ---------------------");

        http.csrf(config -> config.disable());
        
        http.cors(httpSecurityCorsConfigurer -> {
            httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource());
        });

        // For JWT-based authentication (stateless)
        http.sessionManagement(config -> 
            config.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );
        
        http.formLogin(config -> config.disable());

        // Configure which endpoints are public vs protected
        http.authorizeHttpRequests(auth -> auth
            .requestMatchers(
                "/api/members/login",
                "/api/members/signup", 
                "/api/members/multipart",
                "/api/members/check-email",
                "/api/members/check-nickname",
                "/api/members/search-nickname",
                "/api/members/reset-password",
                "/api/members/refresh",
                "/api/members/logout",
                "/api/members/test-cookies",
                "/api/members/recommended-calories",
                "/api/health"
            ).permitAll()
            .anyRequest().authenticated()
        );

        // Add JWT filter
        http.addFilterBefore(new JWTCheckFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // More permissive CORS (like teacher's suggestion)
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("HEAD", "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Set-Cookie"));
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
} 