import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import { ServiceData } from '@/types/services';
import { ServiceExtendedDetails } from '@/constants/services/serviceDetails';
import { motion } from 'framer-motion';

// Import content blocks
import DescriptionBlock from './blocks/DescriptionBlock';
import FeaturesBlock from './blocks/FeaturesBlock';
import IncludesBlock from './blocks/IncludesBlock';
import ItineraryBlock from './blocks/ItineraryBlock';
import LocationsBlock from './blocks/LocationBlock';
import OptionsBlock from './blocks/OptionsBlock';
import ScheduleBlock from './blocks/ScheduleBlock';
import TagsBlock from './blocks/TagsBlock';
import MetadataBlock from './blocks/MetadataBlock';
import DisclaimerBlock from './blocks/DisclaimerBlock';

// Block types supported by the orchestrator - define as string literals for simplicity
export enum BlockType {
  DESCRIPTION = 'description',
  FEATURES = 'features',
  INCLUDES = 'includes',
  ITINERARY = 'itinerary',
  LOCATIONS = 'locations',
  OPTIONS = 'options',
  SCHEDULE = 'schedule',
  TAGS = 'tags',
  METADATA = 'metadata',
  DISCLAIMER = 'disclaimer',
}

// Block configuration type
export interface BlockConfig {
  type: BlockType;
  title?: string;
  data?: any;
  variant?: string;
  priority?: number;
}

// Props for the orchestrator
interface ServiceContentOrchestratorProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  viewContext?: 'standard-view' | 'premium-view';
}

/**
 * Service Content Orchestrator
 *
 * This component dynamically decides which content blocks to render
 * based on the available service data. It uses a configuration-based
 * approach to determine which blocks are relevant for each service type.
 */
const ServiceContentOrchestrator: React.FC<ServiceContentOrchestratorProps> = ({
  service,
  serviceData,
  extendedDetails,
  viewContext,
}) => {
  const { t } = useTranslation();
  const isPremium = service.packageType.includes('premium');

  // Determine the primary color based on the service type
  const primaryColor = isPremium ? 'amber' : 'blue';

  // Get the configuration for blocks to render
  const blocksConfig = getServiceBlocksConfig(
    service,
    serviceData,
    extendedDetails
  );

  // Sort blocks by priority
  const sortedBlocks = [...blocksConfig].sort(
    (a, b) => (a.priority || 100) - (b.priority || 100)
  );

  return (
    <div className='space-y-8'>
      {/* Render each content block based on configuration */}
      {sortedBlocks.map((blockConfig, index) => (
        <RenderBlock
          key={`${blockConfig.type}-${index}`}
          blockConfig={blockConfig}
          service={service}
          serviceData={serviceData}
          extendedDetails={extendedDetails}
          primaryColor={primaryColor}
          viewContext={viewContext}
          t={t}
        />
      ))}
    </div>
  );
};

/**
 * Renders a specific block based on its type
 */
const RenderBlock: React.FC<{
  blockConfig: BlockConfig;
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
  viewContext?: 'standard-view' | 'premium-view';
  t: any;
}> = ({
  blockConfig,
  service,
  serviceData,
  extendedDetails,
  primaryColor,
  viewContext,
  t,
}) => {
  // Common props for all blocks
  const commonProps = {
    service,
    serviceData,
    extendedDetails,
    primaryColor,
    viewContext,
    blockConfig,
    t,
  };

  // Animation for blocks
  const blockAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.1 },
  };

  // Render the appropriate block based on type
  switch (blockConfig.type) {
    case BlockType.DESCRIPTION:
      return (
        <motion.div {...blockAnimation}>
          <DescriptionBlock {...commonProps} />
        </motion.div>
      );
    case BlockType.FEATURES:
      return (
        <motion.div {...blockAnimation}>
          <FeaturesBlock {...commonProps} />
        </motion.div>
      );
    case BlockType.INCLUDES:
      return (
        <motion.div {...blockAnimation}>
          <IncludesBlock {...commonProps} />
        </motion.div>
      );
    case BlockType.ITINERARY:
      return (
        <motion.div {...blockAnimation}>
          <ItineraryBlock {...commonProps} />
        </motion.div>
      );
    case BlockType.LOCATIONS:
      return (
        <motion.div {...blockAnimation}>
          <LocationsBlock {...commonProps} />
        </motion.div>
      );
    case BlockType.OPTIONS:
      return (
        <motion.div {...blockAnimation}>
          <OptionsBlock {...commonProps} />
        </motion.div>
      );
    case BlockType.SCHEDULE:
      return (
        <motion.div {...blockAnimation}>
          <ScheduleBlock {...commonProps} />
        </motion.div>
      );
    case BlockType.TAGS:
      return (
        <motion.div {...blockAnimation}>
          <TagsBlock {...commonProps} />
        </motion.div>
      );
    case BlockType.METADATA:
      return (
        <motion.div {...blockAnimation}>
          <MetadataBlock {...commonProps} />
        </motion.div>
      );
    case BlockType.DISCLAIMER:
      return (
        <motion.div {...blockAnimation}>
          <DisclaimerBlock {...commonProps} />
        </motion.div>
      );
    default:
      return null;
  }
};

/**
 * Determines which blocks should be rendered for a service
 * based on the available data and service type
 */
