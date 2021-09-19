package ir.piana.business.isms.common.ds.config;

import com.zaxxer.hikari.HikariDataSource;
import ir.piana.business.isms.common.data.util.SpecificSchemaQueryExecutor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.regex.Pattern;

@Profile({"develop", "product"})
@Service("dataSourceService")
@DependsOn({ "supportExecutor", "dataSources",
        "entityManagerFactoryBean", "entityManagerFactory", "txManager"})
@Transactional(propagation = Propagation.REQUIRED)
public class DataSourceService {
    @Autowired
    @Qualifier("supportExecutor")
    private SpecificSchemaQueryExecutor supportExecutor;

    @Autowired
    private Environment environment;

    public DataSourceService() {
    }

    @PostConstruct
    @Transactional(propagation = Propagation.REQUIRED)
    public void init() throws Exception {
    }

    public boolean isProduction() {
        return Arrays.asList(environment.getActiveProfiles()).contains("product");
    }
    private static Pattern hostPattern = Pattern.compile("(?i)(host=)(.*?)([^)]+)");
    private static Pattern portPattern = Pattern.compile("(?i)(port=)(.*?)([^)]+)");
    private static Pattern serviceNamePattern = Pattern.compile("(?i)(SERVICE_NAME=)(.*?)([^)]+)");

    public synchronized HikariDataSource createHikariDS(
            String url, String username, String password, String tenant)
            throws SQLException {
        HikariDataSource ds = new HikariDataSource();
        ds.setDriverClassName("oracle.jdbc.OracleDriver");
        ds.setJdbcUrl(url);
        ds.setUsername(username);
        ds.setPassword(password);
        ds.setPoolName("Pool-" + username + "-" + tenant);
        ds.setMaximumPoolSize(5);
        ds.setConnectionTimeout(5000);
        ds.setIdleTimeout(5000);
        ds.setInitializationFailTimeout(5000);
        new SpecificSchemaQueryExecutor(ds).queryInt("select 1 from dual");
        return ds;
    }
}
