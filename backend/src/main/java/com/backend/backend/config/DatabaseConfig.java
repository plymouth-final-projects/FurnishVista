package com.backend.backend.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.util.Map;

@Configuration
public class DatabaseConfig {

	@Bean
	public DataSource dataSource() {
		HikariDataSource dataSource = new HikariDataSource();
		dataSource.setJdbcUrl(getEnv("DB_URL", "jdbc:postgresql://localhost:5432/architectlk"));
		dataSource.setUsername(getEnv("DB_USERNAME", "postgres"));
		dataSource.setPassword(getEnv("DB_PASSWORD", "nethmal123"));
		dataSource.setDriverClassName("org.postgresql.Driver");
		return dataSource;
	}

	@Bean
	public HibernatePropertiesCustomizer hibernatePropertiesCustomizer() {
		return (Map<String, Object> properties) -> {
			properties.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
			properties.put("hibernate.hbm2ddl.auto", "update");
			properties.put("hibernate.show_sql", true);
			properties.put("hibernate.format_sql", true);
		};
	}

	private String getEnv(String key, String defaultValue) {
		String value = System.getenv(key);
		return (value == null || value.isBlank()) ? defaultValue : value;
	}
}
