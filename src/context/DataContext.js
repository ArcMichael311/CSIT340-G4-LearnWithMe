import React, { createContext, useEffect, useState } from 'react';

export const DataContext = createContext();

const STORAGE_KEY = 'learnwithme2_data_v1';

const defaultData = {
  users: [{ id: 1, name: 'Default User' }],
  decks: [],
  flashcards: [],
  progress: [],
  categories: [
    { id: 1, name: 'Language' },
    { id: 2, name: 'Science' },
    { id: 3, name: 'Math' }
  ],
  deck_categories: []
};

function DataProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : defaultData;
    } catch (e) {
      console.error('Failed to parse storage, using defaults', e);
      return defaultData;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to persist data', e);
    }
  }, [data]);

  const createDeck = (deck) => {
    const id = Date.now();
    setData(prev => ({ ...prev, decks: [...prev.decks, { id, ...deck }] }));
    return id;
  };

  const createFlashcard = (flashcard) => {
    const id = Date.now();
    setData(prev => ({ ...prev, flashcards: [...prev.flashcards, { id, ...flashcard }] }));
    return id;
  };

  const addProgress = (progressEntry) => {
    const id = Date.now();
    setData(prev => ({ ...prev, progress: [...prev.progress, { id, ...progressEntry }] }));
    return id;
  };

  const getFlashcardsForDeck = (deckId) => {
    return data.flashcards.filter(fc => fc.deckId === deckId);
  };

  const getDeckCategories = (deckId) => {
    const deckCats = data.deck_categories.filter(dc => dc.deckId === deckId);
    return deckCats.map(dc => data.categories.find(c => c.id === dc.categoryId)).filter(Boolean);
  };

  const deleteFlashcard = (flashcardId) => {
    setData(prev => ({ 
      ...prev, 
      flashcards: prev.flashcards.filter(fc => fc.id !== flashcardId) 
    }));
  };

  const deleteDeck = (deckId) => {
    setData(prev => ({ 
      ...prev, 
      decks: prev.decks.filter(d => d.id !== deckId),
      flashcards: prev.flashcards.filter(fc => fc.deckId !== deckId),
      deck_categories: prev.deck_categories.filter(dc => dc.deckId !== deckId)
    }));
  };

  const value = {
    data,
    createDeck,
    createFlashcard,
    addProgress,
    setData,
    getFlashcardsForDeck,
    getDeckCategories,
    deleteFlashcard,
    deleteDeck
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export default DataProvider;
