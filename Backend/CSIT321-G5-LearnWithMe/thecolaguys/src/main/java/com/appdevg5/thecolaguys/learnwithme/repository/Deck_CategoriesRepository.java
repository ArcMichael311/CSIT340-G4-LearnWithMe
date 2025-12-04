package com.appdevg5.thecolaguys.learnwithme.repository;

import com.appdevg5.thecolaguys.learnwithme.entity.Deck_CategoriesEntity;
import com.appdevg5.thecolaguys.learnwithme.entity.Deck_CategoriesId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Deck_CategoriesRepository extends JpaRepository<Deck_CategoriesEntity, Deck_CategoriesId> {
    
    List<Deck_CategoriesEntity> findByDeckId(Long deckId);
    
    List<Deck_CategoriesEntity> findByCategoryId(Long categoryId);
    
    void deleteByDeckIdAndCategoryId(Long deckId, Long categoryId);
    
    boolean existsByDeckIdAndCategoryId(Long deckId, Long categoryId);
}

