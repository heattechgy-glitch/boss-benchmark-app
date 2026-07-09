import React from 'react';
import styled from 'styled-components';
import { FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';

export const PropertyCard = ({ property }) => {
  return (
    <Card>
      <ImageContainer>
        <Image src={property.image} alt={property.title} />
        <Price>${property.price.toLocaleString()}</Price>
        <Status status={property.status}>{property.status}</Status>
      </ImageContainer>
      <Content>
        <Title>{property.title}</Title>
        <Address>{property.address}</Address>
        <Features>
          <Feature>
            <FaBed />
            <span>{property.bedrooms} beds</span>
          </Feature>
          <Feature>
            <FaBath />
            <span>{property.bathrooms} baths</span>
          </Feature>
          <Feature>
            <FaRulerCombined />
            <span>{property.sqft.toLocaleString()} sqft</span>
          </Feature>
        </Features>
        <Description>{property.description}</Description>
        <AgentInfo>
          <AgentImage src={property.agent.image} alt={property.agent.name} />
          <AgentDetails>
            <AgentName>{property.agent.name}</AgentName>
            <AgentPhone>{property.agent.phone}</AgentPhone>
          </AgentDetails>
        </AgentInfo>
      </Content>
    </Card>
  );
};

const Card = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 600px) {
    flex-direction: column;
    height: auto;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 200px;
  flex-shrink: 0;

  @media (max-width: 600px) {
    width: 100%;
    height: 180px;
    min-height: 180px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Price = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1.1rem;

  @media (max-width: 600px) {
    top: 12px;
    left: 12px;
    padding: 6px 12px;
    font-size: 1rem;
  }
`;

const Status = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: ${props => props.status === 'For Sale' ? '#10b981' : props.status === 'Pending' ? '#f59e0b' : '#ef4444'};
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;

  @media (max-width: 600px) {
    top: 12px;
    right: 12px;
    padding: 4px 10px;
    font-size: 0.75rem;
  }
`;

const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  @media (max-width: 600px) {
    width: 100%;
    padding: 16px;
  }
`;

const Title = styled.h3`
  font-size: 1.25rem;
  margin: 0 0 8px 0;
  color: #1f2937;

  @media (max-width: 600px) {
    font-size: 1.1rem;
  }
`;

const Address = styled.p`
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0 0 16px 0;
  line-height: 1.4;

  @media (max-width: 600px) {
    font-size: 0.85rem;
    margin: 0 0 12px 0;
  }
`;

const Features = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    gap: 12px;
    margin-bottom: 12px;
  }
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 0.9rem;

  svg {
    color: #3b82f6;
  }

  @media (max-width: 600px) {
    font-size: 0.8rem;
    gap: 4px;
  }
`;

const Description = styled.p`
  color: #4b5563;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0 0 16px 0;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 600px) {
    font-size: 0.85rem;
    -webkit-line-clamp: 2;
    margin: 0 0 12px 0;
  }
`;

const AgentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  margin-top: auto;

  @media (max-width: 600px) {
    padding-top: 12px;
    gap: 10px;
  }
`;

const AgentImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;

  @media (max-width: 600px) {
    width: 36px;
    height: 36px;
  }
`;

const AgentDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const AgentName = styled.span`
  font-weight: 600;
  color: #1f2937;
  font-size: 0.9rem;

  @media (max-width: 600px) {
    font-size: 0.85rem;
  }
`;

const AgentPhone = styled.span`
  color: #6b7280;
  font-size: 0.85rem;

  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
`;

export default PropertyCard;