const getServiceBlocksConfig = (
  service: Service,
  serviceData?: ServiceData,
  extendedDetails?: ServiceExtendedDetails
): BlockConfig[] => {
  const blocks: BlockConfig[] = [];

  // Description block - always included
  blocks.push({
    type: BlockType.DESCRIPTION,
    priority: 10,
  });

  // Features block - for services with specific features
  if (
    service.id.includes('yoga') ||
    service.id.includes('catamaran') ||
    service.id.includes('chef') ||
    service.id.includes('airport')
  ) {
    blocks.push({
      type: BlockType.FEATURES,
      priority: 20,
      data: getServiceFeatures(service.id, serviceData, extendedDetails),
    });
  }

  // Options block - if service has options
  if (serviceData?.options && Object.keys(serviceData.options).length > 0) {
    blocks.push({
      type: BlockType.OPTIONS,
      priority: 30,
    });
  }

  // Includes block - if service has includes or notIncluded
  if (
    (serviceData?.includes && serviceData.includes.length > 0) ||
    (serviceData?.notIncluded && serviceData.notIncluded.length > 0) ||
    (extendedDetails?.includes && extendedDetails.includes.length > 0) ||
    (extendedDetails?.notIncluded && extendedDetails.notIncluded.length > 0)
  ) {
    blocks.push({
      type: BlockType.INCLUDES,
      priority: 40,
    });
  }

  // Itinerary block - if service has itinerary
  if (
    (serviceData?.itinerary && serviceData.itinerary.length > 0) ||
    (extendedDetails?.itinerary && extendedDetails.itinerary.length > 0)
  ) {
    blocks.push({
      type: BlockType.ITINERARY,
      priority: 50,
    });
  }

  // Locations block - for location-based services
  if (
    extendedDetails?.location ||
    extendedDetails?.places ||
    serviceData?.options?.location
  ) {
    blocks.push({
      type: BlockType.LOCATIONS,
      priority: 60,
    });
  }

  // Schedule block - for services with time slots or schedules
  if (
    extendedDetails?.timeSlots ||
    extendedDetails?.schedule ||
    serviceData?.availability
  ) {
    blocks.push({
      type: BlockType.SCHEDULE,
      priority: 70,
    });
  }

  // Tags block - if service has tags
  if (serviceData?.tags && serviceData.tags.length > 0) {
    blocks.push({
      type: BlockType.TAGS,
      priority: 80,
    });
  }

  // Metadata block - if service has additional metadata
  if (serviceData?.metaData && Object.keys(serviceData.metaData).length > 0) {
    blocks.push({
      type: BlockType.METADATA,
      priority: 90,
    });
  }

  // Disclaimer block - if service has disclaimer
  if (serviceData?.disclaimer || extendedDetails?.disclaimer) {
    blocks.push({
      type: BlockType.DISCLAIMER,
      priority: 100,
    });
  }

  return blocks;
};

/**
 * Helper function to extract service-specific features
 */
const getServiceFeatures = (
  serviceId: string,
  serviceData?: ServiceData,
  extendedDetails?: ServiceExtendedDetails
) => {
  // Service-specific feature extraction
  if (serviceId.includes('yoga')) {
    return {
      yogaStyles: extendedDetails?.yogaStyles || [],
      equipmentIncluded: serviceData?.metaData?.equipmentProvided !== false,
      experienceLevels: extractExperienceLevels(serviceData),
    };
  } else if (serviceId.includes('catamaran')) {
    return {
      isPrivate: serviceId.includes('private'),
      capacity:
        serviceData?.metaData?.capacity ||
        (serviceId.includes('private') ? '19 personas' : '40 personas'),
      destinations: extractPlaces(extendedDetails),
      drinkOptions: extractDrinkOptions(extendedDetails),
    };
  } else if (serviceId.includes('airport')) {
    return {
      isPremium: serviceId.includes('luxe'),
      travelTime: serviceData?.metaData?.travelTime || '20-40 min',
      hasFlightTracking: serviceData?.metaData?.flightTracking || false,
      hasChildSeats: serviceData?.metaData?.childSeats || false,
    };
  } else if (serviceId.includes('chef')) {
    return {
      isPremium: serviceId.includes('luxe'),
      maxPeople: serviceData?.metaData?.maxPeople || 10,
    };
  }

  return {};
};

/**
 * Helper function to extract experience levels
 */
const extractExperienceLevels = (serviceData?: ServiceData): string[] => {
  if (!serviceData?.metaData?.experienceLevel) return [];

  const expLevels = serviceData.metaData.experienceLevel.toString();
  return expLevels.split(',');
};

/**
 * Helper function to extract places/destinations
 */
const extractPlaces = (extendedDetails?: ServiceExtendedDetails): string[] => {
  if (!extendedDetails?.places) return [];

  if (Array.isArray(extendedDetails.places)) {
    return extendedDetails.places;
  }

  return extendedDetails.places.toString().split(',');
};

/**
 * Helper function to extract drink options
 */
const extractDrinkOptions = (
  extendedDetails?: ServiceExtendedDetails
): string[] => {
  if (!extendedDetails?.openBarOptions) return [];

  if (Array.isArray(extendedDetails.openBarOptions)) {
    return extendedDetails.openBarOptions;
  }

  return extendedDetails.openBarOptions.toString().split(',');
};

export default ServiceContentOrchestrator;
