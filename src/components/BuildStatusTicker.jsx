import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon, TimeIcon } from '@chakra-ui/icons';
import { FiRefreshCw, FiPlay } from 'react-icons/fi';
import { useWebSocket } from '../hooks/useWebSocket';
import { deployProject } from '../services/deployService';

export const BuildStatusTicker = ({ projectId }) => {
  const { buildStatus, lastBuildTime, triggerBuild } = useWebSocket(projectId);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployError, setDeployError] = useState(null);
  const [relativeTime, setRelativeTime] = useState('');

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const now = new Date();
    const buildDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - buildDate) / 1000);
    
    if (diffInSeconds < 0) return 'Just now';
    if (diffInSeconds < 60) return 'Just now';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
  };

  useEffect(() => {
    setRelativeTime(formatRelativeTime(lastBuildTime));
    
    const interval = setInterval(() => {
      setRelativeTime(formatRelativeTime(lastBuildTime));
    }, 60000);
    
    return () => clearInterval(interval);
  }, [lastBuildTime]);

  const handleDeploy = async () => {
    if (isDeploying) return;
    
    setIsDeploying(true);
    setDeployError(null);
    
    try {
      await deployProject(projectId);
      // Success state is handled by the WebSocket connection
    } catch (error) {
      setDeployError(error.message || 'Deployment failed');
    } finally {
      setIsDeploying(false);
    }
  };

  const getStatusColor = () => {
    switch (buildStatus) {
      case 'success':
        return 'green.500';
      case 'failed':
        return 'red.500';
      case 'building':
        return 'blue.500';
      default:
        return 'gray.500';
    }
  };

  const getStatusIcon = () => {
    switch (buildStatus) {
      case 'success':
        return <Icon as={CheckCircleIcon} color="green.500" />;
      case 'failed':
        return <Icon as={WarningIcon} color="red.500" />;
      case 'building':
        return <Icon as={TimeIcon} color="blue.500" />;
      default:
        return null;
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" bg="white">
      <VStack align="stretch" spacing={3}>
        <Flex justify="space-between" align="center">
          <HStack spacing={2}>
            {getStatusIcon()}
            <Text fontWeight="bold">Build Status</Text>
            <Text color={getStatusColor()} fontWeight="semibold">
              {buildStatus || 'idle'}
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.500">
            Last build: {relativeTime}
          </Text>
        </Flex>

        <HStack spacing={4}>
          <Button
            leftIcon={<FiRefreshCw />}
            onClick={triggerBuild}
            isDisabled={buildStatus === 'building'}
            variant="outline"
            size="sm"
          >
            Rebuild
          </Button>
          <Button
            leftIcon={isDeploying ? <Spinner size="sm" /> : <FiPlay />}
            onClick={handleDeploy}
            isDisabled={buildStatus === 'building' || isDeploying}
            isLoading={isDeploying}
            loadingText="Deploying..."
            colorScheme="blue"
            size="sm"
          >
            Deploy
          </Button>
        </HStack>

        {deployError && (
          <Text color="red.500" fontSize="sm">
            {deployError}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default BuildStatusTicker;
