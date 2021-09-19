package ir.piana.business.isms.common.cfg;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;
import java.util.Map;

@ConfigurationProperties("static-resource")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StaticResourcePropertiesModel {
    private Map<String, List<String>> paths;
}
