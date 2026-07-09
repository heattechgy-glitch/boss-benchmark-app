import React from 'react';
import './PropertyCard.css';

interface PropertyCardProps {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  imageUrl: string;
  status?: 'available' | 'pending' | 'sold';
  onClick?: (id: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  address,
  price,
  bedrooms,
  bathrooms,
  sqft,
  imageUrl,
  status = 'available',
  onClick
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <div
      className="property-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="property-card__image-container">
        <img
          src={imageUrl}
          alt={title}
          className="property-card__image"
          loading="lazy"
        />
        <span className={`property-card__status property-card__status--${status}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <div className="property-card__content">
        <h3 className="property-card__title">{title}</h3>
        <p className="property-card__address">{address}</p>
        <p className="property-card__price">{formatPrice(price)}</p>
        <div className="property-card__details">
          <span className="property-card__detail">
            <span className="property-card__detail-value">{bedrooms}</span>
            <span className="property-card__detail-label">Beds</span>
          </span>
          <span className="property-card__detail">
            <span className="property-card__detail-value">{bathrooms}</span>
            <span className="property-card__detail-label">Baths</span>
          </span>
          <span className="property-card__detail">
            <span className="property-card__detail-value">{sqft.toLocaleString()}</span>
            <span className="property-card__detail-label">Sqft</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
