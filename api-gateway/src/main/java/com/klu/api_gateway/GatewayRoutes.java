package com.klu.api_gateway;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutes {
    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r.path("/api/auth/**").uri("lb://auth-service"))
                .route("admin-service", r -> r.path("/api/admin/**").uri("lb://auth-service"))
                .route("job-service", r -> r.path("/api/jobs/**").uri("lb://job-service"))
                .route("application-service", r -> r.path("/api/applications/**").uri("lb://application-service"))
                .route("recruitment-pipeline", r -> r.path("/api/recruitment/**").uri("lb://application-service"))
                .build();
    }
}
