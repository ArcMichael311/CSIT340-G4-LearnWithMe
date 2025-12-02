package com.appdevg5.thecolaguys.learnwithme.service;

import com.appdevg5.thecolaguys.learnwithme.entity.Deck_CategoriesEntity;
import com.appdevg5.thecolaguys.learnwithme.repository.Deck_CategoriesRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class Deck_CategoriesService {

    private final Deck_CategoriesRepository deck_categoriesRepository;

    public Deck_CategoriesService(Deck_CategoriesRepository deck_categoriesRepository) {
        this.deck_categoriesRepository = deck_categoriesRepository;
    }

    public Deck_CategoriesEntity create(Deck_CategoriesEntity dc) {
        return deck_categoriesRepository.save(dc);
    }

    public List<Deck_CategoriesEntity> getAll() {
        return deck_categoriesRepository.findAll();
    }

    public List<Deck_CategoriesEntity> getByDeckId(Long deckId) {
        return deck_categoriesRepository.findByDeckId(deckId);
    }

    public List<Deck_CategoriesEntity> getByCategoryId(Long categoryId) {
        return deck_categoriesRepository.findByCategoryId(categoryId);
    }

    @Transactional
    public void delete(Long deckId, Long categoryId) {
        deck_categoriesRepository.deleteByDeckIdAndCategoryId(deckId, categoryId);
    }

    public boolean exists(Long deckId, Long categoryId) {
        return deck_categoriesRepository.existsByDeckIdAndCategoryId(deckId, categoryId);
    }
}
