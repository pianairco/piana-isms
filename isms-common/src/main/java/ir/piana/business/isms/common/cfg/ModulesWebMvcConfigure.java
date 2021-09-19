package ir.piana.business.isms.common.cfg;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@Profile("module-application")
public class ModulesWebMvcConfigure implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
//                .allowCredentials(true)
                .allowCredentials(false)
                .allowedMethods("*")
                .allowedOrigins("*");
//                .allowedOrigins("https://piana.ir", "https://localhost");
    }

    public ResourceHandlerRegistryProvider resourceHandlerRegistryProvider = new ResourceHandlerRegistryProvider();

    @Bean
    public ResourceHandlerRegistryProvider getResourceHandlerRegistryProvider() {
        return resourceHandlerRegistryProvider;
    }
}
