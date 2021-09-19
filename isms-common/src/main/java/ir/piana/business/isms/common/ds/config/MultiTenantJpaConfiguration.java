package ir.piana.business.isms.common.ds.config;

import com.zaxxer.hikari.HikariDataSource;
import ir.piana.business.isms.common.data.util.SpecificSchemaQueryExecutor;
import org.hibernate.MultiTenancyStrategy;
import org.hibernate.cfg.Environment;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.hibernate.engine.jdbc.connections.spi.MultiTenantConnectionProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.persistence.EntityManagerFactory;
import java.io.IOException;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.Map;

@Configuration
//@Profile({ "production"})
@EnableConfigurationProperties({ JpaProperties.class })
@EnableJpaRepositories(
		basePackages = {
                "ir.piana.business.isms.module.**.data.repository",
                "ir.piana.business.isms.common.data.repository"
		},
		transactionManagerRef = "txManager")
@EnableTransactionManagement
public class MultiTenantJpaConfiguration {
	@Autowired
	private JpaProperties jpaProperties;

	@Autowired
	private DatabaseConfig databaseConfig;

	@Bean("supportExecutor")
	public SpecificSchemaQueryExecutor getSupportExecutor() throws IOException, SQLException {
		HikariDataSource supportDs = new HikariDataSource();
		supportDs.setDriverClassName(databaseConfig.getSupport().getDriverClassName());
		supportDs.setJdbcUrl(databaseConfig.getSupport().getUrl());
		supportDs.setUsername(databaseConfig.getSupport().getUsername());
		supportDs.setPassword(databaseConfig.getSupport().getPassword());
		supportDs.setPoolName("support");
		supportDs.setMaximumPoolSize(databaseConfig.getPoolSize());
		supportDs.setConnectionTimeout(5000);
		supportDs.setIdleTimeout(5000);
		supportDs.setInitializationFailTimeout(5000);

		SpecificSchemaQueryExecutor specificSchemaQueryExecutor = new SpecificSchemaQueryExecutor(supportDs);
		long l = specificSchemaQueryExecutor.queryLong("select 1 from dual");
//		InputStream resourceAsStream = MultiTenantJpaConfiguration.class.getResourceAsStream("/common.sql");
//		if(resourceAsStream != null) {
//			String[] split = IOUtils.toString(resourceAsStream).split(";");
//			for (String script : split) {
//				try {
//					specificSchemaQueryExecutor.execute(script);
//				} catch (SQLException throwables) {
//					throwables.printStackTrace();
//				}
//			}
//		}
		return specificSchemaQueryExecutor;
	}

	@Bean(name = "dataSources")
	@DependsOn("supportExecutor")
	public Map<String, HikariDataSource> datasources(SpecificSchemaQueryExecutor supportExecutor) throws SQLException {
		LinkedHashMap<String, HikariDataSource> datasourceMap = new LinkedHashMap<>();
//		String domain = supportExecutor.queryString("select param_value from app_info where app_param = 'domain'");
//		datasourceMap.put(domain, supportExecutor.getDatasource());
		datasourceMap.put("support", supportExecutor.getDatasource());
		return datasourceMap;
	}

	@Bean("entityManagerFactoryBean")
	@DependsOn("dataSources")
	public LocalContainerEntityManagerFactoryBean entityManagerFactoryBean(
			MultiTenantConnectionProvider multiTenantConnectionProvider,
			CurrentTenantIdentifierResolver currentTenantIdentifierResolver) {

		Map<String, Object> hibernateProps = new LinkedHashMap<>();
		hibernateProps.putAll(this.jpaProperties.getProperties());
		hibernateProps.put(Environment.MULTI_TENANT, MultiTenancyStrategy.DATABASE);
		hibernateProps.put(Environment.MULTI_TENANT_CONNECTION_PROVIDER, multiTenantConnectionProvider);
		hibernateProps.put(Environment.MULTI_TENANT_IDENTIFIER_RESOLVER, currentTenantIdentifierResolver);

		LocalContainerEntityManagerFactoryBean result = new LocalContainerEntityManagerFactoryBean();
		result.setPackagesToScan(databaseConfig.getPackagesToScan());
		result.setMappingResources();
		HibernateJpaVendorAdapter vendor = new HibernateJpaVendorAdapter();
		vendor.setShowSql(databaseConfig.isShowSql());
		result.setJpaVendorAdapter(vendor);
		/*ClasspathScanningPersistenceUnitPostProcessor postProcessor = new ClasspathScanningPersistenceUnitPostProcessor();
		postProcessor.setMappingFileNamePattern();*/
		result.setPersistenceUnitPostProcessors();
		result.setJpaPropertyMap(hibernateProps);
		return result;
	}

	@Bean("entityManagerFactory")
	public EntityManagerFactory entityManagerFactory(
			LocalContainerEntityManagerFactoryBean entityManagerFactoryBean) {
		return entityManagerFactoryBean.getObject();
	}

	@Bean("txManager")
	public PlatformTransactionManager txManager(EntityManagerFactory entityManagerFactory) {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(entityManagerFactory);
		return transactionManager;
	}

	@Bean
	public JdbcTemplate jdbcTemplate(SpecificSchemaQueryExecutor queryExecutor) {
		return new JdbcTemplate(queryExecutor.getDatasource());
	}
}
