package com.appdevg5.thecolaguys.learnwithme.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "flashcards")
public class FlashcardsEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "card_id")
	private Long cardId;

	@Column(nullable = false, length = 1000)
	private String question;

	@Column(nullable = false, length = 1000)
	private String answer;

	@Column(name = "deck_id", nullable = false)
	private Long deckId;

	@Column(name = "options", columnDefinition = "JSON", nullable = true)
	private String options;

	public FlashcardsEntity() {
	}

	public FlashcardsEntity(Long cardId, String question, String answer, Long deckId, String options) {
		this.cardId = cardId;
		this.question = question;
		this.answer = answer;
		this.deckId = deckId;
		this.options = options;
	}

	public Long getCardId() {
		return cardId;
	}

	public void setCardId(Long cardId) {
		this.cardId = cardId;
	}

	public String getQuestion() {
		return question;
	}

	public void setQuestion(String question) {
		this.question = question;
	}

	public String getAnswer() {
		return answer;
	}

	public void setAnswer(String answer) {
		this.answer = answer;
	}

	public Long getDeckId() {
		return deckId;
	}

	public void setDeckId(Long deckId) {
		this.deckId = deckId;
	}

	public String getOptions() {
		return options;
	}

	public void setOptions(String options) {
		this.options = options;
	}
}
