import { BlogArticle } from '../blogArticles';
import { postScienceOfMicroBreaks } from './science-of-5-minute-micro-breaks';
import { postDigitalDecompressionVsDoomscrolling } from './digital-decompression-vs-doomscrolling';
import { postErgonomicGamingWristRoutines } from './ergonomic-gaming-wrist-relaxation-routines';
import { postPsychologyOfAsmrSound } from './psychology-of-asmr-popping-cracking-sounds';
import { postFromRageRoomToZenPond } from './from-rage-room-to-zen-pond-decision-protocol';
import { postSensoryGroundingForAdhd } from './sensory-grounding-for-adhd-and-neurodivergent-focus';
import { postVirtualDestructionCatharsis } from './the-psychology-of-virtual-destruction-demolition';
import { postTactileStimmingDigitalFidgets } from './tactile-stimming-digital-fidget-toys-anxiety-relief';
import { postAcousticFrequencyHealing432Hz } from './acoustic-frequency-healing-432hz-tongue-drum-calm';
import { postBurnoutRageRoomsHydraulicPress } from './burnout-recovery-rage-rooms-hydraulic-press-catharsis';

export {
  postScienceOfMicroBreaks,
  postDigitalDecompressionVsDoomscrolling,
  postErgonomicGamingWristRoutines,
  postPsychologyOfAsmrSound,
  postFromRageRoomToZenPond,
  postSensoryGroundingForAdhd,
  postVirtualDestructionCatharsis,
  postTactileStimmingDigitalFidgets,
  postAcousticFrequencyHealing432Hz,
  postBurnoutRageRoomsHydraulicPress,
};

export const ALL_POSTS: BlogArticle[] = [
  postScienceOfMicroBreaks,
  postDigitalDecompressionVsDoomscrolling,
  postErgonomicGamingWristRoutines,
  postPsychologyOfAsmrSound,
  postFromRageRoomToZenPond,
  postSensoryGroundingForAdhd,
  postVirtualDestructionCatharsis,
  postTactileStimmingDigitalFidgets,
  postAcousticFrequencyHealing432Hz,
  postBurnoutRageRoomsHydraulicPress,
];

export function getPostBySlug(slug: string): BlogArticle | undefined {
  return ALL_POSTS.find((p) => p.slug === slug || p.id === slug);
}

export function getAllPostSlugs(): string[] {
  return ALL_POSTS.map((p) => p.slug);
}
