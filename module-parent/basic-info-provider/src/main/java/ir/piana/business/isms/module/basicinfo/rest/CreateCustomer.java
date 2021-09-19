package ir.piana.business.isms.module.basicinfo.rest;

import ir.piana.business.isms.common.data.util.EntityManagerQueryExecutor;
import ir.piana.business.isms.common.initializr.FormInitializer;
import ir.piana.business.isms.common.model.ResponseModel;
import ir.piana.business.isms.common.util.ResourceManager;
import ir.piana.business.isms.common.util.sql.SqlProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.util.Map;

@RestController("CreateCustomer")
@RequestMapping("/api/modules/basicinfo/create-customer")
public class CreateCustomer extends FormInitializer {
    @Autowired
    private SqlProcessor sqlProcessor;

    @Autowired
    private ResourceManager resourceManager;

    @Autowired
    EntityManagerQueryExecutor entityManagerQueryExecutor;

    @PostConstruct
    public void init() {
        System.out.println();
    }

    @Override
    public Map<String, Object> getValues() {
        Map<String, Object> values = super.getValues();
        values.put("x_to_voucher_no", 100000l);
        return values;
    }

    @PostMapping("save")
    public ResponseEntity<ResponseModel> save() {
        return ResponseEntity.ok(ResponseModel.builder().code(0).build());
    }
}
