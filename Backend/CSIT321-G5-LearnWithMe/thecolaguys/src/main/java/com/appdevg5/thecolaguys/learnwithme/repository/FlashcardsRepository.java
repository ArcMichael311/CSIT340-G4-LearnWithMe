package com.appdevg5.thecolaguys.learnwithme.repository;

import com.appdevg5.thecolaguys.learnwithme.entity.FlashcardsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlashcardsRepository extends JpaRepository<FlashcardsEntity, Long> {

	java.util.List<FlashcardsEntity> findByDeckId(Long deckId);

}
