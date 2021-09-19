package ir.piana.business.isms.module.general.rest;

import ir.piana.business.isms.module.general.data.entity.BranchSelectable;
import ir.piana.business.isms.module.general.data.repository.BranchSelectableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.util.List;

@RestController
@RequestMapping("/api/modules/general/branch")
public class BranchRest {
    @Autowired
    private BranchSelectableRepository branchSelectableRepository;

    @PostConstruct
    public void init() {
        System.out.println();
    }

    @GetMapping(path = "list")
    public ResponseEntity<List<BranchSelectable>> getMenuModel() {
        List<BranchSelectable> allOrderByBranchIdAsc = branchSelectableRepository.findAllOrderByBranchIdAsc();
        return ResponseEntity.ok(allOrderByBranchIdAsc);
    }
}
