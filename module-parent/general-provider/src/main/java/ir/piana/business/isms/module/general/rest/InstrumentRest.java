package ir.piana.business.isms.module.general.rest;

import ir.piana.business.isms.common.util.CommonUtils;
import ir.piana.business.isms.module.general.data.entity.InstrumentSelectable;
import ir.piana.business.isms.module.general.data.repository.InstrumentSelectableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.util.List;

@RestController
@RequestMapping("/api/modules/general/instrument")
public class InstrumentRest {
    @Autowired
    private InstrumentSelectableRepository repository;

    @PostConstruct
    public void init() {
        System.out.println();
    }

    @GetMapping(path = "list")
    public ResponseEntity<List<InstrumentSelectable>> getInstruments() {
        List<InstrumentSelectable> allInstrument = repository.findAllPortfolio();
        allInstrument.stream().forEach(i -> i.setName(CommonUtils.unormalizeString(i.getName())));

        return ResponseEntity.ok(allInstrument);
    }
}
