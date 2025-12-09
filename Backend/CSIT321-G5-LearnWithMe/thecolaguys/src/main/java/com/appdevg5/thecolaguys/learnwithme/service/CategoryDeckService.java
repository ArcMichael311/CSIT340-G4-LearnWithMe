package com.appdevg5.thecolaguys.learnwithme.service;

import com.appdevg5.thecolaguys.learnwithme.entity.CategoryDeckEntity;
import com.appdevg5.thecolaguys.learnwithme.repository.CategoryDeckRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryDeckService {

	private final CategoryDeckRepository categoryDeckRepository;

	public CategoryDeckService(CategoryDeckRepository categoryDeckRepository) {
		this.categoryDeckRepository = categoryDeckRepository;
	}

	public CategoryDeckEntity create(CategoryDeckEntity categoryDeck) {
		return categoryDeckRepository.save(categoryDeck);
	}

	public List<CategoryDeckEntity> getByCategoryId(Long categoryId) {
		return categoryDeckRepository.findByCategoryId(categoryId);
	}

	public List<CategoryDeckEntity> getByDeckId(Long deckId) {
		return categoryDeckRepository.findByDeckId(deckId);
	}

	public void deleteByCategoryId(Long categoryId) {
		categoryDeckRepository.deleteByCategoryId(categoryId);
	}

	public void deleteByDeckId(Long deckId) {
		categoryDeckRepository.deleteByDeckId(deckId);
	}

	@Transactional
	public void linkDecksToCategory(Long categoryId, List<Long> deckIds) {
		System.out.println("[CategoryDeckService] Linking " + deckIds.size() + " decks to category " + categoryId);
		
		// First delete existing links for this category
		System.out.println("[CategoryDeckService] Deleting existing links for category " + categoryId);
		categoryDeckRepository.deleteByCategoryId(categoryId);
		
		// Then create new links
		for (Long deckId : deckIds) {
			CategoryDeckEntity link = new CategoryDeckEntity(categoryId, null, null, deckId);
			categoryDeckRepository.save(link);
			System.out.println("[CategoryDeckService] Linked deck " + deckId + " to category " + categoryId);
		}
		System.out.println("[CategoryDeckService] Successfully linked all decks to category " + categoryId);
	}

	@Transactional
	public void linkDecksToCategoryWithDetails(Long categoryId, String categoryName, String description, List<Long> deckIds) {
		System.out.println("[CategoryDeckService] Linking " + deckIds.size() + " decks to category " + categoryId + " with details");
		
		// First delete existing links for this category
		System.out.println("[CategoryDeckService] Deleting existing links for category " + categoryId);
		categoryDeckRepository.deleteByCategoryId(categoryId);
		
		// Then create new links with category details
		for (Long deckId : deckIds) {
			CategoryDeckEntity link = new CategoryDeckEntity(categoryId, categoryName, description, deckId);
			categoryDeckRepository.save(link);
			System.out.println("[CategoryDeckService] Linked deck " + deckId + " to category " + categoryId + " (" + categoryName + ")");
		}
		System.out.println("[CategoryDeckService] Successfully linked all decks to category " + categoryId + " with details");
	}
}
