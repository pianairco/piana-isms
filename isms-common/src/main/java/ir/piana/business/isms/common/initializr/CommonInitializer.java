package ir.piana.business.isms.common.initializr;

import com.fasterxml.jackson.databind.ObjectMapper;
import ir.piana.business.isms.common.data.util.SpecificSchemaQueryExecutor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

import java.io.InputStream;

@Configuration
@Slf4j
@DependsOn("SpecificSchemaQueryExecutorProvider")
public class CommonInitializer extends BaseInitializer {

    @Autowired
    ApplicationContext applicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SpecificSchemaQueryExecutor executor;

    /*@Autowired
    public void setQueryExecutorProvider(SpecificSchemaQueryExecutorProvider executorProvider) {
        this.queryExecutorProvider = executorProvider;
    }*/

    /*@PostConstruct
    public void init() throws SQLException, IOException {
        initData();

        log.info("AuthModuleInitializer => initialized");
    }*/

    @Override
    public InputStream getSupportSql() {
        return null;
//        return CommonInitializer.class.getResourceAsStream("/common.sql");
    }

    @Override
    public InputStream getAllSchemaSql() {
        return null;
//        return CommonInitializer.class.getResourceAsStream("/site.sql");
    }
}
