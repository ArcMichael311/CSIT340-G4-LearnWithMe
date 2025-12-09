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
		// First delete existing links for this category
		categoryDeckRepository.deleteByCategoryId(categoryId);
		
		// Then create new links
		for (Long deckId : deckIds) {
			CategoryDeckEntity link = new CategoryDeckEntity(categoryId, deckId);
			categoryDeckRepository.save(link);
		}
	}
}
