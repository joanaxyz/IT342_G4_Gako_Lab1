package com.example.brainbox_api.auth.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Value("${spring.datasource.url}")
    private String rawUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;

    @Bean
    @Primary
    public DataSource dataSource() {
        // Fix the URL to properly append prepareThreshold=0
        String fixedUrl = fixUrl(rawUrl);
        
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(fixedUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName(driverClassName);
        
        return new HikariDataSource(config);
    }

    private String fixUrl(String url) {
        if (url == null || url.isEmpty()) {
            return url;
        }
        
        // Check if prepareThreshold is already in the URL
        if (url.contains("prepareThreshold=")) {
            return url;
        }
        
        // Check if URL already has query parameters
        if (url.contains("?")) {
            return url + "&prepareThreshold=0";
        } else {
            return url + "?prepareThreshold=0";
        }
    }
}
