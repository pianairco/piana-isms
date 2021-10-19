package ir.piana.business.isms.module.riskmanagement.data.repository;

import ir.piana.business.isms.module.riskmanagement.data.entity.ConsequenceParametersAttributeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface ConsequenceParametersAttributeRepository extends JpaRepository<ConsequenceParametersAttributeEntity, Long> {
    List<ConsequenceParametersAttributeEntity> findByConsequenceParametersTypeId(long consequenceParametersTypeId);
    /*@Query(value = "SELECT a.ID, a.VALUE, a.LABEL FROM consequence_parameters_attribute a, consequence_parameters_type t, consequence_parameters c WHERE " +
            " c.consequence_parameters_type_id = t.id and a.consequence_parameters_type_id = t.id and c.id = :consequenceParametersId " +
            " order by a.orders asc",
            nativeQuery = true)
    List<Object[]> findRelatedToParameter(@Param("consequenceParametersId") long consequenceParametersId);*/

    @Query(value = "SELECT a.ID, a.VALUE, a.LABEL FROM consequence_parameters_attribute a, consequence_parameters_type t, consequence_parameters c WHERE " +
            " c.consequence_parameters_type_id = t.id and a.consequence_parameters_type_id = t.id and c.id = :consequenceParametersId " +
            " order by a.orders asc",
            nativeQuery = true)
    List<Map<String, Object>> findRelatedToParameter3(@Param("consequenceParametersId") long consequenceParametersId);

    @Query(value = "SELECT new ir.piana.business.isms.module.riskmanagement.data.entity.ConsequenceParametersAttributeEntity(a.id, a.value, a.label) FROM ConsequenceParametersAttributeEntity a, ConsequenceParametersTypeEntity t, ConsequenceParametersEntity c WHERE " +
            " c.consequenceParametersTypeId = t.id and a.consequenceParametersTypeId = t.id and c.id = ?1 " +
            " order by a.orders asc")
    List<ConsequenceParametersAttributeEntity> findRelatedToParameter(@Param("consequenceParametersId") long consequenceParametersId);

    @Query(value = "SELECT a.id, a.value, a.label, a.orders, a.consequence_parameters_type_id  FROM consequence_parameters_attribute a, consequence_parameters_type t, consequence_parameters c WHERE " +
            " c.consequence_parameters_type_id = t.id and a.consequence_parameters_type_id = t.id and c.id = :consequenceParametersId " +
            " order by a.orders asc",
            nativeQuery = true)
    List<Object[]> findRelatedToParameterAsObjectArray(@Param("consequenceParametersId") long consequenceParametersId);

    @Query(value = "SELECT new ConsequenceParametersAttributeEntity(a.id, a.value, a.label) FROM ConsequenceParametersAttributeEntity a, ConsequenceParametersTypeEntity t, ConsequenceParametersEntity c WHERE " +
            " c.consequenceParametersTypeId = t.id and a.consequenceParametersTypeId = t.id and c.id = :consequenceParametersId " +
            " order by a.orders asc",
            nativeQuery = false)
    List<ConsequenceParametersAttributeEntity> findRelatedToParameterSomeField(@Param("consequenceParametersId") long consequenceParametersId);
}
