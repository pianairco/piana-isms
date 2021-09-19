package ir.piana.business.isms.common.ds.config;

import com.zaxxer.hikari.HikariDataSource;
import ir.piana.business.isms.common.cfg.ResourceHandlerRegistryProvider;
import ir.piana.business.isms.common.util.CommonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.annotation.PostConstruct;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
@Profile("production")
public class ProductionMultiTenantFilter extends OncePerRequestFilter {
    @Autowired
    private DataSourceService dataSourceService;

    @Autowired
    @Qualifier("dataSources")
    private Map<String, HikariDataSource> dataSourceMap;

    @Autowired
    ResourceHandlerRegistryProvider resourceHandlerRegistryProvider;

    @Value("${debug.tenant.if-null:piana.ir}")
    private String ifTenantNull;

    @PostConstruct
    public void init() {
    }

    @Override
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {
        boolean b = resourceHandlerRegistryProvider.getResourceHandlerRegistry()
                .hasMappingForPattern(request.getServletPath());
//        if (dataSourceService.isLock()) {
//            throw new HTTPException(HttpStatus.BAD_REQUEST.value());
//        }
        String tenant = null;

        if(tenant == null) {
            tenant = !CommonUtils.isNull(ifTenantNull) ? ifTenantNull : null;
        }

//        String host = "support";

        request.setAttribute("tenant", tenant);
        request.setAttribute("host", tenant);

        request.setAttribute("resource-prefix", null);

        TenantContext.setTenantId(tenant);
        filterChain.doFilter(request, response);
    }

}
