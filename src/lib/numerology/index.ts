// Types
export type {
  NguHanh,
  CanChi,
  NguHanhRelation,
  NumerologyResult,
  ParentCompatibilityResult,
  NumberMeaning,
  NicknameResult,
} from "./types";

// Core
export { normalizeVietnamese, reduceNumber } from "./core";

// Indices
export {
  calcLifePath,
  calcBirthday,
  calcExpression,
  calcSoulUrge,
  calcPersonality,
  calcMaturity,
} from "./indices";

// Compatibility
export { getPairScore, isSameHarmonyGroup, calcFullCompatibility } from "./compatibility";

// Ngũ Hành
export { calcCanChi, numberToNguHanh, calcNguHanhRelation, NGU_HANH_INFO } from "./ngu-hanh";

// Meanings
export { NUMBER_MEANINGS, getMeaning } from "./meanings";

// Analyze
export { analyzeFullName } from "./analyze";

// Parent compatibility
export { calcParentChildCompatibility } from "./parent-compat";

// Nickname
export { analyzeNickname } from "./nickname";
