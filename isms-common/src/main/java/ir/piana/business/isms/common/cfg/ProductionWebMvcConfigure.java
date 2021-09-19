package ir.piana.business.isms.common.cfg;

import ir.piana.business.isms.common.ds.config.DataSourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.concurrent.ConcurrentHashMap;

@Configuration
@Profile("production")
public class ProductionWebMvcConfigure implements WebMvcConfigurer {
    @Autowired
    private DataSourceService dataSourceService;

    public ResourceHandlerRegistryProvider resourceHandlerRegistryProvider = new ResourceHandlerRegistryProvider();

    @Autowired
    private StaticResourcePropertiesModel staticResourceProperties;

    @Bean
    public ResourceHandlerRegistryProvider getResourceHandlerRegistryProvider() {
        return resourceHandlerRegistryProvider;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        resourceHandlerRegistryProvider.setResourceHandlerRegistry(registry);
        ConcurrentMapCache concurrentMapCache = new ConcurrentMapCache("spring-resource-chain-cache",
                new ConcurrentHashMap<>(), true);
        staticResourceProperties.getPaths().forEach((k, v) -> {
            registry.addResourceHandler(k)
                    .addResourceLocations(v.toArray(new String[0]))
                    .setCachePeriod(3600)
                    .resourceChain(false)
                    .addResolver(new PianaCachingResourceResolver(concurrentMapCache))
                    .addResolver(new SiteResourceResolver());

//                    .addResourceLocations("classpath:/static/", "file:///c:/upload-dir/");
        });
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
//                .allowCredentials(true)
                .allowCredentials(false)
                .allowedMethods("*")
                .allowedOrigins("*");
//                .allowedOrigins("https://piana.ir", "https://localhost");
    }

//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/*")
//                .allowedOrigins("https://piana.ir")
//                .allowedMethods("GET", "POST", "OPTIONS", "PUT")
//                .allowedHeaders("Content-Type", "X-Requested-With", "accept", "Origin", "Access-Control-Request-Method",
//                        "Host",
//                        "Access-Control-Request-Headers")
////                .exposedHeaders("Access-Control-Allow-Origin", "Access-Control-Allow-Credentials")
//                .allowCredentials(true).maxAge(3600);
//    }
}
