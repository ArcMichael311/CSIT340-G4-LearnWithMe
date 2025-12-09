package com.appdevg5.thecolaguys.learnwithme.service;

import com.appdevg5.thecolaguys.learnwithme.entity.CategoriesEntity;
import com.appdevg5.thecolaguys.learnwithme.repository.CategoriesRepository;
import com.appdevg5.thecolaguys.learnwithme.repository.Deck_CategoriesRepository;
import com.appdevg5.thecolaguys.learnwithme.repository.CategoryDeckRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriesService {

	private final CategoriesRepository categoriesRepository;
	private final Deck_CategoriesRepository deck_categoriesRepository;
	private final CategoryDeckRepository categoryDeckRepository;

	public CategoriesService(CategoriesRepository categoriesRepository, Deck_CategoriesRepository deck_categoriesRepository, CategoryDeckRepository categoryDeckRepository) {
		this.categoriesRepository = categoriesRepository;
		this.deck_categoriesRepository = deck_categoriesRepository;
		this.categoryDeckRepository = categoryDeckRepository;
	}

	public CategoriesEntity create(CategoriesEntity c) {
		System.out.println("[CategoriesService] Saving category to database: " + c.getName());
		CategoriesEntity saved = categoriesRepository.save(c);
		System.out.println("[CategoriesService] Category saved with ID: " + saved.getCategoryId());
		return saved;
	}

	public List<CategoriesEntity> getAll() {
		return categoriesRepository.findAll();
	}

	public Optional<CategoriesEntity> getById(Long id) {
		return categoriesRepository.findById(id);
	}

	public List<CategoriesEntity> findByName(String name) {
		return categoriesRepository.findByName(name);
	}

	public List<CategoriesEntity> searchByName(String fragment) {
		return categoriesRepository.findByNameContainingIgnoreCase(fragment);
	}

	public Optional<CategoriesEntity> update(Long id, CategoriesEntity updated) {
		return categoriesRepository.findById(id).map(existing -> {
			existing.setName(updated.getName());
			existing.setDescription(updated.getDescription());
			return categoriesRepository.save(existing);
		});
	}

	@Transactional
	public boolean delete(Long id) {
		return categoriesRepository.findById(id).map(c -> {
			System.out.println("[CategoriesService] Deleting category: " + id);
			// Delete all deck-category links from both tables first (but keep the decks)
			deck_categoriesRepository.deleteByCategoryId(id);
			System.out.println("[CategoriesService] Deleted deck_categories links for category: " + id);
			categoryDeckRepository.deleteByCategoryId(id);
			System.out.println("[CategoriesService] Deleted category_deck links for category: " + id);
			// Then delete the category
			categoriesRepository.deleteById(id);
			System.out.println("[CategoriesService] Successfully deleted category: " + id);
			return true;
		}).orElse(false);
	}
}
