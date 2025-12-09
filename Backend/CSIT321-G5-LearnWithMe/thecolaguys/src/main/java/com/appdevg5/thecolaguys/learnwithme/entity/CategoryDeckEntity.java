package com.appdevg5.thecolaguys.learnwithme.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "category_deck")
public class CategoryDeckEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "category_id", nullable = false)
	private Long categoryId;

	@Column(name = "category_name", nullable = false, length = 255)
	private String categoryName;

	@Column(name = "description", length = 1000)
	private String description;

	@Column(name = "deck_id", nullable = false)
	private Long deckId;

	public CategoryDeckEntity() {
	}

	public CategoryDeckEntity(Long categoryId, String categoryName, String description, Long deckId) {
		this.categoryId = categoryId;
		this.categoryName = categoryName;
		this.description = description;
		this.deckId = deckId;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Long getDeckId() {
		return deckId;
	}

	public void setDeckId(Long deckId) {
		this.deckId = deckId;
	}
}
