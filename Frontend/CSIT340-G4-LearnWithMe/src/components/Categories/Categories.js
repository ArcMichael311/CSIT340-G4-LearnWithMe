import React, { useState } from 'react';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Mathematics',
      description: 'All math-related study materials',
      deckCount: 5,
      color: '#667eea'
    },
    {
      id: 2,
      name: 'Science',
      description: 'Biology, Chemistry, Physics topics',
      deckCount: 8,
      color: '#48bb78'
    },
    {
      id: 3,
      name: 'Languages',
      description: 'Foreign language vocabulary and grammar',
      deckCount: 12,
      color: '#f56565'
    },
    {
      id: 4,
      name: 'History',
      description: 'Historical events and dates',
      deckCount: 3,
      color: '#ed8936'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#667eea'
  });

  const colors = ['#667eea', '#48bb78', '#f56565', '#ed8936', '#9f7aea', '#38b2ac'];

  // Mock decks for linking demonstration
  const [availableDecks] = useState([
    { id: 1, title: 'Spanish Vocabulary', linked: false },
    { id: 2, title: 'Biology Chapter 5', linked: false },
    { id: 3, title: 'World War II', linked: false },
    { id: 4, title: 'Algebra Basics', linked: false }
  ]);

  const [linkedDecks, setLinkedDecks] = useState([]);

  const handleCreateCategory = (e) => {
    e.preventDefault();
    const category = {
      id: Date.now(),
      ...newCategory,
      deckCount: 0
    };
    setCategories([...categories, category]);
    setShowCreateModal(false);
    setNewCategory({ name: '', description: '', color: '#667eea' });
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category? This will not delete the decks.')) {
      setCategories(categories.filter(category => category.id !== id));
    }
  };

  const handleOpenLinkModal = (category) => {
    setSelectedCategory(category);
    setLinkedDecks([]);
    setShowLinkModal(true);
  };

  const handleToggleDeckLink = (deckId) => {
    setLinkedDecks(prev => {
      if (prev.includes(deckId)) {
        return prev.filter(id => id !== deckId);
      } else {
        return [...prev, deckId];
      }
    });
  };

  const handleSaveLinks = () => {
    // Update category deck count
    if (selectedCategory) {
      setCategories(categories.map(cat => 
        cat.id === selectedCategory.id 
          ? { ...cat, deckCount: cat.deckCount + linkedDecks.length }
          : cat
      ));
    }
    setShowLinkModal(false);
    setLinkedDecks([]);
    setSelectedCategory(null);
  };

  return (
    <div className="categories-container">
      <div className="categories-header">
        <div>
          <h1>Categories</h1>
          <p>Organize your decks by subject or topic</p>
        </div>
        <button className="create-category-btn" onClick={() => setShowCreateModal(true)}>
          <span>+</span> Create New Category
        </button>
      </div>

      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card" style={{ borderTopColor: category.color }}>
            <div className="category-card-header">
              <div className="category-color-dot" style={{ background: category.color }}></div>
              <button 
                className="category-delete-btn"
                onClick={() => handleDeleteCategory(category.id)}
                title="Delete category"
              >
                ×
              </button>
            </div>
            
            <h3 className="category-title">{category.name}</h3>
            <p className="category-description">{category.description}</p>
            
            <div className="category-stats">
              <div className="stat">
                <svg className="stat-icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
                <span>{category.deckCount} deck{category.deckCount !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="category-actions">
              <button 
                className="category-action-btn primary"
                onClick={() => handleOpenLinkModal(category)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                </svg>
                Link Decks
              </button>
              <button className="category-action-btn secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                View Decks
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Category</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleCreateCategory}>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="e.g., Mathematics, Science, Languages"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  placeholder="Brief description of this category"
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label>Color</label>
                <div className="color-picker">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`color-option ${newCategory.color === color ? 'selected' : ''}`}
                      style={{ background: color }}
                      onClick={() => setNewCategory({...newCategory, color})}
                    />
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Link Decks Modal */}
      {showLinkModal && selectedCategory && (
        <div className="modal-overlay" onClick={() => setShowLinkModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Link Decks to {selectedCategory.name}</h2>
              <button className="modal-close" onClick={() => setShowLinkModal(false)}>×</button>
            </div>
            
            <div className="link-decks-container">
              <p className="link-instruction">Select decks to add to this category:</p>
              
              <div className="decks-list">
                {availableDecks.map(deck => (
                  <div key={deck.id} className="deck-item">
                    <label className="deck-checkbox-label">
                      <input
                        type="checkbox"
                        checked={linkedDecks.includes(deck.id)}
                        onChange={() => handleToggleDeckLink(deck.id)}
                      />
                      <span className="deck-name">{deck.title}</span>
                    </label>
                  </div>
                ))}
              </div>

              <div className="selected-count">
                {linkedDecks.length} deck{linkedDecks.length !== 1 ? 's' : ''} selected
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setShowLinkModal(false)}>
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-submit"
                onClick={handleSaveLinks}
                disabled={linkedDecks.length === 0}
              >
                Link {linkedDecks.length} Deck{linkedDecks.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
