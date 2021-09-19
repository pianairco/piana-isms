package ir.piana.business.isms.common.util;

import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class ResourceManager {
    private Map<String, String> resourceMap = new LinkedHashMap<>();

    public String getResourceAsString(String resourcePath, Class aClass) throws IOException {
        InputStream resourceAsStream = aClass.getResourceAsStream(resourcePath);
        if(resourceMap.containsKey(resourcePath))
            return resourceMap.get(resourcePath);
        else {
            String query = IOUtils.toString(
                    resourceAsStream,
                    StandardCharsets.UTF_8.name());
            resourceMap.put(resourcePath, query);
            return query;
        }
    }
}
