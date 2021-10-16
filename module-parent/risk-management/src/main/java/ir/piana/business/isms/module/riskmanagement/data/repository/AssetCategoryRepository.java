package ir.piana.business.isms.module.riskmanagement.data.repository;

import ir.piana.business.isms.module.riskmanagement.data.entity.AssetCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AssetCategoryRepository extends JpaRepository<AssetCategoryEntity, Long> {
    List<AssetCategoryEntity> findAll();
    Optional<AssetCategoryEntity> findById(long assetCategoryId);
    Optional<AssetCategoryEntity> findByAssetCategoryName(long assetCategoryId);

    @Query(value = "SELECT a.* FROM asset_category a WHERE a.parent_id = :parentId ",
            nativeQuery = true)
    List<AssetCategoryEntity> findByParentId(@Param("parentId") long parentId);
}
