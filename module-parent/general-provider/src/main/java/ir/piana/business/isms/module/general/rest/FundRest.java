package ir.piana.business.isms.module.general.rest;

import ir.piana.business.isms.module.general.model.SelectableModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/modules/general/fund")
public class FundRest {
    @PostConstruct
    public void init() throws IOException {

    }

    @GetMapping(path = "list")
    public ResponseEntity<List<SelectableModel>> getFunds() {
//        List<Fund> allOrderByBranchIdAsc = fundRepository.findAllOrderByFundIdAsc();
        return ResponseEntity.ok(new ArrayList<>());
    }
}
