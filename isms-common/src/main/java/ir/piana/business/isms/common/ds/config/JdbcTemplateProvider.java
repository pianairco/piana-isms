package ir.piana.business.isms.common.ds.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.annotation.RequestScope;

import java.util.Map;

@Component
@RequestScope
@Transactional(propagation = Propagation.REQUIRED)
public class JdbcTemplateProvider {
    @Autowired
    @Qualifier("dataSources")
    private Map<String, HikariDataSource> dataSourceMap;

    @Transactional(propagation = Propagation.REQUIRED)
    public JdbcTemplate getJdbcTemplate() {
        return new JdbcTemplate(dataSourceMap.get(TenantContext.getTenantId()));
    }

//    public NamedParameterJdbcTemplate getNamedJdbcTemplate() {
//        return new NamedParameterJdbcTemplate(dataSource);
//    }
}
