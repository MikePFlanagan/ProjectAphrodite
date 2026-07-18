export interface Identity {
  /**
   * Internal canonical name.
   */
  name: string;

  /**
   * Display name shown to users.
   */
  displayName?: string;

  /**
   * How old the character appears.
   * Example: "24"
   */
  ageAppearance: string;

  /**
   * Character's gender identity.
   */
  genderIdentity: string;

  /**
   * Preferred pronouns.
   */
  pronouns: string[];

  /**
   * Human, Elf, Android, Vampire...
   */
  species: string;

  /**
   * Current occupation or role.
   */
  occupation?: string;

  /**
   * Country or cultural background.
   */
  nationality?: string;

  /**
   * Languages spoken.
   */
  languages: string[];

  /**
   * High-level life story.
   */
  backstory: string;
}
