package com.appdevg5.thecolaguys.learnwithme.service;

import com.appdevg5.thecolaguys.learnwithme.entity.CategoriesEntity;
import com.appdevg5.thecolaguys.learnwithme.repository.CategoriesRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriesService {

	private final CategoriesRepository categoriesRepository;

	public CategoriesService(CategoriesRepository categoriesRepository) {
		this.categoriesRepository = categoriesRepository;
	}

	public CategoriesEntity create(CategoriesEntity c) {
		return categoriesRepository.save(c);
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

	public boolean delete(Long id) {
		return categoriesRepository.findById(id).map(c -> {
			categoriesRepository.deleteById(id);
			return true;
		}).orElse(false);
	}
}
