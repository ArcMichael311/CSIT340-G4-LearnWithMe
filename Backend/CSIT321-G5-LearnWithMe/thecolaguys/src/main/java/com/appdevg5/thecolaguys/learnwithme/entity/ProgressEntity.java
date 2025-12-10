package com.appdevg5.thecolaguys.learnwithme.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "progress")
public class ProgressEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "progress_id")
	private Long progressId;

	@Column(name = "user_id", nullable = false)
	private Long userId;

	@Column(name = "deck_id", nullable = false)
	private Long deckId;

	@Column(name = "card_id")
	private Long cardId;

	@Column(name = "correct_answers", nullable = false)
	private Long correctAnswers;

	@Column(name = "total_answers", nullable = false)
	private Long totalAnswers;

	@Column(name = "accuracy", nullable = false)
	private Integer accuracy; // percentage 0-100

	@Column(name = "study_date", nullable = false)
	private LocalDate studyDate;

	@Column(name = "status")
	private String status;

	public ProgressEntity() {
	}

	public ProgressEntity(Long userId, Long deckId, Long correctAnswers, Long totalAnswers, Integer accuracy, LocalDate studyDate) {
		this.userId = userId;
		this.deckId = deckId;
		this.correctAnswers = correctAnswers;
		this.totalAnswers = totalAnswers;
		this.accuracy = accuracy;
		this.studyDate = studyDate;
	}

	public Long getProgressId() {
		return progressId;
	}

	public void setProgressId(Long progressId) {
		this.progressId = progressId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getDeckId() {
		return deckId;
	}

	public void setDeckId(Long deckId) {
		this.deckId = deckId;
	}

	public Long getCardId() {
		return cardId;
	}

	public void setCardId(Long cardId) {
		this.cardId = cardId;
	}

	public Long getCorrectAnswers() {
		return correctAnswers;
	}

	public void setCorrectAnswers(Long correctAnswers) {
		this.correctAnswers = correctAnswers;
	}

	public Long getTotalAnswers() {
		return totalAnswers;
	}

	public void setTotalAnswers(Long totalAnswers) {
		this.totalAnswers = totalAnswers;
	}

	public Integer getAccuracy() {
		return accuracy;
	}

	public void setAccuracy(Integer accuracy) {
		this.accuracy = accuracy;
	}

	public LocalDate getStudyDate() {
		return studyDate;
	}

	public void setStudyDate(LocalDate studyDate) {
		this.studyDate = studyDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
}

