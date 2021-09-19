package ir.piana.business.isms.common.servlet;

//import org.h2.server.web.WebServlet;
import org.h2.server.web.WebServlet;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Configuration;

import javax.servlet.ServletContext;

@Configuration
public class ServletConfig implements ServletContextInitializer {
    @Override
    public void onStartup(ServletContext servletContext) {
        servletContext.addServlet("H2Console", WebServlet.class)
                .addMapping("/h2/console/*");
//        servletContext.addServlet("captcha", CaptchaServlet.class)
//                .addMapping("/resources/captcha");
    }

//    @Bean
//    public ServletRegistrationBean customServletBean() {
//        ServletRegistrationBean bean = new ServletRegistrationBean(
//                new CaptchaServlet(),
//                "/resources/captcha");
//        return bean;
//    }
}
