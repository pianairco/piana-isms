package ir.piana.business.isms.module.general.rest;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Controller
@RequestMapping("/api/modules/general/form-maker")
public class FormMakerRest {
    @PostMapping(value = "download-as-json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map> readyConfigJson(HttpEntity<byte[]> body) throws IOException {
        String uuid = UUID.randomUUID().toString();
        jsonConfigMap.put(uuid, new BodyContent(body.getBody()));

        Map res = new LinkedHashMap();
        res.put("uuid", uuid);
        return ResponseEntity
                .ok(res);
    }

    /*@PostMapping(value = "download-as-json", produces = MediaType.APPLICATION_JSON_VALUE)
    public void readyConfigJson(
            HttpServletResponse response,
            HttpEntity<byte[]> body) throws IOException {
        String uuid = UUID.randomUUID().toString();
        jsonConfigMap.put(uuid, new BodyContent(body.getBody()));

        response.sendRedirect("api/modules/general/form-maker/download-as-json");
    }*/

    @GetMapping(value = "download-as-json", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity downloadAsJson(@RequestParam("uuid") String uuid)
            throws IOException {

        BodyContent bodyContent = jsonConfigMap.get(uuid);

        return ResponseEntity
                .ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=config.json")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(bodyContent.body.length)
                .body(bodyContent.body);
    }

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping(value = "download-as-component", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map> readyComponent(HttpEntity<byte[]> body) throws IOException {
        String uuid = UUID.randomUUID().toString();

        JsonNode jsonNode = objectMapper.readTree(new ByteArrayInputStream(body.getBody()));

        JsonNode jsonNode1 = jsonNode.get("layout-0");


        jsonConfigMap.put(uuid, new BodyContent(body.getBody()));

        Map res = new LinkedHashMap();
        res.put("uuid", uuid);
        return ResponseEntity
                .ok(res);
    }

    @GetMapping(value = "download-as-component", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity downloadAsComponent(@RequestParam("uuid") String uuid)
            throws IOException {

        BodyContent bodyContent = jsonConfigMap.get(uuid);

        return ResponseEntity
                .ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=config.json")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(bodyContent.body.length)
                .body(bodyContent.body);
    }

    private static Map<String, BodyContent> jsonConfigMap = new LinkedHashMap<>();

    static class BodyContent {
        byte[] body;

        public BodyContent(byte[] body) {
            this.body = body;
        }
    }
}
