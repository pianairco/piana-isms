package ir.piana.business.isms.common.ds.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Getter
@Setter
@Configuration
//@Profile({"production"})
@ConfigurationProperties(prefix = "database")
public class DatabaseConfig {
    private String[] packagesToScan;
    private boolean showSql;
    private int poolSize;
    private DataSourceProperties support;
    List<String> schemaList;
}
