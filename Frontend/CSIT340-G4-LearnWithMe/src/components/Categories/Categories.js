import React, { useState, useEffect } from 'react';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [availableDecks, setAvailableDecks] = useState([]);
  const [linkedDecks, setLinkedDecks] = useState([]);
  const [viewLinkedDecks, setViewLinkedDecks] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#667eea'
  });

  const colors = ['#667eea', '#48bb78', '#f56565', '#ed8936', '#9f7aea', '#38b2ac'];
  const CATEGORIES_API = 'http://localhost:8080/api/categories';
  const DECKS_API = 'http://localhost:8080/api/decks';

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(CATEGORIES_API);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDecks = async () => {
    try {
      const response = await fetch(DECKS_API);
      if (response.ok) {
        const data = await response.json();
        setAvailableDecks(data);
      }
    } catch (error) {
      console.error('Error fetching decks:', error);
    }
  };

  const fetchLinkedDecks = async (categoryId) => {
    try {
      const response = await fetch(`${CATEGORIES_API}/${categoryId}/get-linked-decks`);
      if (response.ok) {
        const data = await response.json();
        setViewLinkedDecks(data);
        // Also set linkedDecks with just the IDs for editing purposes
        const deckIds = data.map(deck => deck.deckId);
        setLinkedDecks(deckIds);
      } else {
        setViewLinkedDecks([]);
        setLinkedDecks([]);
      }
    } catch (error) {
      console.error('Error fetching linked decks:', error);
      setViewLinkedDecks([]);
      setLinkedDecks([]);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(CATEGORIES_API + '/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCategory)
      });

      if (response.ok) {
        const createdCategory = await response.json();
        setCategories([...categories, createdCategory]);
        setShowCreateModal(false);
        setNewCategory({ name: '', description: '', color: '#667eea' });
        alert('Category created successfully!');
      } else {
        console.error('Response status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        alert('Failed to create category. Status: ' + response.status);
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Error creating category: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This will not delete the decks.')) {
      try {
        setLoading(true);
        const response = await fetch(`${CATEGORIES_API}/delete/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setCategories(categories.filter(category => category.categoryId !== id));
        } else {
          alert('Failed to delete category. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOpenLinkModal = async (category) => {
    setSelectedCategory(category);
    await fetchAvailableDecks();
    // Fetch currently linked decks and pre-select them
    await fetchLinkedDecks(category.categoryId);
    setShowLinkModal(true);
  };

  const handleOpenViewModal = async (category) => {
    setSelectedCategory(category);
    await fetchLinkedDecks(category.categoryId);
    setShowViewModal(true);
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

  const handleSaveLinks = async () => {
    if (!selectedCategory) return;
    
    try {
      setLoading(true);
      // Send linked decks to backend
      const response = await fetch(`${CATEGORIES_API}/${selectedCategory.categoryId}/link-decks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deckIds: linkedDecks })
      });

      if (response.ok) {
        // Refresh categories to update deck counts
        await fetchCategories();
        setShowLinkModal(false);
        setLinkedDecks([]);
        setSelectedCategory(null);
        alert('Decks linked successfully!');
      } else {
        console.error('Response status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        alert('Failed to link decks. Status: ' + response.status);
      }
    } catch (error) {
      console.error('Error linking decks:', error);
      alert('Error linking decks: ' + error.message);
    } finally {
      setLoading(false);
    }
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
                onClick={() => handleDeleteCategory(category.categoryId)}
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
              <button className="category-action-btn secondary" onClick={() => handleOpenViewModal(category)}>
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
                {availableDecks.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#a0a0a0', padding: '1rem' }}>
                    No decks available. Create a deck first!
                  </p>
                ) : (
                  availableDecks.map(deck => (
                    <div key={deck.deckId} className="deck-item">
                      <label className="deck-checkbox-label">
                        <input
                          type="checkbox"
                          checked={linkedDecks.includes(deck.deckId)}
                          onChange={() => handleToggleDeckLink(deck.deckId)}
                        />
                        <span className="deck-name">{deck.title}</span>
                      </label>
                    </div>
                  ))
                )}
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

      {/* View Linked Decks Modal */}
      {showViewModal && selectedCategory && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Decks in {selectedCategory.name}</h2>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>×</button>
            </div>
            
            <div className="link-decks-container">
              <div className="decks-list">
                {viewLinkedDecks.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#a0a0a0', padding: '2rem' }}>
                    No decks linked to this category yet.
                  </p>
                ) : (
                  viewLinkedDecks.map(deck => (
                    <div key={deck.deckId} className="deck-item-view">
                      <div className="deck-info">
                        <div className="deck-name">{deck.title}</div>
                        <div className="deck-description">{deck.description}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-submit"
                onClick={() => setShowViewModal(false)}
                style={{ width: '100%' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
