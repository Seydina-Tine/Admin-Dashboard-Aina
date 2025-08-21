package com.ihm.config;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("public") // Nom du groupe d'API
                .pathsToMatch("/api/**") // Chemins des endpoints à inclure
                .build();
    }

    @Bean
    public GroupedOpenApi adminApi() {
        return GroupedOpenApi.builder()
                .group("admin") // Nom du groupe d'API
                .pathsToMatch("/admin/**") // Chemins des endpoints à inclure
                .build();
    }
}