
import type { Identity } from "./identity";
import type { Personality } from "./personality";
import type { Communication } from "./communication";
import type { Knowledge } from "./knowledge";
import type { Preferences } from "./preferences";
import type { Boundaries } from "./boundaries";
import type { EmotionalProfile } from "./emotional-profile";
import type { RelationshipDefaults } from "./relationship-defaults";
import type { Metadata } from "./metadata";

export interface EntityDNA {
  identity: Identity;
  personality: Personality;
  communication: Communication;
  knowledge: Knowledge;
  preferences: Preferences;
  boundaries: Boundaries;
  emotionalProfile: EmotionalProfile;
  relationshipDefaults: RelationshipDefaults;
  metadata: Metadata;
}