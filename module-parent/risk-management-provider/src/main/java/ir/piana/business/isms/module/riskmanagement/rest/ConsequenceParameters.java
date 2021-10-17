package ir.piana.business.isms.module.riskmanagement.rest;

import ir.piana.business.isms.common.model.ResponseModel;
import ir.piana.business.isms.module.riskmanagement.data.entity.ConsequenceParametersAttributeEntity;
import ir.piana.business.isms.module.riskmanagement.data.entity.ConsequenceParametersEntity;
import ir.piana.business.isms.module.riskmanagement.data.repository.ConsequenceParametersAttributeRepository;
import ir.piana.business.isms.module.riskmanagement.data.repository.ConsequenceParametersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.util.List;

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
}
