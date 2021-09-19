package ir.piana.business.isms.common.dev.sqlrest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import ir.piana.business.isms.common.dev.uploadrest.StorageService;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.util.*;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * !    => sequence
 * @    => multiple (
 *   * => parameter
 *   # => header
 *   $ => const
 * )
 * %    => like
 */
@Controller
@RequestMapping("api")
@Profile("production")
public class AjaxController {
    @Autowired
    private ApplicationContext applicationContext;

    @Autowired
    private SqlQueryService sqlService;

    @Autowired
    private ServiceProperties serviceProperties;

    @Autowired
    private ParameterParser parameterParser;

    @Autowired
    @Qualifier("fileSystemStorageService")
//    @Qualifier("databaseStorageService")
    private StorageService storageService;

    @Autowired
    @Qualifier("jdbcObjectMapper")
    private ObjectMapper objectMapper;

    private static ObjectMapper jsonMapper = new ObjectMapper();

    private List<String> methods = Arrays.asList(new String[] {"insert", "update", "delete"});

    @PostConstruct
    public void init() {
        List<String> dollorKeys = serviceProperties.resources.keySet().stream().collect(Collectors.toList());
        Collections.sort(dollorKeys, Comparator.comparingInt(String::length).reversed());
    }

    private ResponseEntity handleResource(
            HttpServletRequest request,
            String resourcePath,
            String resourceName) {
        if(!serviceProperties.resources.containsKey(resourcePath))
            return notFound.apply(request);
        ServiceProperties.Activity activity = serviceProperties.resources.get(resourcePath);
        if (activity.getStorage() != null && activity.getStorage().equalsIgnoreCase("true")) {
            try{
                Resource resource = storageService.loadAsResource(resourceName);
                return ResponseEntity.ok(resource);
            } catch (Exception e) {
                if(activity.getSql() == null && activity.getFunction() == null)
                    return notFound.apply(request);
            }
        }
        if (activity.getFunction() != null) {
            return notImplement.apply(request);
        } else if (activity.getSql() != null) {
            Map<String, Object> containerMap = new LinkedHashMap();
            Object[] params = null;
            if(activity.getSql().getParams() != null && !activity.getSql().getParams().isEmpty()) {
                String[] split = activity.getSql().getParams().split(",");
                params = new Object[split.length];
                for(String s : split) {
                    String[] split1 = s.split("=");
                    if(split1[1].startsWith("~")) {//! => sequence
                        params[Integer.valueOf(split1[0]) - 1] = resourceName;
                    }
                }
            } else {
                params = new Object[0];
            }
            Object result = sqlService.execute(activity.getSql(), params);
            if(result instanceof AjaxReplaceType && result == AjaxReplaceType.NO_RESULT)
                return notFound.apply(request);
            else {
                HttpHeaders responseHeaders = new HttpHeaders();
                if(activity.getSql().getResult() != null) {
                    Object resource = new LinkedHashMap<>();
                    String[] split = activity.getSql().getResult().split(",");
                    for (int i = 0; i < split.length; i++) {
                        String[] split1 = split[i].split("=");
                        Object value = null;
                        if (split1[1].startsWith("@")) {
                            value = containerMap.get(split1[1].substring(1));
                        } else {
                            value = ((Map<String, Object>)result).get(split1[1]);
                        }
                        if (split1[0].startsWith("#")) {
                            responseHeaders.set(split1[0].substring(1), String.valueOf(value));
                        } else if (split1[0].startsWith("$")) {
                            resource = value;
                        }
                    }
                    return ResponseEntity.ok(resource);
                } else {
                    //ToDo: return id as { 'id': id }
                }
                String s = null;
                try {
                    s = objectMapper.writeValueAsString(result);
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
                return ResponseEntity.ok(s);
            }

        }
        return notFound.apply(request);
    }

    @RequestMapping(value = "resources/serve/{resource-path}/{resource-name}/**", method = RequestMethod.GET)
    public ResponseEntity handleResource1(HttpServletRequest request,
                                         @PathVariable("resource-path") String resourcePath,
                                         @PathVariable("resource-name") String resourceName) {
        String lastPart = null;
        if(request.getServletPath().length() > ("/api/resources/serve/" + resourcePath + "/" + resourceName + "/").length()) {
            resourceName += "/" + request.getServletPath().substring(("/api/resources/serve/" + resourcePath + "/" + resourceName + "/").length());
        }
        return handleResource(request, resourcePath, resourceName);
    }

    @RequestMapping(value = "resources/serve/{resource-path}/{resource-name}", method = RequestMethod.GET)
    public ResponseEntity handleResource2(HttpServletRequest request,
                                         @PathVariable("resource-path") String resourcePath,
                                         @PathVariable("resource-name") String resourceName) {
        return handleResource(request, resourcePath, resourceName);
    }

    @RequestMapping(value = "/ajax/serve", method = RequestMethod.POST,
            consumes = "application/json; charset=utf8",
            produces = "application/json; charset=utf8")
    public @ResponseBody
    ResponseEntity handleAjax(HttpServletRequest request,
                              @RequestBody Map<String, Object> body) {
        String actionHeader = (String) request.getHeader("action");
        String activityHeader = (String) request.getHeader("activity");

        if(serviceProperties.getActions().containsKey(actionHeader) && serviceProperties.getActions().get(actionHeader).containsKey(activityHeader)) {
            List<ServiceProperties.Activity> activities = serviceProperties.getActions().get(actionHeader).get(activityHeader);
            for(ServiceProperties.Activity activity : activities)
            if (activity.getFunction() != null && !activity.getFunction().isEmpty()) {
                try {
                    Action bean = (Action) applicationContext.getBean(actionHeader);
                    if (activityHeader != null && !activityHeader.isEmpty()) {
                        BiFunction<HttpServletRequest, Map<String, Object>, ResponseEntity> field = bean.getField(activityHeader);
                        return field.apply(request, body);
                    }
                } catch (NoSuchFieldException e){
                    e.printStackTrace();
                    return internalServerError.apply(request);
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                    return internalServerError.apply(request);
                } catch (Exception e) {
                    e.printStackTrace();
                    return internalServerError.apply(request);
                }
            } else if(activity.getSql() != null) {
                Map<String, Object> containerMap = new LinkedHashMap();
                Object[] params = null;
                if(activity.getSql().getParams() != null && !activity.getSql().getParams().isEmpty()) {
                    String[] split = activity.getSql().getParams().split(",");
                    params = new Object[split.length];
                    for(String s : split) {
                        String[] split1 = s.split("=");
                        if(split1[1].startsWith("!")) {//! => sequence
                            String[] split2 = split1[1].substring(1).split(":");
                            Long aLong = sqlService.selectSequenceValue(split2[1]);
                            containerMap.put(split2[0], aLong);
                            params[Integer.valueOf(split1[0]) - 1] = aLong;
                        } else if(split1[1].startsWith("%") || split1[1].endsWith("%")) {//%    => like
                            String begin = split1[1].startsWith("%") ? "%" : "";
                            String end = split1[1].endsWith("%") ? "%" : "";
                            String key = split1[1];
                            if (!begin.isEmpty())
                                key = split1[1].substring(1);
                            if (!end.isEmpty())
                                key = key.substring(0, key.length() - 1);
                            params[Integer.valueOf(split1[0]) - 1] = begin + body.get(key) + end;
                        } else if(split1[1].startsWith("@")) {// @  => multiple (* => parameter, # => header, $ => const)
                            String[] substring = split1[1].substring(1).split(":");
                            String index = substring[0];
                            String[] split2 = substring[1].split("&");
                            String base64 = parameterParser.parse(split2[0], request, body);
                            Integer rotate = parameterParser.parse(split2[1], request, body);
                            String group = parameterParser.parse(split2[2], request, body);
                            String imageSrc = storageService.store(base64, group, rotate);
                            params[Integer.valueOf(split1[0]) - 1] = imageSrc;
                            containerMap.put(index, imageSrc);
                        } else {
                            params[Integer.valueOf(split1[0]) - 1] = parameterParser.parse(split1[1], request, body);
                        }
                    }
                } else {
                    params = new Object[0];
                }
                Object result = sqlService.execute(activity.getSql(), params);
                if(result instanceof AjaxReplaceType && result == AjaxReplaceType.NO_RESULT)
                    return notFound.apply(request);
                else {
                    HttpHeaders responseHeaders = new HttpHeaders();
                    if(activity.getSql() != null &&
                            methods.contains(activity.getSql().getType())) {
                        if(activity.getSql().getResult() != null) {
                            Map<String, Object> resultMap = new LinkedHashMap<>();
                            String[] split = activity.getSql().getResult().split(",");
                            for (int i = 0; i < split.length; i++) {
                                String[] split1 = split[i].split("=");
                                if (split1[1].startsWith("@")) {
                                    resultMap.put(split1[0], containerMap.get(split1[1].substring(1)));
                                } else {
                                    resultMap.put(split1[0], body.get(split1[1]));
                                }
                            }
                            return ResponseEntity.ok(resultMap);
                        } else {
                            //ToDo: return id as { 'id': id }
                        }
                    }
                    String s = null;
                    try {
                        s = objectMapper.writeValueAsString(result);
                    } catch (JsonProcessingException e) {
                        e.printStackTrace();
                    }
                    return ResponseEntity.ok(s);
                }
            }
        }

        return notFound.apply(request);
    }

    Function<HttpServletRequest, ResponseEntity> notFound = (r) -> {
        HttpHeaders responseHeaders = new HttpHeaders();
        return new ResponseEntity<String>("Not Fund", responseHeaders, HttpStatus.NOT_FOUND);
    };

    Function<HttpServletRequest, ResponseEntity> notImplement = (r) -> {
        HttpHeaders responseHeaders = new HttpHeaders();
        return new ResponseEntity<String>("Not Implemented", responseHeaders, HttpStatus.NOT_IMPLEMENTED);
    };

    Function<HttpServletRequest, ResponseEntity> internalServerError = (r) -> {
        HttpHeaders responseHeaders = new HttpHeaders();
        return new ResponseEntity<String>("Internal Server Error", responseHeaders, HttpStatus.INTERNAL_SERVER_ERROR);
    };

    public static String getTemplate(String vueTemplate) {
        vueTemplate = Arrays.stream(vueTemplate.split("\r\n")).map(line -> "\"".concat(line).concat("\" +\r\n "))
                .collect(Collectors.joining( ));
        return vueTemplate.substring(0, vueTemplate.lastIndexOf("+"));
    }

    public static <T> T getDto(InputStream inputStream, Class<T> dtoType)
            throws IOException {
        String s = IOUtils.toString(inputStream);
        T t = jsonMapper.readValue(s, dtoType);
        return t;
    }

    public static abstract class Action {
        public BiFunction<HttpServletRequest, Map<String, Object>, ResponseEntity> getField(String fieldName)
                throws NoSuchFieldException, IllegalAccessException {
            Field field = this.getClass().getField(fieldName);
            return (BiFunction<HttpServletRequest, Map<String, Object>, ResponseEntity>) field.get(this);
        }
    }

    public static enum AjaxReplaceType {
        NO_RESULT,
        INSERTED,
        UPDATED,
        ITS_ID
    }
}
