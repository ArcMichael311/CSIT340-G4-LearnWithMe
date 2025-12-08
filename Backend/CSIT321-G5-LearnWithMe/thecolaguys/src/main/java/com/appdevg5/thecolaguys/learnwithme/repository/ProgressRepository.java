package com.appdevg5.thecolaguys.learnwithme.repository;

import com.appdevg5.thecolaguys.learnwithme.entity.ProgressEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgressRepository extends JpaRepository<ProgressEntity, Long> {

	List<ProgressEntity> findByUserId(Long userId);

	List<ProgressEntity> findByCardId(Long cardId);

	List<ProgressEntity> findByDeckId(Long deckId);

}
