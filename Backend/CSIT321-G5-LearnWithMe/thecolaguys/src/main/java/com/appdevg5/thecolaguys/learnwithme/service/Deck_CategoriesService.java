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

    @Transactional
    public void linkDecksToCategory(Long categoryId, String categoryName, String description, List<Long> deckIds) {
        System.out.println("[Deck_CategoriesService] Linking " + deckIds.size() + " decks to category " + categoryId + " with details");
        
        // First delete existing links for this category
        System.out.println("[Deck_CategoriesService] Deleting existing links for category " + categoryId);
        List<Deck_CategoriesEntity> existing = deck_categoriesRepository.findByCategoryId(categoryId);
        for (Deck_CategoriesEntity entity : existing) {
            deck_categoriesRepository.deleteByDeckIdAndCategoryId(entity.getDeckId(), categoryId);
        }
        
        // Then create new links with category details
        for (Long deckId : deckIds) {
            Deck_CategoriesEntity link = new Deck_CategoriesEntity(deckId, categoryId, categoryName, description);
            deck_categoriesRepository.save(link);
            System.out.println("[Deck_CategoriesService] Linked deck " + deckId + " to category " + categoryId + " (" + categoryName + ")");
        }
        System.out.println("[Deck_CategoriesService] Successfully linked all decks to category " + categoryId + " with details");
    }
}