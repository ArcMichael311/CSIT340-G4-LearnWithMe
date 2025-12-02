package com.appdevg5.thecolaguys.learnwithme.repository;

import com.appdevg5.thecolaguys.learnwithme.entity.Deck_CategoriesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Deck_CategoriesRepository extends JpaRepository<Deck_CategoriesEntity, Long> {
    
    List<Deck_CategoriesEntity> findByDeckId(Long deckId);
    
    List<Deck_CategoriesEntity> findByCategoryId(Long categoryId);
    
    void deleteByDeckIdAndCategoryId(Long deckId, Long categoryId);
    
    boolean existsByDeckIdAndCategoryId(Long deckId, Long categoryId);
}

