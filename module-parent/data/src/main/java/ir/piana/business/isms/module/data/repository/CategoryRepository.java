package ir.piana.business.isms.module.data.repository;

import ir.piana.business.isms.module.data.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    @Query(value = "SELECT * FROM CategoryEntity c order by c.id asc", nativeQuery = true)
    List<CategoryEntity> findAllOrderByIdAsc();
}
