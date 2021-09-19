package ir.piana.business.isms.common.initializr;

import com.fasterxml.jackson.databind.ObjectMapper;
import ir.piana.business.isms.common.model.ResponseModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.IOException;
import java.io.InputStream;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class FormInitializer {
    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping(path = "config")
    public ResponseEntity<ResponseModel> getConfig(
            @RequestBody Map<String, Object> body) throws IOException {
        InputStream resourceAsStream = this.getClass().getResourceAsStream(
                "/" + this.getClass().getName().replaceAll("\\.", "/").concat(".structure.json"));
        Map configMap = objectMapper.readValue(
                resourceAsStream, Map.class);

        Map<String, Object> model = new LinkedHashMap<>();
        setValue((List<Map>) configMap.get("layout"), model);

        Map<String, Object> values = getValues();
        for(String key : model.keySet()) {
            if(!values.containsKey(key)) {
                values.put(key, model.get(key));
            }
        }
        configMap.put("layoutValues", values);
        return ResponseEntity.ok(ResponseModel.builder().data(configMap).build());
    }

    public Map<String, Object> getValues() {
        return new LinkedHashMap<>();
    }

    private void setValue(List<Map> layout, Map model) {
        for (Map c : layout) {
            if (!c.containsKey("type") || ((String)c.get("type")).equalsIgnoreCase("layout")) {
                if (c.containsKey("children"))
                    this.setValue((List<Map>) c.get("children"), model);
                else if (c.containsKey("layout"))
                    this.setValue((List<Map>) c.get("layout"), model);
            } else {
                if(c.containsKey("field") && c.containsKey("value")) {
                    model.put(c.get("field"), c.get("value"));
                }
            }
        }
    }
}
