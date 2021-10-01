package ir.piana.business.isms.module.riskmanagement.initializr;

import ir.piana.business.isms.common.initializr.BaseInitializer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

import java.io.InputStream;

@Configuration
@Slf4j
@DependsOn({"SpecificSchemaQueryExecutorProvider", "menuBootstrapper"})
public class RiskManagementInitializer extends BaseInitializer {
    /*@Autowired
    public void setQueryExecutorProvider(
            SpecificSchemaQueryExecutorProvider executorProvider) {
        this.queryExecutorProvider = executorProvider;
    }*/

    /*@PostConstruct
    public void init() {
        initData();
        log.info("AuthModuleInitializer => initialized");
    }*/

    @Override
    public InputStream getSupportSql() {
        return RiskManagementInitializer.class.getResourceAsStream("/risk-management.sql");
    }

    @Override
    public InputStream getAllSchemaSql() {
        return null;
//        return AuthInitializer.class.getResourceAsStream("/auth.sql");
    }
}
