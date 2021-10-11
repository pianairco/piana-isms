package ir.piana.business.isms.module.riskmanagement.data.repository;

import ir.piana.business.isms.module.riskmanagement.data.entity.ConsequenceParametersAttributeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ConsequenceParametersAttributeRepository extends JpaRepository<ConsequenceParametersAttributeEntity, Long> {
    List<ConsequenceParametersAttributeEntity> findByConsequenceParametersTypeId(long consequenceParametersTypeId);
    @Query(value = "SELECT a.* FROM consequence_parameters_attribute a, consequence_parameters_type t, consequence_parameters c WHERE " +
            " c.consequence_parameters_type_id = t.id and a.consequence_parameters_type_id = t.id and c.id = :consequenceParametersId " +
            " order by a.order asc",
            nativeQuery = true)
    List<ConsequenceParametersAttributeEntity> findRelatedToParameter(@Param("consequenceParametersId") long consequenceParametersId);
}
