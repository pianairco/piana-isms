package ir.piana.business.isms.module.riskmanagement.rest;

import ir.piana.business.isms.common.model.ResponseModel;
import ir.piana.business.isms.module.riskmanagement.data.entity.AssetCategoryEntity;
import ir.piana.business.isms.module.riskmanagement.data.repository.AssetCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.util.List;

@RestController("assetCategory")
@RequestMapping("/api/modules/riskmanagement/asset-management/settings/asset-category")
public class AssetCategory {
    @Autowired
    private AssetCategoryRepository assetCategoryRepository;

    @PostConstruct
    public void init() {

    }

    @GetMapping("list")
    public ResponseEntity<ResponseModel> list() {
        List<AssetCategoryEntity> all = assetCategoryRepository.findAll();
        return ResponseEntity.ok(ResponseModel.builder().code(0).data(all).build());
    }
}
