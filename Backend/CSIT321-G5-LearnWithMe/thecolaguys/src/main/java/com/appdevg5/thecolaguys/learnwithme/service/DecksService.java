package com.appdevg5.thecolaguys.learnwithme.service;

import com.appdevg5.thecolaguys.learnwithme.entity.DecksEntity;
import com.appdevg5.thecolaguys.learnwithme.repository.DecksRepository;
import com.appdevg5.thecolaguys.learnwithme.repository.FlashcardsRepository;
import com.appdevg5.thecolaguys.learnwithme.repository.Deck_CategoriesRepository;
import com.appdevg5.thecolaguys.learnwithme.repository.CategoryDeckRepository;
import com.appdevg5.thecolaguys.learnwithme.repository.ProgressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DecksService {

	private final DecksRepository decksRepository;
	private final FlashcardsRepository flashcardsRepository;
	private final Deck_CategoriesRepository deck_categoriesRepository;
	private final CategoryDeckRepository categoryDeckRepository;
	private final ProgressRepository progressRepository;

	public DecksService(DecksRepository decksRepository, FlashcardsRepository flashcardsRepository, Deck_CategoriesRepository deck_categoriesRepository, CategoryDeckRepository categoryDeckRepository, ProgressRepository progressRepository) {
		this.decksRepository = decksRepository;
		this.flashcardsRepository = flashcardsRepository;
		this.deck_categoriesRepository = deck_categoriesRepository;
		this.categoryDeckRepository = categoryDeckRepository;
		this.progressRepository = progressRepository;
	}

	public List<DecksEntity> findAll() {
		return decksRepository.findAll();
	}

	public Optional<DecksEntity> findById(Long id) {
		return decksRepository.findById(id);
	}

	public DecksEntity create(DecksEntity deck) {
		deck.setDeckId(null); // ensure id is null so JPA will generate
		return decksRepository.save(deck);
	}

	public Optional<DecksEntity> update(Long id, DecksEntity updated) {
		return decksRepository.findById(id).map(existing -> {
			existing.setTitle(updated.getTitle());
			existing.setDescription(updated.getDescription());
			return decksRepository.save(existing);
		});
	}

	@Transactional
	public void deleteById(Long id) {
		System.out.println("[DecksService] Deleting deck: " + id);
		// Delete all progress records associated with this deck
		progressRepository.deleteByDeckId(id);
		System.out.println("[DecksService] Deleted progress records for deck: " + id);
		// Delete all flashcards associated with this deck first
		flashcardsRepository.deleteByDeckId(id);
		System.out.println("[DecksService] Deleted flashcards for deck: " + id);
		// Delete all deck-category links for this deck from both tables
		deck_categoriesRepository.deleteByDeckId(id);
		System.out.println("[DecksService] Deleted deck_categories links for deck: " + id);
		categoryDeckRepository.deleteByDeckId(id);
		System.out.println("[DecksService] Deleted category_deck links for deck: " + id);
		// Then delete the deck
		decksRepository.deleteById(id);
		System.out.println("[DecksService] Successfully deleted deck: " + id);
	}
}

