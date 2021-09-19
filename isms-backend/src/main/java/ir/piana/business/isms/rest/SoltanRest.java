package ir.piana.business.isms.rest;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
public class SoltanRest {
    @GetMapping(path = "get-test/{id}")
    public ResponseEntity getTest(HttpServletRequest request,
                                  @RequestParam(value = "name", required = false) String name,
                                  @PathVariable(value = "id", required = true) int id,
                                  @RequestHeader("token") String token) {
        if(token == null)
            return ResponseEntity.status(400).body("token is mandatory");
        else
            return ResponseEntity.ok("hello " + (name == null ? "world" : name));
    }

    @DeleteMapping(path = "delete-test/{id}")
    public ResponseEntity deleteTest(HttpServletRequest request,
                                  @RequestParam(value = "name", required = false) String name,
                                  @PathVariable(value = "id", required = true) int id,
                                  @RequestHeader("token") String token) {
        if(token == null)
            return ResponseEntity.status(400).body("token is mandatory");
        else
            return ResponseEntity.ok("hello " + (name == null ? "world" : name));
    }

    @PostMapping(path = "post-test",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity postTest(HttpServletRequest request, @RequestBody Map<String, Object> map) {
        return ResponseEntity.ok(map);
    }
}
