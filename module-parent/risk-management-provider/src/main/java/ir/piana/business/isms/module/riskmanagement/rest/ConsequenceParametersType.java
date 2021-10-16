package ir.piana.business.isms.module.riskmanagement.rest;

import ir.piana.business.isms.common.model.ResponseModel;
import ir.piana.business.isms.module.riskmanagement.data.entity.ConsequenceParametersAttributeEntity;
import ir.piana.business.isms.module.riskmanagement.data.entity.ConsequenceParametersEntity;
import ir.piana.business.isms.module.riskmanagement.data.entity.ConsequenceParametersTypeEntity;
import ir.piana.business.isms.module.riskmanagement.data.repository.ConsequenceParametersAttributeRepository;
import ir.piana.business.isms.module.riskmanagement.data.repository.ConsequenceParametersRepository;
import ir.piana.business.isms.module.riskmanagement.data.repository.ConsequenceParametersTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
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
}
