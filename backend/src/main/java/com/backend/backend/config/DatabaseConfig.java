package com.backend.backend.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.util.Map;

@Configuration
public class DatabaseConfig {

	@Bean
	public DataSource dataSource(
			@Value("${app.db.url}") String jdbcUrl,
			@Value("${app.db.username}") String username,
			@Value("${app.db.password}") String password
	) {
		HikariDataSource dataSource = new HikariDataSource();
		dataSource.setJdbcUrl(jdbcUrl);
		dataSource.setUsername(username);
		dataSource.setPassword(password);
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

}
