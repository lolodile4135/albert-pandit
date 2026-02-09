import React, { useState } from 'react';
import { postAPI } from '../utils/api';
import './CreatePostModal.css';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    city: '',
    isRemote: false,
    commitment: '',
    lookingForRoles: [] as string[],
    lookingForSkills: '',
    lookingForCount: 1,
    investmentMin: '',
    investmentMax: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['FOOD', 'RETAIL', 'SERVICE', 'TECH', 'LOCAL_TRADE', 'OTHER'];
  const commitments = ['PART_TIME', 'FULL_TIME'];
  const lookingForRoles = ['CO_FOUNDER', 'INVESTOR', 'PARTNER'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === 'lookingForRoles') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        lookingForRoles: checkbox.checked
          ? [...prev.lookingForRoles, value]
          : prev.lookingForRoles.filter(role => role !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be 1000 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const postData: any = {
        title: formData.title.trim(),
        description: formData.description.trim(),
      };

      // Add optional fields
      if (formData.category) postData.category = formData.category;
      if (formData.city) postData.city = formData.city;
      if (formData.isRemote !== undefined) postData.isRemote = formData.isRemote;
      if (formData.commitment) postData.commitment = formData.commitment;

      // Build lookingFor object
      if (formData.lookingForRoles.length > 0 || formData.lookingForSkills.trim()) {
        postData.lookingFor = {};
        if (formData.lookingForRoles.length > 0) {
          postData.lookingFor.roles = formData.lookingForRoles;
        }
        if (formData.lookingForSkills.trim()) {
          postData.lookingFor.skills = formData.lookingForSkills.split(',').map(s => s.trim()).filter(s => s);
        }
        if (formData.lookingForCount) {
          postData.lookingFor.count = parseInt(formData.lookingForCount.toString());
        }
      }

      // Build investmentRequired object
      if (formData.investmentMin || formData.investmentMax) {
        postData.investmentRequired = {};
        if (formData.investmentMin) {
          postData.investmentRequired.min = parseFloat(formData.investmentMin);
        }
        if (formData.investmentMax) {
          postData.investmentRequired.max = parseFloat(formData.investmentMax);
        }
      }

      const response = await postAPI.createPost(postData);

      if (response.success) {
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          city: '',
          isRemote: false,
          commitment: '',
          lookingForRoles: [],
          lookingForSkills: '',
          lookingForCount: 1,
          investmentMin: '',
          investmentMax: '',
        });
        setErrors({});
        onSuccess();
        onClose();
      } else {
        setErrors({ submit: response.message || 'Failed to create post' });
      }
    } catch (error: any) {
      console.error('Error creating post:', error);
      setErrors({ submit: error.message || 'Failed to create post. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: '',
        description: '',
        category: '',
        city: '',
        isRemote: false,
        commitment: '',
        lookingForRoles: [],
        lookingForSkills: '',
        lookingForCount: 1,
        investmentMin: '',
        investmentMax: '',
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Post</h2>
          <button className="modal-close-btn" onClick={handleClose} disabled={isSubmitting}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-post-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              maxLength={100}
              required
              disabled={isSubmitting}
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
            <span className="char-count">{formData.title.length}/100</span>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your idea or opportunity..."
              rows={5}
              maxLength={1000}
              required
              disabled={isSubmitting}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
            <span className="char-count">{formData.description.length}/1000</span>
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isRemote"
                  checked={formData.isRemote}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                Remote work available
              </label>
            </div>
          </div>

          {/* Commitment */}
          <div className="form-group">
            <label htmlFor="commitment">Commitment Level</label>
            <select
              id="commitment"
              name="commitment"
              value={formData.commitment}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">Select commitment</option>
              {commitments.map(comm => (
                <option key={comm} value={comm}>{comm.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          {/* Looking For */}
          <div className="form-section">
            <h3>Looking For</h3>
            
            <div className="form-group">
              <label>Roles Needed</label>
              <div className="checkbox-list">
                {lookingForRoles.map(role => (
                  <label key={role} className="checkbox-item">
                    <input
                      type="checkbox"
                      name="lookingForRoles"
                      value={role}
                      checked={formData.lookingForRoles.includes(role)}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {role.replace('_', ' ')}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="lookingForSkills">Required Skills (comma-separated)</label>
              <input
                type="text"
                id="lookingForSkills"
                name="lookingForSkills"
                value={formData.lookingForSkills}
                onChange={handleChange}
                placeholder="e.g., Marketing, Finance, Cooking"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lookingForCount">Number of People Needed</label>
              <input
                type="number"
                id="lookingForCount"
                name="lookingForCount"
                value={formData.lookingForCount}
                onChange={handleChange}
                min="1"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Investment Required */}
          <div className="form-section">
            <h3>Investment Required (Optional)</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="investmentMin">Minimum (₹)</label>
                <input
                  type="number"
                  id="investmentMin"
                  name="investmentMin"
                  value={formData.investmentMin}
                  onChange={handleChange}
                  placeholder="Min amount"
                  min="0"
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="investmentMax">Maximum (₹)</label>
                <input
                  type="number"
                  id="investmentMax"
                  name="investmentMax"
                  value={formData.investmentMax}
                  onChange={handleChange}
                  placeholder="Max amount"
                  min="0"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;

