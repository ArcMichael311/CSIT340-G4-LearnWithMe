package com.appdevg5.thecolaguys.learnwithme.service;

import com.appdevg5.thecolaguys.learnwithme.entity.UserEntity;
import com.appdevg5.thecolaguys.learnwithme.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public UserEntity create(UserEntity user) {
		// Hash the password before saving
		user.setPassword(passwordEncoder.encode(user.getPassword()));
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
			// Hash password if it's being updated
			if (updated.getPassword() != null && !updated.getPassword().isEmpty()) {
				existing.setPassword(passwordEncoder.encode(updated.getPassword()));
			}
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
		// Find user by email
		Optional<UserEntity> userOpt = userRepository.findByEmail(email);
		
		if (userOpt.isPresent()) {
			UserEntity user = userOpt.get();
			// Verify the password using BCrypt
			if (passwordEncoder.matches(password, user.getPassword())) {
				return user;
			}
		}
		return null;
	}
}

