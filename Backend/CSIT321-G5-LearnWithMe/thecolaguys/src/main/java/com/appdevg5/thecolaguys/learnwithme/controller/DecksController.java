package com.appdevg5.thecolaguys.learnwithme.controller;

import com.appdevg5.thecolaguys.learnwithme.entity.DecksEntity;
import com.appdevg5.thecolaguys.learnwithme.service.DecksService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/decks")
@CrossOrigin(origins = "http://localhost:3000")
public class DecksController {

	private final DecksService decksService;

	public DecksController(DecksService decksService) {
		this.decksService = decksService;
	}

	@GetMapping
	public List<DecksEntity> list() {
		return decksService.findAll();
	}

	@GetMapping("/{id}")
	public ResponseEntity<DecksEntity> get(@PathVariable Long id) {
		return decksService.findById(id)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PostMapping("/add")
	public ResponseEntity<DecksEntity> create(@RequestBody DecksEntity deck) {
		DecksEntity created = decksService.create(deck);
		return ResponseEntity.created(URI.create("/api/decks/" + created.getDeckId())).body(created);
	}

	@PutMapping("/{id}")
	public ResponseEntity<DecksEntity> update(@PathVariable Long id, @RequestBody DecksEntity deck) {
		return decksService.update(id, deck)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		try {
			decksService.deleteById(id);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			System.err.println("Error deleting deck: " + e.getMessage());
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}
}
