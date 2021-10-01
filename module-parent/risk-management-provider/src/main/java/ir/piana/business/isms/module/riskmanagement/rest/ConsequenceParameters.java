package ir.piana.business.isms.module.riskmanagement.rest;

import ir.piana.business.isms.common.model.ResponseModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.util.Collections;

@RestController("consequenceParameters")
@RequestMapping("/api/modules/riskmanagement/consequence-parameters")
public class ConsequenceParameters {
    @PostConstruct
    public void init() {

    }

    @GetMapping("list")
    public ResponseEntity<ResponseModel> list() {
        return ResponseEntity.ok(ResponseModel.builder().code(0).data(Collections.singletonMap("name", "ali")).build());
    }
}
