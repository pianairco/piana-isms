package ir.piana.business.isms.module.general.data.repository;

import ir.piana.business.isms.module.general.data.entity.NatureSelectable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NatureSelectableRepository extends JpaRepository<NatureSelectable, Long> {
    @Query(value = "SELECT * FROM SUBSIDIARY_LEDGER_NATURE n order by n.SL_NATURE_ID asc", nativeQuery = true)
    List<NatureSelectable> findAllOrderByNatureId();
}
