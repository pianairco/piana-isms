package ir.piana.business.isms.common.ds.config;

import com.zaxxer.hikari.HikariDataSource;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.sql.SQLException;
import java.util.Map;

@Component
//@Profile({ "production"})
public class TenantIdentifierResolverImpl
		implements CurrentTenantIdentifierResolver {

	private String defaultTenantId;

	@Autowired
	@Qualifier("dataSources")
	private Map<String, HikariDataSource> dataSources;

	@PostConstruct
	public void init() throws SQLException {
		defaultTenantId = "support";
//		defaultTenantId = baseExecutor.queryString("select tenant_id from SEJAM_DATASOURCES where is_default = 1");
//		if(failedDataSources.keySet().contains(defaultTenantId) || deactivateDataSources.stream()
//				.filter(e -> e.getTenantId().equalsIgnoreCase(defaultTenantId)).findFirst().isPresent()) {
//			defaultTenantId = dataSources.keySet().iterator().next();
//		}
	}

	@Override
	public String resolveCurrentTenantIdentifier() {
		String currentTenantId = TenantContext.getTenantId();
		return (currentTenantId != null) ? currentTenantId : defaultTenantId;
	}

	@Override
	public boolean validateExistingCurrentSessions() {
		return true;
	}
}
