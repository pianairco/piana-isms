package ir.piana.business.isms.module.auth.data.repository;

import ir.piana.business.isms.module.auth.data.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    UserEntity findByEmail(String email);
    UserEntity findByMobile(String mobile);
    UserEntity findByUsername(String username);
//    @Query(value = "SELECT u.id FROM users u, weekly_matches_competition_prediction p WHERE " +
//            "p.id = :predictionId and u.id = p.user_id between :first and :second and wm.weekly_match_status_id in (1, 2, 3)", nativeQuery = true)
//    List<Long> findRelatedToCompetition(@Param("predictionId") String predictionId);
}
