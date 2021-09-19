package ir.piana.business.isms.module.general.data.repository;

import ir.piana.business.isms.module.general.data.entity.InstrumentSelectable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InstrumentSelectableRepository extends JpaRepository<InstrumentSelectable, Long> {
    @Query(value = "SELECT i.instrument_id, i.BOURSE_ACCOUNT BOURSE_ACCOUNT FROM instrument i where instrument_type_id = 1 and parent_instrument_id is null and INST_TYPE_DERIVATIVES_id = 1 and INSTRUMENT_STATUS_ID = 1 and is_otc = 0 and BOURSE_ACCOUNT is not null order by i.instrument_id asc", nativeQuery = true)
    List<InstrumentSelectable> findAllPortfolio();
}
