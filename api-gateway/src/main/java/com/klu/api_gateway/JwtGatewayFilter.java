package com.klu.api_gateway;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
public class JwtGatewayFilter implements GlobalFilter, Ordered {
    private final SecretKey key;
    public JwtGatewayFilter(@Value("${jwt.secret}") String secret) { key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); }

    @Override public int getOrder() { return -1; }

    @Override public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().value();
        HttpMethod method = exchange.getRequest().getMethod();
        boolean publicRequest = path.equals("/api/auth/register") || path.equals("/api/auth/login") || path.equals("/api/auth/health") || (method == HttpMethod.GET && (path.equals("/api/jobs") || path.equals("/api/recruitment/pipeline")));
        if (publicRequest) return chain.filter(exchange);

        String header = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (header == null || !header.startsWith("Bearer ")) return unauthorized(exchange);
        try {
            String token = header.substring(7);
            String role = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().get("role", String.class);
            if (!allowed(path, method, role)) return forbidden(exchange);
            ServerWebExchange updated = exchange.mutate().request(exchange.getRequest().mutate().header("X-User-Role", role).build()).build();
            return chain.filter(updated);
        } catch (Exception e) { return unauthorized(exchange); }
    }

    private boolean allowed(String path, HttpMethod method, String role) {
        if (path.startsWith("/api/admin/")) return "ADMIN".equals(role);
        if (path.equals("/api/auth/recruiter-request")) return "JOB_SEEKER".equals(role);
        if (path.startsWith("/api/jobs") && method != HttpMethod.GET) return "RECRUITER".equals(role) || "ADMIN".equals(role);
        if (path.startsWith("/api/applications") && method == HttpMethod.POST) return "JOB_SEEKER".equals(role);
        if (path.startsWith("/api/applications") && method != HttpMethod.GET) return "RECRUITER".equals(role) || "ADMIN".equals(role);
        return true;
    }
    private Mono<Void> unauthorized(ServerWebExchange e) { e.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED); return e.getResponse().setComplete(); }
    private Mono<Void> forbidden(ServerWebExchange e) { e.getResponse().setStatusCode(HttpStatus.FORBIDDEN); return e.getResponse().setComplete(); }
}
