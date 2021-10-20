package ir.piana.business.isms.module.riskmanagement.rest;

import ir.piana.business.isms.common.model.ResponseModel;
import ir.piana.business.isms.module.riskmanagement.data.entity.ConsequenceParametersAttributeEntity;
import ir.piana.business.isms.module.riskmanagement.data.entity.ConsequenceParametersEntity;
import ir.piana.business.isms.module.riskmanagement.data.repository.ConsequenceParametersAttributeRepository;
import ir.piana.business.isms.module.riskmanagement.data.repository.ConsequenceParametersRepository;
import ir.piana.business.isms.module.riskmanagement.service.ConsequenceParametersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController("consequenceParameters")
@RequestMapping("/api/modules/riskmanagement/asset-management/settings/consequence-parameters")
public class ConsequenceParameters {
    @Autowired
    private ConsequenceParametersAttributeRepository attributeRepository;

    @Autowired
    private ConsequenceParametersRepository parametersRepository;

    @PostConstruct
    public void init() {

    }

    @GetMapping("id-and-names")
    public ResponseEntity<ResponseModel> getIdAndNames() {
        List<String> parametersNames = parametersRepository.findParametersNames();
        List<Object[]> parametersIdAndName = parametersRepository.findParametersIdAndName();
        return ResponseEntity.ok(ResponseModel.builder().code(0).data(parametersIdAndName).build());
    }

    @Autowired
    ConsequenceParametersService consequenceParametersService;

    @GetMapping("name-coefficient-type-attributes/{parameter-id}")
    public ResponseEntity<ResponseModel> getNameCoefficientAndTypeAttributes(
            @PathVariable("parameter-id") Long parameterId) {
        Map<String, Object> res = consequenceParametersService.getNameCoefficientAndTypeAttributes(parameterId);

        return ResponseEntity.ok(ResponseModel.builder().code(0).data(res).build());
    }



    @GetMapping("list")
    public ResponseEntity<ResponseModel> list() {
        List<ConsequenceParametersAttributeEntity> relatedToParameter = attributeRepository
                .findRelatedToParameter(1l);

        List<Object[]> relatedToParameterAsObjectArray = attributeRepository
                .findRelatedToParameterAsObjectArray(1L);

        List<ConsequenceParametersAttributeEntity> relatedToParameterSomeField = attributeRepository
                .findRelatedToParameterSomeField(1L);

        List<ConsequenceParametersEntity> all = parametersRepository.findAll();
        return ResponseEntity.ok(ResponseModel.builder().code(0).data(all).build());
    }

    @Transactional(propagation = Propagation.REQUIRED)
    @PutMapping(value = "update-type",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseModel> updateType(@RequestBody Map<String, Long> map) {
        Long parameterId = map.get("parameterId");
        Long parameterTypeId = map.get("parameterTypeId");

        parametersRepository
                .updateParameterTypeId(parameterId, parameterTypeId);
        return ResponseEntity.ok(ResponseModel.builder().code(0).build());
    }
}
