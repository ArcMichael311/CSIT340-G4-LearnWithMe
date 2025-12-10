import React, { useState, useEffect } from 'react';
import './Decks.css';
import Flashcards from '../Flashcards/Flashcards';
import Modal from '../Modal/Modal';

const Decks = ({ onDeckSelect, selectedDeck, currentView, onBackToDecks }) => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info', showCancel: false, onConfirm: null });
  const [newDeck, setNewDeck] = useState({
    title: '',
    description: '',
    color: '#667eea'
  });

  const colors = ['#667eea', '#48bb78', '#f56565', '#ed8936', '#9f7aea', '#38b2ac'];
  const API_BASE_URL = 'http://localhost:8080/api/decks';
  const FLASHCARDS_API_URL = 'http://localhost:8080/api/flashcards';

  // Fetch decks from backend on component mount
  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data = await response.json();
        // Fetch card counts for each deck and check study status
        const decksWithCounts = await Promise.all(
          data.map(async (deck) => {
            try {
              const cardsResponse = await fetch(`${FLASHCARDS_API_URL}/deck/${deck.deckId}`);
              const cards = cardsResponse.ok ? await cardsResponse.json() : [];
              
              // Check if deck was studied from Progress table
              let isStudied = false;
              try {
                const progressResponse = await fetch(`http://localhost:8080/api/progress/deck/${deck.deckId}`);
                if (progressResponse.ok) {
                  const progressList = await progressResponse.json();
                  // If there's any progress data at all, mark as studied
                  isStudied = progressList && progressList.length > 0;
                }
              } catch (progressError) {
                console.error('Error fetching progress:', progressError);
              }
              
              return {
                ...deck,
                cardCount: cards.length,
                color: '#667eea', // Default color
                isStudied: isStudied
              };
            } catch (error) {
              console.error('Error fetching card count:', error);
              return {
                ...deck,
                cardCount: 0,
                color: '#667eea',
                isStudied: false
              };
            }
          })
        );
        setDecks(decksWithCounts);
      }
    } catch (error) {
      console.error('Error fetching decks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeck = async (e) => {
    e.preventDefault();
    
    // Prepare deck object for backend
    const deckToCreate = {
      title: newDeck.title,
      description: newDeck.description
    };

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(deckToCreate)
      });

      if (response.ok) {
        const createdDeck = await response.json();
        
        // Fetch card count for the newly created deck
        const cardsResponse = await fetch(`${FLASHCARDS_API_URL}/deck/${createdDeck.deckId}`);
        const cards = cardsResponse.ok ? await cardsResponse.json() : [];
        
        // Add color and card count to the created deck
        const deckWithColor = { 
          ...createdDeck, 
          color: newDeck.color,
          cardCount: cards.length,
          isStudied: false
        };
        setDecks([...decks, deckWithColor]);
        setShowCreateModal(false);
        setNewDeck({ title: '', description: '', color: '#667eea' });
      } else {
        console.error('Error creating deck:', response.statusText);
        setModal({ isOpen: true, title: 'Error', message: 'Failed to create deck. Please try again.', type: 'error', showCancel: false, onConfirm: null });
      }
    } catch (error) {
      console.error('Error creating deck:', error);
      setModal({ isOpen: true, title: 'Error', message: 'Error creating deck: ' + error.message, type: 'error', showCancel: false, onConfirm: null });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDeck = async (id) => {
    setModal({
      isOpen: true,
      title: 'Delete Deck',
      message: 'Are you sure you want to delete this deck?',
      type: 'warning',
      showCancel: true,
      onConfirm: async () => {
        try {
          setLoading(true);
          const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            setDecks(decks.filter(deck => deck.deckId !== id));
          } else {
            console.error('Error deleting deck:', response.statusText);
            setModal({ isOpen: true, title: 'Error', message: 'Failed to delete deck. Please try again.', type: 'error', showCancel: false, onConfirm: null });
          }
        } catch (error) {
          console.error('Error deleting deck:', error);
          setModal({ isOpen: true, title: 'Error', message: 'Error deleting deck: ' + error.message, type: 'error', showCancel: false, onConfirm: null });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleEditDeck = (deck) => {
    setEditingDeck({
      deckId: deck.deckId,
      title: deck.title,
      description: deck.description,
      color: deck.color || '#667eea'
    });
    setShowEditModal(true);
  };

  const handleUpdateDeck = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${editingDeck.deckId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editingDeck.title,
          description: editingDeck.description
        })
      });

      if (response.ok) {
        const updatedDeck = await response.json();
        setDecks(decks.map(d => 
          d.deckId === editingDeck.deckId 
            ? { ...d, title: updatedDeck.title, description: updatedDeck.description }
            : d
        ));
        setShowEditModal(false);
        setEditingDeck(null);
      } else {
        console.error('Error updating deck:', response.statusText);
        setModal({ isOpen: true, title: 'Error', message: 'Failed to update deck. Please try again.', type: 'error', showCancel: false, onConfirm: null });
      }
    } catch (error) {
      console.error('Error updating deck:', error);
      setModal({ isOpen: true, title: 'Error', message: 'Error updating deck: ' + error.message, type: 'error', showCancel: false, onConfirm: null });
    } finally {
      setLoading(false);
    }
  };

  const handleBackFromFlashcards = () => {
    // Refresh decks to update card counts
    fetchDecks();
    onBackToDecks();
  };

  // Show flashcards if a deck is selected
  if (currentView === 'flashcards' && selectedDeck) {
    return <Flashcards deck={selectedDeck} onBack={handleBackFromFlashcards} />;
  }

  return (
    <div className="decks-container">
      <div className="decks-header">
        <div>
          <h1>My Decks</h1>
          <p>Organize your study materials into decks</p>
        </div>
        <button className="create-deck-btn" onClick={() => setShowCreateModal(true)}>
          <span>+</span> Create New Deck
        </button>
      </div>

      <div className="decks-grid">
        {decks.map(deck => (
          <div key={deck.deckId} className="deck-card" style={{ borderTopColor: deck.color }}>
            <div className="deck-card-header">
              <div className="deck-color-dot" style={{ background: deck.color }}></div>
              <button 
                className="deck-delete-btn"
                onClick={() => handleDeleteDeck(deck.deckId)}
                title="Delete deck"
              >
                Delete Deck
              </button>
            </div>
            
            <h3 className="deck-title">{deck.title}</h3>
            <p className="deck-description">{deck.description}</p>
            
            <div className="deck-stats">
              <div className="stat">
                <span className="stat-icon"></span>
                <span>{deck.cardCount || 0} cards</span>
              </div>
              <div className="stat">
                <span className="stat-icon"></span>
                <span>{deck.isStudied ? '✓ Studied today' : '○ Not studied yet'}</span>
              </div>
            </div>

            <div className="deck-actions">
              <button 
                className="deck-action-btn primary"
                onClick={() => onDeckSelect(deck)}
              >
                Study Now
              </button>
              <button 
                className="deck-action-btn secondary"
                onClick={() => onDeckSelect(deck)}
              >
                View Cards
              </button>
              <button 
                className="deck-action-btn edit"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditDeck(deck);
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Edit
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {decks.length === 0 && (
          <div className="empty-state">
            <h3>No decks yet</h3>
            <p>Create your first deck to start studying!</p>
          </div>
        )}
      </div>

      {/* Create Deck Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Deck</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleCreateDeck}>
              <div className="form-group">
                <label>Deck Title</label>
                <input
                  type="text"
                  placeholder="e.g., Spanish Vocabulary"
                  value={newDeck.title}
                  onChange={(e) => setNewDeck({ ...newDeck, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="What will you study in this deck?"
                  value={newDeck.description}
                  onChange={(e) => setNewDeck({ ...newDeck, description: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Choose a Color</label>
                <div className="color-picker">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`color-option ${newDeck.color === color ? 'selected' : ''}`}
                      style={{ background: color }}
                      onClick={() => setNewDeck({ ...newDeck, color })}
                    />
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-create">
                  Create Deck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Deck Modal */}
      {showEditModal && editingDeck && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Deck</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateDeck}>
              <div className="form-group">
                <label>Deck Title</label>
                <input
                  type="text"
                  placeholder="e.g., Spanish Vocabulary"
                  value={editingDeck.title}
                  onChange={(e) => setEditingDeck({ ...editingDeck, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="What's this deck about?"
                  value={editingDeck.description}
                  onChange={(e) => setEditingDeck({ ...editingDeck, description: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-create">
                  Update Deck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        showCancel={modal.showCancel}
      />
    </div>
  );
};

export default Decks;