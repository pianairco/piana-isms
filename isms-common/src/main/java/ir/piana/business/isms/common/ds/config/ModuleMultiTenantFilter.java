package ir.piana.business.isms.common.ds.config;

import org.springframework.beans.factory.annotation.Autowired;
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

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
@Profile("module-application")
public class ModuleMultiTenantFilter extends OncePerRequestFilter {
    @Autowired
    private DataSourceService dataSourceService;

    @Value("${debug.tenant.if-null:piana.ir}")
    private String ifTenantNull;

    @PostConstruct
    public void init() {
    }

    @Override
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {
        /*String hostString = request.getHeader("Host") != null
                && !request.getHeader("Host").startsWith("localhost") ?
                request.getHeader("Host") : request.getHeader("dsCode") != null ?
                request.getHeader("dsCode") : null;
        if(hostString != null && hostString.contains(":"))
            hostString = hostString.substring(0, hostString.indexOf(":"));
        String host = hostString == null ?
                (ifTenantNull != null && !ifTenantNull.isEmpty() ? ifTenantNull : null) : hostString;*/
        String host = "support";

        request.setAttribute("tenant", host);
        request.setAttribute("host", host);


        TenantContext.setTenantId(host);
        request.setAttribute("tenantId", host);
        filterChain.doFilter(request, response);
        return;
    }

}
