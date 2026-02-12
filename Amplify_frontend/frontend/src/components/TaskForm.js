import React, { useState, useEffect, useRef } from 'react';
import { Auth } from 'aws-amplify';

const API_URL = process.env.REACT_APP_API_URL;

const TaskForm = ({ 
  newTask, 
  setNewTask, 
  onSubmit, 
  loading,
  isEdit = false
}) => {
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchMembers = async () => {
    try {
      setLoadingMembers(true);
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter to only show active members (exclude admins)
        const activeMembers = (data.users || []).filter(user => 
          user.status === 'active' && user.role === 'member'
        );
        setMembers(activeMembers);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleMemberSelection = (email) => {
    if (!newTask.assignedTo.includes(email)) {
      setNewTask({ ...newTask, assignedTo: [...newTask.assignedTo, email] });
    }
    setSearchTerm('');
    setShowDropdown(false);
  };

  const removeMember = (email) => {
    setNewTask({ 
      ...newTask, 
      assignedTo: newTask.assignedTo.filter(e => e !== email) 
    });
  };

  const filteredMembers = members.filter(member => 
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !newTask.assignedTo.includes(member.email)
  );

  return (
    <section className="create-task">
      <h2>{isEdit ? 'Update Task' : 'Create New Task'}</h2>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Task Title *"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Task Description *"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          required
        />
        
        <div className="assignees-section">
          <label>Assign to Members: *</label>
          
          {/* Selected members tags */}
          {newTask.assignedTo.length > 0 && (
            <div className="selected-members-tags">
              {newTask.assignedTo.map((email) => (
                <span key={email} className="member-tag">
                  {email}
                  <button 
                    type="button" 
                    onClick={() => removeMember(email)}
                    className="remove-tag-btn"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Searchable dropdown */}
          <div className="search-dropdown-container" ref={dropdownRef}>
            <input
              type="text"
              placeholder="Search and select members..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="search-input"
              disabled={loadingMembers}
            />
            <span className="dropdown-arrow" onClick={() => !loadingMembers && setShowDropdown(!showDropdown)}>▼</span>
            
            {showDropdown && (
              <div className="dropdown-list">
                {loadingMembers ? (
                  <div className="dropdown-item">Loading...</div>
                ) : filteredMembers.length === 0 ? (
                  <div className="dropdown-item">
                    {searchTerm ? 'No members found' : 'No members available'}
                  </div>
                ) : (
                  filteredMembers.map((member) => (
                    <div
                      key={member.email}
                      className="dropdown-item"
                      onClick={() => handleMemberSelection(member.email)}
                    >
                      <span className="member-email">{member.email}</span>
                      <span className="member-role">({member.role})</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Due Date:</label>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Priority:</label>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || newTask.assignedTo.length === 0}
        >
          {isEdit ? 'Update' : 'Create Task'}
        </button>
      </form>
    </section>
  );
};

export default TaskForm;
