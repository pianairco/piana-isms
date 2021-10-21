package ir.piana.business.isms.module.riskmanagement.data.repository;

import ir.piana.business.isms.module.riskmanagement.data.entity.ConsequenceParametersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ConsequenceParametersRepository extends JpaRepository<ConsequenceParametersEntity, Long> {
    ConsequenceParametersEntity findByName(String name);

    @Query(value = "SELECT p.name FROM consequence_parameters p", nativeQuery = true)
    List<String> findParametersNames();

    @Query(value = "SELECT p.id, p.name, p.alias FROM consequence_parameters p", nativeQuery = true)
    List<Object[]> findParametersIdAndNameAndAlias();

    @Query(value = "SELECT p.name, p.alias, p.Coefficient, p.consequence_parameters_type_id FROM consequence_parameters p where id = :parameterId", nativeQuery = true)
    List<Object[]> findNameAliasCoefficientAndTypeId(@Param("parameterId") Long parameterId);

    List<ConsequenceParametersEntity> findByConsequenceParametersTypeId(long consequenceParametersTypeId);

    @Modifying
    @Query(value = "update consequence_parameters p set p.consequence_parameters_type_id = :parameterTypeId where p.id = :parameterId", nativeQuery = true)
    void updateParameterTypeId(@Param("parameterId") Long parameterId,
                               @Param("parameterTypeId") Long parameterTypeId);

    @Modifying
    @Query(value = "update consequence_parameters p set p.name = :name where p.id = :parameterId", nativeQuery = true)
    void updateParameterName(@Param("parameterId") Long parameterId,
                               @Param("name") String name);

    @Modifying
    @Query(value = "update consequence_parameters p set p.coefficient = :oefficient where p.id = :parameterId", nativeQuery = true)
    void updateParameterCoefficient(@Param("parameterId") Long parameterId,
                             @Param("coefficient") double coefficient);

//    @Query(value = "SELECT u.id FROM users u, weekly_matches_competition_prediction p WHERE " +
//            "p.id = :predictionId and u.id = p.user_id between :first and :second and wm.weekly_match_status_id in (1, 2, 3)", nativeQuery = true)
//    List<Long> findRelatedToCompetition(@Param("predictionId") String predictionId);
}
