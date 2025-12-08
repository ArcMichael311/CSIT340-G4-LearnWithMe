package com.appdevg5.thecolaguys.learnwithme.service;

import com.appdevg5.thecolaguys.learnwithme.entity.ProgressEntity;
import com.appdevg5.thecolaguys.learnwithme.repository.ProgressRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProgressService {

	private final ProgressRepository progressRepository;

	public ProgressService(ProgressRepository progressRepository) {
		this.progressRepository = progressRepository;
	}

	public ProgressEntity create(ProgressEntity p) {
		return progressRepository.save(p);
	}

	public List<ProgressEntity> getAll() {
		return progressRepository.findAll();
	}

	public Optional<ProgressEntity> getById(Long id) {
		return progressRepository.findById(id);
	}

	public List<ProgressEntity> getByUserId(Long userId) {
		return progressRepository.findByUserId(userId);
	}

	public List<ProgressEntity> getByCardId(Long cardId) {
		return progressRepository.findByCardId(cardId);
	}

	public List<ProgressEntity> getByDeckId(Long deckId) {
		return progressRepository.findByDeckId(deckId);
	}

	public Optional<ProgressEntity> update(Long id, ProgressEntity updated) {
		return progressRepository.findById(id).map(existing -> {
			existing.setUserId(updated.getUserId());
			existing.setCardId(updated.getCardId());
			existing.setDeckId(updated.getDeckId());
			existing.setStatus(updated.getStatus());
			existing.setDate(updated.getDate());
			return progressRepository.save(existing);
		});
	}

	public boolean delete(Long id) {
		return progressRepository.findById(id).map(e -> {
			progressRepository.deleteById(id);
			return true;
		}).orElse(false);
	}

}
