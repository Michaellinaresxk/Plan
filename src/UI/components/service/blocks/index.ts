/**
 * Service Content Blocks
 *
 * This file exports all content blocks used by the ServiceContentOrchestrator
 * to render different parts of a service's details.
 */

// Import block components
import DescriptionBlock from './DescriptionBlock';
import FeaturesBlock from './FeaturesBlock';
import IncludesBlock from './IncludesBlock';
import ItineraryBlock from './ItineraryBlock';
import OptionsBlock from './OptionsBlock';
import ScheduleBlock from './ScheduleBlock';
import TagsBlock from './TagsBlock';
import MetadataBlock from './MetadataBlock';
import DisclaimerBlock from './DisclaimerBlock';
import LocationsBlock from './LocationBlock';
import GalleryBlock from './GalleryBlock';

// Export all block components
export { default as DescriptionBlock } from './DescriptionBlock';
export { default as FeaturesBlock } from './FeaturesBlock';
export { default as IncludesBlock } from './IncludesBlock';
export { default as ItineraryBlock } from './ItineraryBlock';
export { default as OptionsBlock } from './OptionsBlock';
export { default as ScheduleBlock } from './ScheduleBlock';
export { default as TagsBlock } from './TagsBlock';
export { default as MetadataBlock } from './MetadataBlock';
export { default as DisclaimerBlock } from './DisclaimerBlock';
export { default as LocationsBlock } from './LocationBlock';

// Map block types to their components
const ContentBlocks = {
  description: DescriptionBlock,
  features: FeaturesBlock,
  includes: IncludesBlock,
  itinerary: ItineraryBlock,
  locations: LocationsBlock,
  options: OptionsBlock,
  schedule: ScheduleBlock,
  tags: TagsBlock,
  metadata: MetadataBlock,
  disclaimer: DisclaimerBlock,
  gallery: GalleryBlock,
};

export default ContentBlocks;
