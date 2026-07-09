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
    flex-direction: row;
    height: auto;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 200px;
  flex-shrink: 0;

  @media (max-width: 600px) {
    width: 40%;
    height: auto;
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
`;

const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  @media (max-width: 600px) {
    width: 60%;
    padding: 16px;
  }
`;

const Title = styled.h3`
  font-size: 1.25rem;
  margin: 0 0 8px 0;
  color: #1f2937;
`;

const Address = styled.p`
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0 0 16px 0;
  line-height: 1.4;
`;

const Features = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4b5563;
  font-size: 0.9rem;

  svg {
    color: #9ca3af;
  }
`;

const Description = styled.p`
  color: #4b5563;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 20px 0;
  flex-grow: 1;

  @media (max-width: 600px) {
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 16px;
  }
`;

const AgentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;

  @media (max-width: 600px) {
    padding-top: 12px;
  }
`;

const AgentImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const AgentDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AgentName = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 0.95rem;
`;

const AgentPhone = styled.div`
  color: #6b7280;
  font-size: 0.85rem;
`;
