package ir.piana.business.isms.common.cfg;

import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import ir.piana.business.isms.common.util.LowerCaseKeyDeserializer;
import ir.piana.business.isms.common.util.LowerCaseKeySerializer;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;

@Configuration
public class CommonConfiguration {
    @Autowired
    private Environment env;

//    @Bean
//	public ObjectMapper getObjectMapper() {
//		return new ObjectMapper();
//	}
//
//    @Bean
//    public RestTemplate getRestTemplate() {
//        return new RestTemplate();
//    }

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        /*SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(30000);
        requestFactory.setReadTimeout(10000);
        RestTemplate restTemplate = new RestTemplate(requestFactory);*/
        return builder.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new PasswordEncoder() {
            @Override
            public String encode(CharSequence rawPassword) {
                return DigestUtils.shaHex(DigestUtils.md5Hex(rawPassword.toString()));
            }

            @Override
            public boolean matches(CharSequence rawPassword, String encodedPassword) {
                if(Arrays.stream(env.getActiveProfiles()).anyMatch(p -> "develop".matches(p))) {
                    return true;
                }
                return DigestUtils.shaHex(DigestUtils.md5Hex(rawPassword.toString())).equalsIgnoreCase(encodedPassword);
            }
        };
    }

//    public BCryptPasswordEncoder bCryptPasswordEncoder() {
//        return new BCryptPasswordEncoder();
//    }

    @Bean("jdbcObjectMapper")
    public ObjectMapper getJdbcObjectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        SimpleModule module = new SimpleModule("LowerCaseKeyDeserializer",
                new Version(1,0,0,null));
        module.addKeyDeserializer(Object.class, new LowerCaseKeyDeserializer());
        module.addKeySerializer(Object.class, new LowerCaseKeySerializer());
        objectMapper.registerModule(module);
        return objectMapper;
    }

    @Bean("objectMapper")
    public ObjectMapper getObjectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
//		SimpleModule module = new SimpleModule("LowerCaseKeyDeserializer",
//				new Version(1,0,0,null));
//		module.addKeyDeserializer(Object.class, new LowerCaseKeyDeserializer());
//		module.addKeySerializer(Object.class, new LowerCaseKeySerializer());
//		objectMapper.registerModule(module);
        return objectMapper;
    }
}
