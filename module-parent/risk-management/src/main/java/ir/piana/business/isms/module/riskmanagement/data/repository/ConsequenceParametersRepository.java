package ir.piana.business.isms.module.riskmanagement.data.repository;

import ir.piana.business.isms.module.riskmanagement.data.entity.ConsequenceParametersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsequenceParametersRepository extends JpaRepository<ConsequenceParametersEntity, Long> {
    ConsequenceParametersEntity findByName(String name);
    List<ConsequenceParametersEntity> findByConsequenceParametersTypeId(long consequenceParametersTypeId);
//    @Query(value = "SELECT u.id FROM users u, weekly_matches_competition_prediction p WHERE " +
//            "p.id = :predictionId and u.id = p.user_id between :first and :second and wm.weekly_match_status_id in (1, 2, 3)", nativeQuery = true)
//    List<Long> findRelatedToCompetition(@Param("predictionId") String predictionId);
}
