import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FeedbackModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
    email: '',
    priority: 'medium'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = [
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'improvement', label: 'Improvement Suggestion' },
    { value: 'question', label: 'General Question' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData = {
        ...formData,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };

      if (onSubmit) {
        await onSubmit(feedbackData);
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      setErrors({ submit: 'Failed to submit feedback. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      category: '',
      subject: '',
      description: '',
      email: '',
      priority: 'medium'
    });
    setErrors({});
    setSubmitSuccess(false);
    setIsSubmitting(false);
    if (onClose) {
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modal: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      maxWidth: '500px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 24px',
      borderBottom: '1px solid #e0e0e0'
    },
    title: {
      margin: 0,
      fontSize: '20px',
      fontWeight: 600,
      color: '#333'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#666',
      padding: '0',
      lineHeight: 1
    },
    body: {
      padding: '24px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontSize: '14px',
      fontWeight: 500,
      color: '#333'
    },
    required: {
      color: '#dc3545'
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      fontSize: '14px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s'
    },
    inputError: {
      borderColor: '#dc3545'
    },
    select: {
      width: '100%',
      padding: '10px 12px',
      fontSize: '14px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      boxSizing: 'border-box',
      backgroundColor: '#fff',
      cursor: 'pointer'
    },
    textarea: {
      width: '100%',
      padding: '10px 12px',
      fontSize: '14px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      boxSizing: 'border-box',
      minHeight: '120px',
      resize: 'vertical',
      fontFamily: 'inherit'
    },
    errorText: {
      color: '#dc3545',
      fontSize: '12px',
      marginTop: '4px'
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      padding: '16px 24px',
      borderTop: '1px solid #e0e0e0',
      backgroundColor: '#f8f9fa'
    },
    button: {
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: 500,
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.2s, opacity 0.2s'
    },
    cancelButton: {
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      color: '#333'
    },
    submitButton: {
      backgroundColor: '#007bff',
      border: '1px solid #007bff',
      color: '#fff'
    },
    submitButtonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    successMessage: {
      textAlign: 'center',
      padding: '40px 24px',
      color: '#28a745'
    },
    successIcon: {
      fontSize: '48px',
      marginBottom: '16px'
    },
    successText: {
      fontSize: '18px',
      fontWeight: 500
    }
  };

  return (
    <div
      style={modalStyles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      <div style={modalStyles.modal}>
        <div style={modalStyles.header}>
          <h2 id="feedback-modal-title" style={modalStyles.title}>
            Submit Feedback
          </h2>
          <button
            style={modalStyles.closeButton}
            onClick={handleClose}
            aria-label="Close modal"
            type="button"
          >
            ×
          </button>
        </div>

        {submitSuccess ? (
          <div style={modalStyles.successMessage}>
            <div style={modalStyles.successIcon}>✓</div>
            <p style={modalStyles.successText}>Thank you for your feedback!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={modalStyles.body}>
              {errors.submit && (
                <div style={{ ...modalStyles.errorText, marginBottom: '16px', textAlign: 'center' }}>
                  {errors.submit}
                </div>
              )}

              <div style={modalStyles.formGroup}>
                <label htmlFor="category" style={modalStyles.label}>
                  Category <span style={modalStyles.required}>*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{
                    ...modalStyles.select,
                    ...(errors.category ? modalStyles.inputError : {})
                  }}
                  aria-describedby={errors.category ? 'category-error' : undefined}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <div id="category-error" style={modalStyles.errorText}>
                    {errors.category}
                  </div>
                )}
              </div>

              <div style={modalStyles.formGroup}>
                <label htmlFor="subject" style={modalStyles.label}>
                  Subject <span style={modalStyles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief summary of your feedback"
                  style={{
                    ...modalStyles.input,
                    ...(errors.subject ? modalStyles.inputError : {})
                  }}
                  aria-describedby={errors.subject ? 'subject-error' : undefined}
                />
                {errors.subject && (
                  <div id="subject-error" style={modalStyles.errorText}>
                    {errors.subject}
                  </div>
                )}
              </div>

              <div style={modalStyles.formGroup}>
                <label htmlFor="description" style={modalStyles.label}>
                  Description <span style={modalStyles.required}>*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Please provide detailed information about your issue or suggestion..."
                  style={{
                    ...modalStyles.textarea,
                    ...(errors.description ? modalStyles.inputError : {})
                  }}
                  aria-describedby={errors.description ? 'description-error' : undefined}
                />
                {errors.description && (
                  <div id="description-error" style={modalStyles.errorText}>
                    {errors.description}
                  </div>
                )}
              </div>

              <div style={modalStyles.formGroup}>
                <label htmlFor="priority" style={modalStyles.label}>
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  style={modalStyles.select}
                >
                  {priorities.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={modalStyles.formGroup}>
                <label htmlFor="email" style={modalStyles.label}>
                  Email (optional)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  style={{
                    ...modalStyles.input,
                    ...(errors.email ? modalStyles.inputError : {})
                  }}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <div id="email-error" style={modalStyles.errorText}>
                    {errors.email}
                  </div>
                )}
              </div>
            </div>

            <div style={modalStyles.footer}>
              <button
                type="button"
                onClick={handleClose}
                style={{ ...modalStyles.button, ...modalStyles.cancelButton }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  ...modalStyles.button,
                  ...modalStyles.submitButton,
                  ...(isSubmitting ? modalStyles.submitButtonDisabled : {})
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

FeedbackModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func
};

FeedbackModal.defaultProps = {
  onSubmit: null
};

export default FeedbackModal;
