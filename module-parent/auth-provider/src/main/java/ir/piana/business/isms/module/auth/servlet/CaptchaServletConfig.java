package ir.piana.business.isms.module.auth.servlet;

import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CaptchaServletConfig {
    @Bean
    public ServletRegistrationBean customServletBean() {
        ServletRegistrationBean bean = new ServletRegistrationBean(
                new CaptchaServlet(),
                "/resources/captcha");
        return bean;
    }
}
