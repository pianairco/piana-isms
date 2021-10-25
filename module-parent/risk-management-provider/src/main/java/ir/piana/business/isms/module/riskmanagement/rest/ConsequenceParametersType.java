package ir.piana.business.isms.module.riskmanagement.rest;

import ir.piana.business.isms.common.model.ResponseModel;
import ir.piana.business.isms.module.riskmanagement.data.entity.ConsequenceParametersAttributeEntity;
import ir.piana.business.isms.module.riskmanagement.data.entity.ConsequenceParametersEntity;
import ir.piana.business.isms.module.riskmanagement.data.entity.ConsequenceParametersTypeEntity;
import ir.piana.business.isms.module.riskmanagement.data.repository.ConsequenceParametersAttributeRepository;
import ir.piana.business.isms.module.riskmanagement.data.repository.ConsequenceParametersRepository;
import ir.piana.business.isms.module.riskmanagement.data.repository.ConsequenceParametersTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController("consequenceParametersType")
@RequestMapping("/api/modules/riskmanagement/asset-management/settings/consequence-parameters-type")
public class ConsequenceParametersType {
    @Autowired
    private ConsequenceParametersAttributeRepository attributeRepository;

    @Autowired
    private ConsequenceParametersTypeRepository typeRepository;

    @Autowired
    private ConsequenceParametersRepository parametersRepository;

    @PostConstruct
    public void init() {

    }

    @GetMapping("list")
    public ResponseEntity<ResponseModel> list() {
        List<ConsequenceParametersTypeEntity> all = typeRepository.findAll();
        return ResponseEntity.ok(ResponseModel.builder().code(0).data(all).build());
    }

    @GetMapping("parameter-type-attributes-")
    public ResponseEntity<ResponseModel> listAttrRelatedToParameter(@RequestParam("parameterId") long parameterId) {
//        List<Object[]> all1 = attributeRepository.findRelatedToParameter(parameterId);
//        List<ConsequenceParametersAttributeEntity> all2 = attributeRepository.findRelatedToParameter2(parameterId);
        List<Map<String, Object>> all3 = attributeRepository.findRelatedToParameter3(parameterId);

        return ResponseEntity.ok(ResponseModel.builder().code(0).data(all3).build());
    }

    @GetMapping("list-attributes")
    public ResponseEntity<ResponseModel> listAttr() {
        List<ConsequenceParametersAttributeEntity> all = attributeRepository.findAll();

        Map<Long, List<ConsequenceParametersAttributeEntity>> collect = all.stream()
                .collect(Collectors.groupingBy(ConsequenceParametersAttributeEntity::getConsequenceParametersTypeId));
        return ResponseEntity.ok(ResponseModel.builder().code(0).data(collect).build());
    }

    @GetMapping("type-attributes/{id}")
    public ResponseEntity<ResponseModel> parameterTypeAttr(@PathVariable("id") long id) {
        List<ConsequenceParametersAttributeEntity> all = attributeRepository.findRelatedToParameter(id);
        return ResponseEntity.ok(ResponseModel.builder().code(0).data(all).build());
    }

    @Transactional(propagation = Propagation.REQUIRED)
    @PostMapping(value = "create-new",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseModel> createNew(@RequestBody List<ConsequenceParametersAttributeEntity> attributes) {
        ConsequenceParametersTypeEntity type = ConsequenceParametersTypeEntity.builder()
                .level(attributes.size())
                .build();

        ConsequenceParametersTypeEntity save = typeRepository.save(type);
        attributes.forEach(attr -> attr.setConsequenceParametersTypeId(save.getId()));
        List<ConsequenceParametersAttributeEntity> consequenceParametersAttributeEntities = attributeRepository.saveAll(attributes);
        return ResponseEntity.ok(ResponseModel.builder().code(0)
                .data(Collections.singletonMap("parameterTypeId", save.getId())).build());
    }
}
