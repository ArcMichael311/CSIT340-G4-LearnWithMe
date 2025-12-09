package com.appdevg5.thecolaguys.learnwithme.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "deck_categories")
@IdClass(Deck_CategoriesId.class)
public class Deck_CategoriesEntity {

    @Id
    @Column(name = "deck_id")
    private Long deckId;

    @Id
    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "category_name", nullable = false, length = 255)
    private String categoryName;

    @Column(name = "description", length = 1000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "deck_id", insertable = false, updatable = false)
    private DecksEntity deck;

    @ManyToOne
    @JoinColumn(name = "category_id", insertable = false, updatable = false)
    private CategoriesEntity category;

    public Deck_CategoriesEntity() {
    }

    public Deck_CategoriesEntity(Long deckId, Long categoryId) {
        this.deckId = deckId;
        this.categoryId = categoryId;
    }

    public Deck_CategoriesEntity(Long deckId, Long categoryId, String categoryName, String description) {
        this.deckId = deckId;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.description = description;
    }

    public Long getDeckId() {
        return deckId;
    }

    public void setDeckId(Long deckId) {
        this.deckId = deckId;
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

    public DecksEntity getDeck() {
        return deck;
    }

    public void setDeck(DecksEntity deck) {
        this.deck = deck;
    }

    public CategoriesEntity getCategory() {
        return category;
    }

    public void setCategory(CategoriesEntity category) {
        this.category = category;
    }
}

