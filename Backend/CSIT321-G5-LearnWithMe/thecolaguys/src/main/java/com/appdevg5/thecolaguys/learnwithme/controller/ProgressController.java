package com.appdevg5.thecolaguys.learnwithme.controller;

import com.appdevg5.thecolaguys.learnwithme.entity.ProgressEntity;
import com.appdevg5.thecolaguys.learnwithme.service.ProgressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @PostMapping("/add")
    public ResponseEntity<ProgressEntity> create(@RequestBody ProgressEntity p) {
        ProgressEntity created = progressService.create(p);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProgressEntity>> getAll() {
        return ResponseEntity.ok(progressService.getAll());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ProgressEntity> getById(@PathVariable Long id) {
        return progressService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProgressEntity>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(progressService.getByUserId(userId));
    }

    @GetMapping("/card/{cardId}")
    public ResponseEntity<List<ProgressEntity>> getByCard(@PathVariable Long cardId) {
        return ResponseEntity.ok(progressService.getByCardId(cardId));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ProgressEntity> update(@PathVariable Long id, @RequestBody ProgressEntity p) {
        return progressService.update(id, p)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = progressService.delete(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

}

