package ir.piana.business.isms.common.cfg;

import ir.piana.business.isms.common.util.CommonUtils;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.resource.PathResourceResolver;
import org.springframework.web.servlet.resource.ResourceResolverChain;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public class SiteResourceResolver extends PathResourceResolver {
    public SiteResourceResolver() {

    }

    @Override
    protected Resource resolveResourceInternal(
            HttpServletRequest request,
            String requestPath,
            List<? extends Resource> locations,
            ResourceResolverChain chain) {
        String resourcePrefix = (String) request.getAttribute("resource-prefix");
        if(!request.getServletPath().startsWith("/assets") && !CommonUtils.isNull(resourcePrefix))
            requestPath = resourcePrefix.concat(requestPath);

        return super.resolveResourceInternal(request, requestPath, locations, chain);
    }

}
