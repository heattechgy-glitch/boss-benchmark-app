import React, { useState } from 'react';
import './CreditsDisplay.css';

const CreditsDisplay = ({ credits, onPurchaseCredits, isLoading }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const creditPackages = [
    { id: 1, amount: 100, price: 9.99 },
    { id: 2, amount: 250, price: 19.99 },
    { id: 3, amount: 500, price: 34.99 },
    { id: 4, amount: 1000, price: 59.99 }
  ];

  const handlePurchaseClick = (pkg) => {
    setSelectedPackage(pkg);
    setShowModal(true);
  };

  const handleConfirmPurchase = () => {
    if (selectedPackage && onPurchaseCredits) {
      onPurchaseCredits(selectedPackage);
    }
    setShowModal(false);
    setSelectedPackage(null);
  };

  const handleCancelPurchase = () => {
    setShowModal(false);
    setSelectedPackage(null);
  };

  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancelPurchase();
    }
  };

  return (
    <div className="credits-display">
      <div className="credits-header">
        <h2>Your Credits</h2>
        <div className="credits-balance">
          <span className="credits-amount">{credits || 0}</span>
          <span className="credits-label">credits</span>
        </div>
      </div>

      <div className="credits-packages">
        <h3>Purchase Credits</h3>
        <div className="packages-grid">
          {creditPackages.map((pkg) => (
            <div key={pkg.id} className="package-card">
              <div className="package-amount">{pkg.amount} Credits</div>
              <div className="package-price">${pkg.price.toFixed(2)}</div>
              <button
                className="purchase-button"
                onClick={() => handlePurchaseClick(pkg)}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Purchase'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleModalBackdropClick}>
          <div className="confirmation-modal">
            <div className="modal-header">
              <h3>Confirm Purchase</h3>
              <button className="modal-close" onClick={handleCancelPurchase}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              {selectedPackage && (
                <>
                  <p>You are about to purchase:</p>
                  <div className="purchase-summary">
                    <span className="summary-amount">{selectedPackage.amount} Credits</span>
                    <span className="summary-price">${selectedPackage.price.toFixed(2)}</span>
                  </div>
                  <p className="confirmation-text">
                    Are you sure you want to proceed with this purchase?
                  </p>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="cancel-button"
                onClick={handleCancelPurchase}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="confirm-button"
                onClick={handleConfirmPurchase}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Confirm Purchase'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditsDisplay;
