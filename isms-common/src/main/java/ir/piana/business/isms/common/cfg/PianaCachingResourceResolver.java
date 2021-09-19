package ir.piana.business.isms.common.cfg;

import org.springframework.cache.Cache;
import org.springframework.core.io.Resource;
import org.springframework.lang.Nullable;
import org.springframework.web.servlet.resource.CachingResourceResolver;
import org.springframework.web.servlet.resource.ResourceResolverChain;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public class PianaCachingResourceResolver extends CachingResourceResolver {
    public PianaCachingResourceResolver(Cache cache) {
        super(cache);
    }

//    @Autowired
//    public PianaCachingResourceResolver(CacheManager cacheManager, @Qualifier("spring-resource-chain-cache") String cacheName) {
//        super(cacheManager, cacheName);
//    }

    @Override
    protected Resource resolveResourceInternal(@Nullable HttpServletRequest request, String requestPath,
                                               List<? extends Resource> locations, ResourceResolverChain chain) {
        String path = null;
        if(!request.getServletPath().startsWith("/assets")) {
            String resourcePrefix = (String) request.getAttribute("resource-prefix");
            String key = computeKey(request, requestPath);
            path = resourcePrefix == null ? key : resourcePrefix.concat(key);
        } else {
            path = computeKey(request, requestPath);
        }

        Resource resource = this.getCache().get(path, Resource.class);

        if (resource != null) {
            if (logger.isTraceEnabled()) {
                logger.trace("Resource resolved from cache");
            }
            return resource;
        }

        resource = chain.resolveResource(request, requestPath, locations);
        if (resource != null) {
            this.getCache().put(path, resource);
        }

        return resource;
    }
}
