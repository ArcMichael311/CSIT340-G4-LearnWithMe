package com.appdevg5.thecolaguys.learnwithme.controller;

import com.appdevg5.thecolaguys.learnwithme.entity.FlashcardsEntity;
import com.appdevg5.thecolaguys.learnwithme.service.FlashcardsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flashcards")
@CrossOrigin(origins = "http://localhost:3000")
public class FlashcardsController {

    private final FlashcardsService flashcardsService;

    public FlashcardsController(FlashcardsService flashcardsService) {
        this.flashcardsService = flashcardsService;
    }

    @PostMapping("/add")
    public ResponseEntity<FlashcardsEntity> create(@RequestBody FlashcardsEntity card) {
        FlashcardsEntity created = flashcardsService.create(card);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FlashcardsEntity>> getAll() {
        return ResponseEntity.ok(flashcardsService.getAll());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<FlashcardsEntity> getById(@PathVariable Long id) {
        return flashcardsService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/deck/{deckId}")
    public ResponseEntity<List<FlashcardsEntity>> getByDeck(@PathVariable Long deckId) {
        return ResponseEntity.ok(flashcardsService.getByDeckId(deckId));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<FlashcardsEntity> update(@PathVariable Long id, @RequestBody FlashcardsEntity card) {
        return flashcardsService.update(id, card)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = flashcardsService.delete(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}