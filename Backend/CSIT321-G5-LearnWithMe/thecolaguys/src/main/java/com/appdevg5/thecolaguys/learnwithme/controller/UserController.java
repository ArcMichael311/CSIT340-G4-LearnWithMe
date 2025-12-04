package com.appdevg5.thecolaguys.learnwithme.controller;

import com.appdevg5.thecolaguys.learnwithme.entity.UserEntity;
import com.appdevg5.thecolaguys.learnwithme.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody UserEntity user) {
		try {
			// Check if email already exists
			if (userService.existsByEmail(user.getEmail())) {
				return ResponseEntity.badRequest().body("Email already exists");
			}
			
			UserEntity registered = userService.create(user);
			return new ResponseEntity<>(registered, HttpStatus.CREATED);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
		}
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody UserEntity loginRequest) {
		try {
			UserEntity user = userService.findByEmailAndPassword(loginRequest.getEmail(), loginRequest.getPassword());
			if (user != null) {
				return ResponseEntity.ok(user);
			} else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed: " + e.getMessage());
		}
	}

	@PostMapping("/add")
	public ResponseEntity<UserEntity> create(@RequestBody UserEntity user) {
		UserEntity created = userService.create(user);
		return new ResponseEntity<>(created, HttpStatus.CREATED);
	}

	@GetMapping
	public ResponseEntity<List<UserEntity>> getAll() {
		return ResponseEntity.ok(userService.getAll());
	}

	@GetMapping("/get/{id}")
	public ResponseEntity<UserEntity> getById(@PathVariable Long id) {
		return userService.getById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<UserEntity> update(@PathVariable Long id, @RequestBody UserEntity user) {
		return userService.update(id, user)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		boolean deleted = userService.delete(id);
		return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
	}
}

