package ir.piana.business.isms.common.cfg;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ResourceHandlerRegistryProvider {
    private ResourceHandlerRegistry resourceHandlerRegistry;

    void setResourceHandlerRegistry(ResourceHandlerRegistry resourceHandlerRegistry) {
        this.resourceHandlerRegistry = resourceHandlerRegistry;
    }
}
