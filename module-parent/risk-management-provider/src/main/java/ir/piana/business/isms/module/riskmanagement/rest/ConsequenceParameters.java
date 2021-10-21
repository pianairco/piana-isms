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
import java.util.List;
import java.util.Map;

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
        List<Object[]> parametersIdAndName = parametersRepository.findParametersIdAndNameAndAlias();
        return ResponseEntity.ok(ResponseModel.builder().code(0).data(parametersIdAndName).build());
    }

    @Autowired
    ConsequenceParametersService consequenceParametersService;

    @GetMapping("name-alias-coefficient-type-attributes/{parameter-id}")
    public ResponseEntity<ResponseModel> getNameAliasCoefficientAndTypeAttributes(
            @PathVariable("parameter-id") Long parameterId) {
        Map<String, Object> res = consequenceParametersService
                .getNameAliasCoefficientAndTypeAttributes(parameterId);

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

    //#region persist region
    @Transactional(propagation = Propagation.REQUIRED)
    @PostMapping(value = "create-new",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseModel> createNew() {
        ConsequenceParametersEntity parameter = ConsequenceParametersEntity.builder()
                .consequenceParametersTypeId(1)
                .coefficient(1)
                .name("تغییر دهید").build();

        ConsequenceParametersEntity save = parametersRepository.save(parameter);
        return ResponseEntity.ok(ResponseModel.builder().code(0)
                .data(save).build());
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

    @Transactional(propagation = Propagation.REQUIRED)
    @PutMapping(value = "update-name",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseModel> updateName(@RequestBody Map<String, Object> map) {
        Long parameterId = (Long) map.get("parameterId");
        String name = (String) map.get("name");

        parametersRepository
                .updateParameterName(parameterId, name);
        return ResponseEntity.ok(ResponseModel.builder().code(0).build());
    }

    @Transactional(propagation = Propagation.REQUIRED)
    @PutMapping(value = "update-coefficient",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseModel> updateCoefficient(@RequestBody Map<String, Object> map) {
        Long parameterId = (Long) map.get("parameterId");
        double coefficient = (Double) map.get("coefficient");

        parametersRepository
                .updateParameterCoefficient(parameterId, coefficient);
        return ResponseEntity.ok(ResponseModel.builder().code(0).build());
    }
    //#endregion
}
