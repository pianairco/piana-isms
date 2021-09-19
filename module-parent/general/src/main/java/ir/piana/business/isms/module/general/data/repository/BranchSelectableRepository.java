package ir.piana.business.isms.module.general.data.repository;

import ir.piana.business.isms.module.general.data.entity.BranchSelectable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BranchSelectableRepository extends JpaRepository<BranchSelectable, Long> {
    @Query(value = "SELECT * FROM BRANCH b order by b.branch_id asc", nativeQuery = true)
    List<BranchSelectable> findAllOrderByBranchIdAsc();
}
