package com.appdevg5.thecolaguys.learnwithme.controller;

import com.appdevg5.thecolaguys.learnwithme.entity.ProgressEntity;
import com.appdevg5.thecolaguys.learnwithme.service.ProgressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "http://localhost:3000")
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

    @PostMapping("/answer")
    public ResponseEntity<Map<String, Object>> recordDeckProgress(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("[ProgressController] Received request: " + request);
            
            Long userId = Long.valueOf(request.get("userId").toString());
            Long deckId = Long.valueOf(request.get("deckId").toString());
            Long correctAnswers = Long.valueOf(request.get("correctAnswers").toString());
            Long totalAnswers = Long.valueOf(request.get("totalAnswers").toString());
            
            System.out.println("[ProgressController] Parsed values - UserId: " + userId + 
                             ", DeckId: " + deckId + ", Correct: " + correctAnswers + 
                             ", Total: " + totalAnswers);
            
            // Calculate accuracy percentage
            Integer accuracy = totalAnswers > 0 ? (int) Math.round((correctAnswers * 100.0) / totalAnswers) : 0;
            
            ProgressEntity progress = new ProgressEntity();
            progress.setUserId(userId);
            progress.setDeckId(deckId);
            progress.setCardId(0L); // 0 for deck-level progress tracking
            progress.setCorrectAnswers(correctAnswers);
            progress.setTotalAnswers(totalAnswers);
            progress.setAccuracy(accuracy);
            progress.setStudyDate(LocalDate.now());
            progress.setStatus("completed"); // Set status as completed
            
            System.out.println("[ProgressController] Creating progress entity: " + progress);
            
            ProgressEntity created = progressService.create(progress);
            
            Map<String, Object> response = new HashMap<>();
            response.put("progressId", created.getProgressId());
            response.put("correctAnswers", created.getCorrectAnswers());
            response.put("totalAnswers", created.getTotalAnswers());
            response.put("accuracy", created.getAccuracy());
            
            System.out.println("[ProgressController] Successfully recorded deck progress - UserId: " + userId + 
                             ", DeckId: " + deckId + ", Correct: " + correctAnswers + 
                             "/" + totalAnswers + ", Accuracy: " + accuracy + "%");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("[ProgressController] Error recording deck progress: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("request", request);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/deck/{deckId}/score")
    public ResponseEntity<Map<String, Object>> getDeckScore(@PathVariable Long deckId) {
        try {
            List<ProgressEntity> deckProgress = progressService.getByDeckId(deckId);
            
            if (deckProgress.isEmpty()) {
                // No progress data for this deck
                Map<String, Object> response = new HashMap<>();
                response.put("deckId", deckId);
                response.put("correct", 0);
                response.put("total", 0);
                response.put("percentage", 0);
                response.put("retakes", 0);
                return ResponseEntity.ok(response);
            }
            
            // Aggregate all study sessions for this deck
            long totalCorrect = 0;
            long totalAnswered = 0;
            
            for (ProgressEntity progress : deckProgress) {
                totalCorrect += progress.getCorrectAnswers();
                totalAnswered += progress.getTotalAnswers();
            }
            
            int overallAccuracy = totalAnswered > 0 ? (int) Math.round((totalCorrect * 100.0) / totalAnswered) : 0;
            
            Map<String, Object> response = new HashMap<>();
            response.put("deckId", deckId);
            response.put("correct", totalCorrect);
            response.put("total", totalAnswered);
            response.put("percentage", overallAccuracy);
            response.put("retakes", deckProgress.size()); // Number of study sessions
            
            System.out.println("[ProgressController] Deck score (aggregated) - DeckId: " + deckId + 
                             ", Sessions: " + deckProgress.size() +
                             ", Correct: " + totalCorrect + 
                             ", Total: " + totalAnswered + 
                             ", Accuracy: " + overallAccuracy + "%");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("[ProgressController] Error getting deck score: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
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

    @GetMapping("/deck/{deckId}")
    public ResponseEntity<List<ProgressEntity>> getByDeck(@PathVariable Long deckId) {
        return ResponseEntity.ok(progressService.getByDeckId(deckId));
    }

    @GetMapping("/deck/{deckId}/history")
    public ResponseEntity<List<Map<String, Object>>> getDeckHistory(@PathVariable Long deckId) {
        try {
            List<ProgressEntity> history = progressService.getByDeckId(deckId);
            
            // Transform to more readable format with session numbers
            List<Map<String, Object>> formattedHistory = new java.util.ArrayList<>();
            int sessionNumber = 1;
            
            for (ProgressEntity progress : history) {
                Map<String, Object> session = new HashMap<>();
                session.put("sessionNumber", sessionNumber++);
                session.put("progressId", progress.getProgressId());
                session.put("correctAnswers", progress.getCorrectAnswers());
                session.put("totalAnswers", progress.getTotalAnswers());
                session.put("accuracy", progress.getAccuracy());
                session.put("studyDate", progress.getStudyDate().toString());
                session.put("status", progress.getStatus());
                formattedHistory.add(session);
            }
            
            System.out.println("[ProgressController] Deck history - DeckId: " + deckId + 
                             ", Sessions: " + formattedHistory.size());
            return ResponseEntity.ok(formattedHistory);
        } catch (Exception e) {
            System.err.println("[ProgressController] Error getting deck history: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
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