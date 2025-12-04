package com.appdevg5.thecolaguys.learnwithme.service;

import com.appdevg5.thecolaguys.learnwithme.entity.UserEntity;
import com.appdevg5.thecolaguys.learnwithme.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

	private final UserRepository userRepository;

	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public UserEntity create(UserEntity user) {
		return userRepository.save(user);
	}

	public List<UserEntity> getAll() {
		return userRepository.findAll();
	}

	public Optional<UserEntity> getById(Long id) {
		return userRepository.findById(id);
	}

	public Optional<UserEntity> update(Long id, UserEntity updated) {
		return userRepository.findById(id).map(existing -> {
			existing.setFullName(updated.getFullName());
			existing.setEmail(updated.getEmail());
			existing.setPassword(updated.getPassword());
			return userRepository.save(existing);
		});
	}

	public boolean delete(Long id) {
		return userRepository.findById(id).map(u -> {
			userRepository.deleteById(id);
			return true;
		}).orElse(false);
	}

	public boolean existsByEmail(String email) {
		return userRepository.existsByEmail(email);
	}

	public UserEntity findByEmailAndPassword(String email, String password) {
		return userRepository.findByEmailAndPassword(email, password).orElse(null);
	}
}

