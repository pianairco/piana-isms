package ir.piana.business.isms.common.exceptions;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zaxxer.hikari.HikariDataSource;
import ir.piana.business.isms.common.ds.config.TenantContext;
import ir.piana.business.isms.common.data.util.SpecificSchemaQueryExecutor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Map;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CustomFilterExceptionHandlerFilter extends OncePerRequestFilter {
    @Autowired
    private Map<String, HikariDataSource> dataSourceMap;

    public void checkDatabaseConnection(Exception ex) {
        String tenantId = TenantContext.getTenantId();
        if(ex instanceof SQLException) {
            try {
                SpecificSchemaQueryExecutor executor = new SpecificSchemaQueryExecutor(
                        (HikariDataSource) dataSourceMap.get(tenantId));
                executor.queryInt("select 1 from dual");
            } catch (SQLException e) {
                dataSourceMap.remove(tenantId);
            }
        }
    }

    public void httpCommonRuntimeExceptionHandler(
            HttpCommonRuntimeException ex, HttpServletResponse response) throws IOException {
        checkDatabaseConnection(ex);

        ErrorModel errorModel = ErrorModel.builder()
                .errorCode(ex.getCode())
                .message(ex.getMessage())
                .build();

        response.setStatus(ex.getHttpStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
        response.getWriter().print(new ObjectMapper().writeValueAsString(errorModel));
        response.getWriter().flush();
//        return ResponseEntity.status(errorModel.getErrorCode())
//                .header("content-type", MediaType.APPLICATION_JSON_VALUE + "; charset=utf-8")
//                .body(errorModel);
    }

    public void tenantNotSpecifiedExceptionHandler(
            TenantNotSpecifiedException ex, HttpServletResponse response) throws IOException {
        checkDatabaseConnection(ex);
        ErrorModel errorModel = ErrorModel.builder()
                .errorCode(403)
                .descriptionEN("tenant is not specified!")
                .build();
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().print(new ObjectMapper().writeValueAsString(errorModel));
        response.getWriter().flush();
//        return ResponseEntity.status(errorModel.getErrorCode())
//                .header("content-type", MediaType.APPLICATION_JSON_VALUE + "; charset=utf-8")
//                .body(errorModel);
    }

    public void siteRefreshExceptionHandler(
            SiteRefreshException ex, HttpServletResponse response) throws IOException {
        checkDatabaseConnection(ex);
        ErrorModel errorModel = ErrorModel.builder()
                .errorCode(500)
                .descriptionEN("site is refresh specified!")
                .build();
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().print(new ObjectMapper().writeValueAsString(errorModel));
        response.getWriter().flush();
    }

    public void unknownExceptionHandler(
            Exception ex, HttpServletResponse response) throws IOException {
        checkDatabaseConnection(ex);
        ErrorModel errorModel = ErrorModel.builder()
                .errorCode(500)
                .descriptionEN("an exception is occurred!")
                .build();
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().print(new ObjectMapper().writeValueAsString(errorModel));
        response.getWriter().flush();
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            filterChain.doFilter(httpServletRequest, httpServletResponse);
        } catch (Exception e) {
            if(e instanceof TenantNotSpecifiedException) {
                tenantNotSpecifiedExceptionHandler((TenantNotSpecifiedException)e, httpServletResponse);
            } else if (e instanceof HttpCommonRuntimeException) {
                httpCommonRuntimeExceptionHandler((HttpCommonRuntimeException)e, httpServletResponse);
            } else if(e instanceof SiteRefreshException) {
                siteRefreshExceptionHandler((SiteRefreshException)e, httpServletResponse);
            } else {
                unknownExceptionHandler(e, httpServletResponse);
            }
        }
    }
}
