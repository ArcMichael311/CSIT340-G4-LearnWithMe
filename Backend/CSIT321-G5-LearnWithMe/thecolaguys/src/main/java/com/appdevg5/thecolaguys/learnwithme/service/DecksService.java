package com.appdevg5.thecolaguys.learnwithme.service;

import com.appdevg5.thecolaguys.learnwithme.entity.DecksEntity;
import com.appdevg5.thecolaguys.learnwithme.repository.DecksRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DecksService {

	private final DecksRepository decksRepository;

	public DecksService(DecksRepository decksRepository) {
		this.decksRepository = decksRepository;
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

	public void deleteById(Long id) {
		decksRepository.deleteById(id);
	}
}

