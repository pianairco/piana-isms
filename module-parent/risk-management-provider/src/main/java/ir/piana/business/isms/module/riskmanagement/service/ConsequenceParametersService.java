package ir.piana.business.isms.module.riskmanagement.service;

import ir.piana.business.isms.module.riskmanagement.data.entity.ConsequenceParametersAttributeEntity;
import ir.piana.business.isms.module.riskmanagement.data.repository.ConsequenceParametersAttributeRepository;
import ir.piana.business.isms.module.riskmanagement.data.repository.ConsequenceParametersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import javax.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ConsequenceParametersService {
    @Autowired
    private ConsequenceParametersAttributeRepository attributeRepository;

    @Autowired
    private ConsequenceParametersRepository parametersRepository;

    @PostConstruct
    public void init() {

    }

    @Transactional
    public Map<String, Object> getNameCoefficientAndTypeAttributes(
            @PathVariable("parameter-id") Long parameterId) {
        List<Object[]> values = parametersRepository.findCoefficientAndTypeId(parameterId);
        List<ConsequenceParametersAttributeEntity> attributes =
                attributeRepository.findByConsequenceParametersTypeId(((BigDecimal) values.get(0)[1]).longValue());
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("coefficient", values.get(0)[0]);
        res.put("parameterTypeId", values.get(0)[1]);
        res.put("name", values.get(0)[2]);
        res.put("attributes", attributes);
        return res;
    }
}
