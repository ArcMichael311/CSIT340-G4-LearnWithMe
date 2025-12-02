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

	@Column(name = "card_id", nullable = false)
	private Long cardId;

	@Column(nullable = false)
	private String status;

	@Column(name = "date")
	private LocalDate date;

	public ProgressEntity() {
	}

	public ProgressEntity(Long progressId, Long userId, Long cardId, String status, LocalDate date) {
		this.progressId = progressId;
		this.userId = userId;
		this.cardId = cardId;
		this.status = status;
		this.date = date;
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

	public Long getCardId() {
		return cardId;
	}

	public void setCardId(Long cardId) {
		this.cardId = cardId;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}
}
