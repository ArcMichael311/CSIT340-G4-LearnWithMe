package com.appdevg5.thecolaguys.learnwithme.controller;

import com.appdevg5.thecolaguys.learnwithme.entity.Deck_CategoriesEntity;
import com.appdevg5.thecolaguys.learnwithme.service.Deck_CategoriesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deck-categories")
@CrossOrigin(origins = "http://localhost:3000")
public class Deck_CategoriesController {

    private final Deck_CategoriesService deck_categoriesService;

    public Deck_CategoriesController(Deck_CategoriesService deck_categoriesService) {
        this.deck_categoriesService = deck_categoriesService;
    }

    @PostMapping("/add")
    public ResponseEntity<Deck_CategoriesEntity> create(@RequestBody Deck_CategoriesEntity dc) {
        return new ResponseEntity<>(deck_categoriesService.create(dc), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Deck_CategoriesEntity>> getAll() {
        return ResponseEntity.ok(deck_categoriesService.getAll());
    }

    @GetMapping("/deck/{deckId}")
    public ResponseEntity<List<Deck_CategoriesEntity>> getByDeck(@PathVariable Long deckId) {
        return ResponseEntity.ok(deck_categoriesService.getByDeckId(deckId));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Deck_CategoriesEntity>> getByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(deck_categoriesService.getByCategoryId(categoryId));
    }

    @DeleteMapping("/deck/{deckId}/category/{categoryId}")
    public ResponseEntity<Void> delete(@PathVariable Long deckId, @PathVariable Long categoryId) {
        if (deck_categoriesService.exists(deckId, categoryId)) {
            deck_categoriesService.delete(deckId, categoryId);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

