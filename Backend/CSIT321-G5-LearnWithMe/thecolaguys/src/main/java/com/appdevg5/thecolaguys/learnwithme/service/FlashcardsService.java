package com.appdevg5.thecolaguys.learnwithme.service;

import com.appdevg5.thecolaguys.learnwithme.entity.FlashcardsEntity;
import com.appdevg5.thecolaguys.learnwithme.repository.FlashcardsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FlashcardsService {

	private final FlashcardsRepository flashcardsRepository;

	public FlashcardsService(FlashcardsRepository flashcardsRepository) {
		this.flashcardsRepository = flashcardsRepository;
	}

	public FlashcardsEntity create(FlashcardsEntity card) {
		return flashcardsRepository.save(card);
	}

	public List<FlashcardsEntity> getAll() {
		return flashcardsRepository.findAll();
	}

	public Optional<FlashcardsEntity> getById(Long id) {
		return flashcardsRepository.findById(id);
	}

	public List<FlashcardsEntity> getByDeckId(Long deckId) {
		return flashcardsRepository.findByDeckId(deckId);
	}

	public Optional<FlashcardsEntity> update(Long id, FlashcardsEntity updated) {
		return flashcardsRepository.findById(id).map(existing -> {
			existing.setQuestion(updated.getQuestion());
			existing.setAnswer(updated.getAnswer());
			existing.setDeckId(updated.getDeckId());
			return flashcardsRepository.save(existing);
		});
	}

	public boolean delete(Long id) {
		return flashcardsRepository.findById(id).map(c -> {
			flashcardsRepository.deleteById(id);
			return true;
		}).orElse(false);
	}
}
