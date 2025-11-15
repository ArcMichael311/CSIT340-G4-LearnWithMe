import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = ({ flashcardSets, onUpdateSets, onStartStudy, onLoadSampleData }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSet, setNewSet] = useState({
    title: '',
    description: '',
    cards: [{ front: '', back: '' }]
  });
  const [editingSet, setEditingSet] = useState(null);

  const handleCreateSet = () => {
    if (!newSet.title.trim()) return;
    
    const validCards = newSet.cards.filter(card => 
      card.front.trim() && card.back.trim()
    );
    
    if (validCards.length === 0) return;

    const newFlashcardSet = {
      id: Date.now(),
      title: newSet.title,
      description: newSet.description,
      cards: validCards,
      createdAt: new Date().toISOString(),
      lastStudied: null,
      studyProgress: 0
    };

    onUpdateSets([...flashcardSets, newFlashcardSet]);
    setNewSet({ title: '', description: '', cards: [{ front: '', back: '' }] });
    setShowCreateForm(false);
  };

  const handleDeleteSet = (setId) => {
    if (window.confirm('Are you sure you want to delete this flashcard set?')) {
      onUpdateSets(flashcardSets.filter(set => set.id !== setId));
    }
  };

  const handleEditSet = (set) => {
    setEditingSet({ ...set });
  };

  const handleUpdateSet = () => {
    if (!editingSet.title.trim()) return;
    
    const validCards = editingSet.cards.filter(card => 
      card.front.trim() && card.back.trim()
    );
    
    if (validCards.length === 0) return;

    const updatedSets = flashcardSets.map(set => 
      set.id === editingSet.id 
        ? { ...editingSet, cards: validCards }
        : set
    );
    
    onUpdateSets(updatedSets);
    setEditingSet(null);
  };

  const addCard = (isEditing = false) => {
    if (isEditing) {
      setEditingSet({
        ...editingSet,
        cards: [...editingSet.cards, { front: '', back: '' }]
      });
    } else {
      setNewSet({
        ...newSet,
        cards: [...newSet.cards, { front: '', back: '' }]
      });
    }
  };

  const removeCard = (index, isEditing = false) => {
    if (isEditing) {
      const cards = editingSet.cards.filter((_, i) => i !== index);
      setEditingSet({ ...editingSet, cards });
    } else {
      const cards = newSet.cards.filter((_, i) => i !== index);
      setNewSet({ ...newSet, cards });
    }
  };

  const updateCard = (index, field, value, isEditing = false) => {
    if (isEditing) {
      const cards = [...editingSet.cards];
      cards[index][field] = value;
      setEditingSet({ ...editingSet, cards });
    } else {
      const cards = [...newSet.cards];
      cards[index][field] = value;
      setNewSet({ ...newSet, cards });
    }
  };

  const getStudyStats = () => {
    const totalSets = flashcardSets.length;
    const totalCards = flashcardSets.reduce((sum, set) => sum + set.cards.length, 0);
    const studiedSets = flashcardSets.filter(set => set.lastStudied).length;
    
    return { totalSets, totalCards, studiedSets };
  };

  const stats = getStudyStats();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📚 Your Flashcard Dashboard</h2>
        <button 
          className="create-btn"
          onClick={() => setShowCreateForm(true)}
        >
          + Create New Set
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalSets}</div>
          <div className="stat-label">Total Sets</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalCards}</div>
          <div className="stat-label">Total Cards</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.studiedSets}</div>
          <div className="stat-label">Sets Studied</div>
        </div>
      </div>

      {flashcardSets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No flashcard sets yet</h3>
          <p>Create your first set to start learning, or try our sample sets!</p>
          <div className="empty-actions">
            <button 
              className="create-first-btn"
              onClick={() => setShowCreateForm(true)}
            >
              Create Your First Set
            </button>
            <button 
              className="sample-data-btn"
              onClick={onLoadSampleData}
            >
              Load Sample Sets
            </button>
          </div>
        </div>
      ) : (
        <div className="sets-grid">
          {flashcardSets.map(set => (
            <div key={set.id} className="set-card">
              <div className="set-header">
                <h3>{set.title}</h3>
                <div className="set-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditSet(set)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteSet(set.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              {set.description && (
                <p className="set-description">{set.description}</p>
              )}
              
              <div className="set-info">
                <span className="card-count">{set.cards.length} cards</span>
                {set.lastStudied && (
                  <span className="last-studied">
                    Last studied: {new Date(set.lastStudied).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              <button 
                className="study-btn"
                onClick={onStartStudy}
              >
                Study Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Set Modal */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create New Flashcard Set</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCreateForm(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newSet.title}
                  onChange={(e) => setNewSet({ ...newSet, title: e.target.value })}
                  placeholder="Enter set title"
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newSet.description}
                  onChange={(e) => setNewSet({ ...newSet, description: e.target.value })}
                  placeholder="Optional description"
                  rows="2"
                />
              </div>
              
              <div className="cards-section">
                <label>Cards</label>
                {newSet.cards.map((card, index) => (
                  <div key={index} className="card-form">
                    <div className="card-inputs">
                      <input
                        type="text"
                        placeholder="Front (Question)"
                        value={card.front}
                        onChange={(e) => updateCard(index, 'front', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Back (Answer)"
                        value={card.back}
                        onChange={(e) => updateCard(index, 'back', e.target.value)}
                      />
                    </div>
                    {newSet.cards.length > 1 && (
                      <button 
                        className="remove-card-btn"
                        onClick={() => removeCard(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                
                <button 
                  className="add-card-btn"
                  onClick={() => addCard()}
                >
                  + Add Card
                </button>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={handleCreateSet}
              >
                Create Set
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Set Modal */}
      {editingSet && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Flashcard Set</h3>
              <button 
                className="close-btn"
                onClick={() => setEditingSet(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={editingSet.title}
                  onChange={(e) => setEditingSet({ ...editingSet, title: e.target.value })}
                  placeholder="Enter set title"
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editingSet.description}
                  onChange={(e) => setEditingSet({ ...editingSet, description: e.target.value })}
                  placeholder="Optional description"
                  rows="2"
                />
              </div>
              
              <div className="cards-section">
                <label>Cards</label>
                {editingSet.cards.map((card, index) => (
                  <div key={index} className="card-form">
                    <div className="card-inputs">
                      <input
                        type="text"
                        placeholder="Front (Question)"
                        value={card.front}
                        onChange={(e) => updateCard(index, 'front', e.target.value, true)}
                      />
                      <input
                        type="text"
                        placeholder="Back (Answer)"
                        value={card.back}
                        onChange={(e) => updateCard(index, 'back', e.target.value, true)}
                      />
                    </div>
                    {editingSet.cards.length > 1 && (
                      <button 
                        className="remove-card-btn"
                        onClick={() => removeCard(index, true)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                
                <button 
                  className="add-card-btn"
                  onClick={() => addCard(true)}
                >
                  + Add Card
                </button>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setEditingSet(null)}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={handleUpdateSet}
              >
                Update Set
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
