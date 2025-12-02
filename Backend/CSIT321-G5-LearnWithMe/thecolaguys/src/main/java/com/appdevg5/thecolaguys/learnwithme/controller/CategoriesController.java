package com.appdevg5.thecolaguys.learnwithme.controller;

import com.appdevg5.thecolaguys.learnwithme.entity.CategoriesEntity;
import com.appdevg5.thecolaguys.learnwithme.service.CategoriesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoriesController {

    private final CategoriesService categoriesService;

    public CategoriesController(CategoriesService categoriesService) {
        this.categoriesService = categoriesService;
    }

    @PostMapping("/add")
    public ResponseEntity<CategoriesEntity> create(@RequestBody CategoriesEntity c) {
        CategoriesEntity created = categoriesService.create(c);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CategoriesEntity>> getAll() {
        return ResponseEntity.ok(categoriesService.getAll());
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
}

