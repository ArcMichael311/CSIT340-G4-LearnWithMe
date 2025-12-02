package com.appdevg5.thecolaguys.learnwithme.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "decks")
public class DecksEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "deck_id")
	private Long deckId;

	@Column(nullable = false)
	private String title;

	@Column(length = 1000)
	private String description;

	public DecksEntity() {
	}

	public DecksEntity(Long deckId, String title, String description) {
		this.deckId = deckId;
		this.title = title;
		this.description = description;
	}

	public Long getDeckId() {
		return deckId;
	}

	public void setDeckId(Long deckId) {
		this.deckId = deckId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
}
