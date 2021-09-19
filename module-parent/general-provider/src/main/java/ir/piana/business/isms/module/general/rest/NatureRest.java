package ir.piana.business.isms.module.general.rest;

import ir.piana.business.isms.module.general.data.entity.NatureSelectable;
import ir.piana.business.isms.module.general.data.repository.NatureSelectableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.util.List;

@RestController
@RequestMapping("/api/modules/general/nature")
public class NatureRest {
    @Autowired
    private NatureSelectableRepository natureSelectableRepository;

    @PostConstruct
    public void init() {
        System.out.println();
    }

    @GetMapping(path = "list")
    public ResponseEntity<List<NatureSelectable>> getNatureModel() {
        List<NatureSelectable> allOrderByBranchIdAsc = natureSelectableRepository.findAllOrderByNatureId();
        return ResponseEntity.ok(allOrderByBranchIdAsc);
    }
}
