package com.appdevg5.thecolaguys.learnwithme.controller;

import com.appdevg5.thecolaguys.learnwithme.entity.CategoriesEntity;
import com.appdevg5.thecolaguys.learnwithme.entity.DecksEntity;
import com.appdevg5.thecolaguys.learnwithme.service.CategoriesService;
import com.appdevg5.thecolaguys.learnwithme.service.CategoryDeckService;
import com.appdevg5.thecolaguys.learnwithme.service.Deck_CategoriesService;
import com.appdevg5.thecolaguys.learnwithme.service.DecksService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:3000")
public class CategoriesController {

    private final CategoriesService categoriesService;
    private final CategoryDeckService categoryDeckService;
    private final Deck_CategoriesService deck_categoriesService;
    private final DecksService decksService;

    public CategoriesController(CategoriesService categoriesService, CategoryDeckService categoryDeckService, Deck_CategoriesService deck_categoriesService, DecksService decksService) {
        this.categoriesService = categoriesService;
        this.categoryDeckService = categoryDeckService;
        this.deck_categoriesService = deck_categoriesService;
        this.decksService = decksService;
    }

    @PostMapping("/add")
    public ResponseEntity<CategoriesEntity> create(@RequestBody CategoriesEntity c) {
        try {
            System.out.println("Creating category: " + c.getName());
            System.out.println("Category data - name: " + c.getName() + ", description: " + c.getDescription() + ", color: " + c.getColor());
            CategoriesEntity created = categoriesService.create(c);
            System.out.println("Successfully created category with ID: " + created.getCategoryId());
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error creating category: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<CategoriesEntity>> getAll() {
        try {
            List<CategoriesEntity> categories = categoriesService.getAll();
            System.out.println("Fetching all categories. Count: " + categories.size());
            for (CategoriesEntity cat : categories) {
                System.out.println("  - ID: " + cat.getCategoryId() + ", Name: " + cat.getName());
            }
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            System.err.println("Error fetching categories: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<CategoriesEntity> getById(@PathVariable Long id) {
        return categoriesService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<List<CategoriesEntity>> getByName(@PathVariable String name) {
        return ResponseEntity.ok(categoriesService.findByName(name));
    }

    @GetMapping("/search/{fragment}")
    public ResponseEntity<List<CategoriesEntity>> searchByName(@PathVariable String fragment) {
        return ResponseEntity.ok(categoriesService.searchByName(fragment));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CategoriesEntity> update(@PathVariable Long id, @RequestBody CategoriesEntity c) {
        return categoriesService.update(id, c)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = categoriesService.delete(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/{categoryId}/link-decks")
    public ResponseEntity<Void> linkDecks(@PathVariable Long categoryId, @RequestBody Map<String, List<Long>> payload) {
        try {
            System.out.println("Linking decks to category: " + categoryId);
            System.out.println("Payload: " + payload);
            
            List<Long> deckIds = payload.get("deckIds");
            if (deckIds == null) {
                deckIds = List.of();
            }
            System.out.println("Deck IDs: " + deckIds);
            
            // Get category details to store in the link
            var categoryOpt = categoriesService.getById(categoryId);
            if (categoryOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            CategoriesEntity category = categoryOpt.get();
            // Link to both deck_categories and category_deck tables
            deck_categoriesService.linkDecksToCategory(categoryId, category.getName(), category.getDescription(), deckIds);
            categoryDeckService.linkDecksToCategoryWithDetails(categoryId, category.getName(), category.getDescription(), deckIds);
            System.out.println("Successfully linked decks to both tables");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error linking decks: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{categoryId}/get-linked-decks")
    public ResponseEntity<List<DecksEntity>> getLinkedDecks(@PathVariable Long categoryId) {
        try {
            System.out.println("Fetching linked decks for category: " + categoryId);
            
            List<Long> deckIds = deck_categoriesService.getByCategoryId(categoryId)
                    .stream()
                    .map(link -> link.getDeckId())
                    .toList();
            
            System.out.println("Found " + deckIds.size() + " linked deck IDs: " + deckIds);
            
            List<DecksEntity> decks = deckIds.stream()
                    .map(deckId -> decksService.findById(deckId))
                    .filter(optional -> optional.isPresent())
                    .map(optional -> optional.get())
                    .toList();
            
            System.out.println("Fetched " + decks.size() + " decks from service");
            return ResponseEntity.ok(decks);
        } catch (Exception e) {
            System.err.println("Error fetching linked decks: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
