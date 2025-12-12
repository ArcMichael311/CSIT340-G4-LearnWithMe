package com.appdevg5.thecolaguys.learnwithme.repository;

import com.appdevg5.thecolaguys.learnwithme.entity.ProgressEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<ProgressEntity, Long> {

	List<ProgressEntity> findByUserId(Long userId);

	List<ProgressEntity> findByDeckId(Long deckId);

	void deleteByDeckId(Long deckId);

	Optional<ProgressEntity> findByUserIdAndDeckId(Long userId, Long deckId);

	@Query("SELECT p FROM ProgressEntity p WHERE p.userId = :userId ORDER BY p.studyDate DESC")
	List<ProgressEntity> findByUserIdOrderByDateDesc(Long userId);

}
