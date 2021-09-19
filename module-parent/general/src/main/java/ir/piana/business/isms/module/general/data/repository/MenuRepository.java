package ir.piana.business.isms.module.general.data.repository;

import ir.piana.business.isms.module.general.data.entity.MenuEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MenuRepository extends JpaRepository<MenuEntity, Long> {
    @Query(value = "SELECT * FROM MENU m order by m.parent_id asc", nativeQuery = true)
    List<MenuEntity> findAllOrderByParentIdAsc();
    @Query(value = "SELECT * FROM MENU m order by m.parent_id desc", nativeQuery = true)
    List<MenuEntity> findAllOrderByParentIdDesc();
    @Query(value = "SELECT * FROM MENU m where m.parent_id = :parentId order by m.parent_id asc", nativeQuery = true)
    List<MenuEntity> findAllByParentIdOrderByParentIdAsc(@Param("parentId") long parentId);

    @Query(value = ":prepared", nativeQuery = true)
    List<MenuEntity> findPrepared(@Param("prepared") String prepared);
}
