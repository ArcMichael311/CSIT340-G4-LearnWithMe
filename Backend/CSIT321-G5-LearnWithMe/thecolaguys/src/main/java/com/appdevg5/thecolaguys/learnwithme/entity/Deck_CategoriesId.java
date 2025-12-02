package com.appdevg5.thecolaguys.learnwithme.entity;

import java.io.Serializable;
import java.util.Objects;

public class Deck_CategoriesId implements Serializable {
    private Long deckId;
    private Long categoryId;

    public Deck_CategoriesId() {
    }

    public Deck_CategoriesId(Long deckId, Long categoryId) {
        this.deckId = deckId;
        this.categoryId = categoryId;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Deck_CategoriesId that = (Deck_CategoriesId) o;
        return Objects.equals(deckId, that.deckId) &&
                Objects.equals(categoryId, that.categoryId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(deckId, categoryId);
    }
}
