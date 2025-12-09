package com.appdevg5.thecolaguys.learnwithme.service;

import com.appdevg5.thecolaguys.learnwithme.entity.DecksEntity;
import com.appdevg5.thecolaguys.learnwithme.repository.DecksRepository;
import com.appdevg5.thecolaguys.learnwithme.repository.FlashcardsRepository;
import com.appdevg5.thecolaguys.learnwithme.repository.Deck_CategoriesRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DecksService {

	private final DecksRepository decksRepository;
	private final FlashcardsRepository flashcardsRepository;
	private final Deck_CategoriesRepository deck_categoriesRepository;

	public DecksService(DecksRepository decksRepository, FlashcardsRepository flashcardsRepository, Deck_CategoriesRepository deck_categoriesRepository) {
		this.decksRepository = decksRepository;
		this.flashcardsRepository = flashcardsRepository;
		this.deck_categoriesRepository = deck_categoriesRepository;
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
		// Delete all flashcards associated with this deck first
		flashcardsRepository.deleteByDeckId(id);
		// Delete all deck-category links for this deck
		deck_categoriesRepository.deleteByDeckId(id);
		// Then delete the deck
		decksRepository.deleteById(id);
	}
}

