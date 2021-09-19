package ir.piana.business.isms.common.cfg;

import ir.piana.business.isms.common.util.CommonUtils;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 2)
public class SiteDomainFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String tenant = (String) request.getAttribute("tenant");
        if(!CommonUtils.isNull(tenant)) {
            request.setAttribute("site", "fund.ir");
            filterChain.doFilter(request, response);
        }
    }
}
