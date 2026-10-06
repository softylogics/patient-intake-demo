import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

type Shape =
  | { type: 'ellipse'; cx: number; cy: number; rx: number; ry: number }
  | { type: 'path'; d: string };

interface Region {
  id: string;
  name: string;
  label: string;
  description: string;
  bodySystem: 'musculoskeletal' | 'neurological' | 'cardiovascular' | 'respiratory' | 'integumentary' | 'general';
  shape: Shape;
  labelAt?: { x: number; y: number };
  separationConfig?: SeparationConfig;
}

interface SeparationConfig {
  direction: { x: number; y: number };
  baseDistance: number;
  threshold: number;
  maxSeparation: number;
  hitTargetScale?: number;
}

type ViewMode = 'front' | 'back' | 'left_side';

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 4;
const SEP_SCALE = 2.6;

const BODY_SYSTEMS = {
  musculoskeletal: { label: 'Musculoskeletal', color: '#3b82f6', ur: 'پٹھوں اور ہڈیوں کا نظام' },
  neurological: { label: 'Neurological', color: '#8b5cf6', ur: 'اعصابی نظام' },
  cardiovascular: { label: 'Cardiovascular', color: '#ef4444', ur: 'دل اور خون کا نظام' },
  respiratory: { label: 'Respiratory', color: '#06b6d4', ur: 'تنفسی نظام' },
  integumentary: { label: 'Integumentary', color: '#f59e0b', ur: 'چمڑے کا نظام' },
  general: { label: 'General', color: '#6b7280', ur: 'عام' },
};

function normalizeDirection(x: number, y: number): { x: number; y: number } {
  const len = Math.sqrt(x * x + y * y);
  return len === 0 ? { x: 0, y: 0 } : { x: x / len, y: y / len };
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function S(dx: number, dy: number, base = 2, thr = 1.35, max = 7, hit = 1): SeparationConfig {
  return { direction: normalizeDirection(dx, dy), baseDistance: base, threshold: thr, maxSeparation: max, hitTargetScale: hit };
}

function E(cx: number, cy: number, rx: number, ry: number): Shape {
  return { type: 'ellipse', cx, cy, rx, ry };
}

function P(d: string): Shape {
  return { type: 'path', d };
}

function getSeparationOffset(config: SeparationConfig, zoom: number): { x: number; y: number } {
  if (zoom <= config.threshold) return { x: 0, y: 0 };
  const t = Math.min((zoom - config.threshold) / (MAX_ZOOM - config.threshold), 1);
  const easedT = easeOutCubic(t);
  const separation = config.baseDistance * easedT * (config.maxSeparation / 10) * SEP_SCALE;
  return { x: config.direction.x * separation, y: config.direction.y * separation };
}

function getHitTargetScale(config: SeparationConfig | undefined, zoom: number): number {
  if (!config) return 1;
  if (zoom <= 1) return 1;
  const t = Math.min((zoom - 1) / (MAX_ZOOM - 1), 1);
  const baseScale = config.hitTargetScale || 1;
  return 1 + (baseScale - 1) * smoothstep(t);
}

/* ------------------------------------------------------------------ */
/* Human silhouettes (viewBox 0 0 200 440, centred on x = 100)          */
/* ------------------------------------------------------------------ */

const FRONT_BODY =
  'M100,10 C89,10 80,21 80,38 C80,50 83,59 89,66 C87,70 87,76 87,82 C87,88 83,90 77,92 ' +
  'C67,96 58,100 54,110 C50,124 47,146 45,168 C43,186 42,206 42,224 C42,242 42,258 41,272 ' +
  'C40,284 42,294 48,298 C53,301 58,299 58,291 C59,279 58,262 57,244 C56,224 56,204 57,186 ' +
  'C58,170 59,152 61,134 C63,126 65,121 66,118 C66,134 66,152 67,168 C68,184 68,198 67,212 ' +
  'C66,224 65,234 65,244 C65,264 66,284 68,302 C70,320 72,340 73,360 C74,378 75,392 76,402 ' +
  'C77,412 76,420 72,422 C68,424 66,426 70,428 C74,430 82,430 90,428 C94,427 95,422 94,414 ' +
  'C92,402 90,386 89,368 C88,350 87,332 87,316 C87,304 86,292 86,280 C88,270 92,262 98,258 ' +
  'C100,256 100,254 100,252 C100,254 100,256 102,258 C108,262 112,270 114,280 C114,292 113,304 113,316 ' +
  'C113,332 112,350 111,368 C110,386 108,402 106,414 C105,422 106,427 110,428 C118,430 126,430 130,428 ' +
  'C134,426 132,424 128,422 C124,420 123,412 124,402 C125,392 126,378 127,360 C128,340 130,320 132,302 ' +
  'C134,284 135,264 135,244 C135,234 134,224 133,212 C132,198 132,184 133,168 C134,152 134,134 134,118 ' +
  'C135,121 137,126 139,134 C141,152 142,170 143,186 C143,204 143,224 142,244 C142,262 142,279 141,291 ' +
  'C141,299 146,301 151,298 C157,294 159,284 158,272 C157,258 158,242 158,224 C158,206 157,186 155,168 ' +
  'C153,146 150,124 146,110 C142,100 133,96 123,92 C117,90 113,88 113,82 C113,76 113,70 111,66 ' +
  'C117,59 120,50 120,38 C120,21 111,10 100,10 Z';

const SIDE_BODY =
  'M98,12 C90,12 84,20 84,34 C84,46 86,56 90,64 C87,68 87,76 90,82 C90,88 87,90 83,94 ' +
  'C75,102 69,112 67,126 C65,146 65,166 65,186 C65,206 65,224 66,244 C67,266 69,286 71,306 ' +
  'C73,326 75,346 77,366 C79,386 81,400 85,410 C89,419 97,425 108,425 C120,425 130,423 136,419 ' +
  'C140,417 140,413 136,411 C128,407 121,400 117,390 C113,378 111,362 109,344 C107,324 105,304 105,284 ' +
  'C105,266 107,252 109,240 C111,230 111,222 109,214 C107,204 109,196 113,188 C117,178 119,166 119,152 ' +
  'C119,138 119,124 117,112 C115,100 109,92 101,86 C95,82 93,78 95,72 C101,76 107,76 111,72 ' +
  'C115,68 117,62 117,54 C117,44 115,34 111,26 C107,18 103,12 98,12 Z';

const FRONT_HAIR =
  'M100,5 C84,5 75,19 76,37 C82,25 90,21 100,21 C110,21 118,25 124,37 C125,19 116,5 100,5 Z';

const BACK_HAIR =
  'M100,5 C82,5 74,20 75,40 C75,54 77,62 80,66 C82,52 90,46 100,46 C110,46 118,52 120,66 C123,62 125,54 125,40 C126,20 118,5 100,5 Z';

const SIDE_HAIR =
  'M98,10 C86,10 79,22 80,38 C80,50 83,58 87,62 C88,48 94,42 102,40 C110,38 116,42 118,50 C120,36 116,22 108,15 C104,12 101,10 98,10 Z';

/* ------------------------------------------------------------------ */
/* Anatomical detail lines (non-interactive)                           */
/* ------------------------------------------------------------------ */

const FRONT_DETAILS: string[] = [
  'M78,95 C86,91 94,89 100,89 C106,89 114,91 122,95',
  'M84,145 C92,151 108,151 116,145',
  'M100,101 L100,150',
  'M100,150 L100,214',
  'M86,165 L114,165',
  'M87,181 L113,181',
  'M88,197 L112,197',
  'M74,118 C80,124 86,128 92,130',
  'M126,118 C120,124 114,128 108,130',
  'M75,101 C71,113 69,125 69,137',
  'M125,101 C129,113 131,125 131,137',
  'M44,196 C50,200 54,200 58,196',
  'M156,196 C150,200 146,200 142,196',
  'M78,300 C76,304 76,309 78,313',
  'M122,300 C124,304 124,309 122,313',
  'M79,326 L79,392',
  'M121,326 L121,392',
];

const FRONT_FACE: string[] = [
  'M90,52 C94,49 98,49 100,51',
  'M110,52 C106,49 102,49 100,51',
  'M100,51 L100,58 L96,60',
  'M93,64 C97,66 103,66 107,64',
];

const BACK_DETAILS: string[] = [
  'M100,92 L100,220',
  'M80,120 C74,132 72,146 74,160',
  'M120,120 C126,132 128,146 126,160',
  'M86,150 L86,190',
  'M114,150 L114,190',
  'M100,232 C100,240 100,244 100,248',
];

const SIDE_DETAILS: string[] = [
  'M108,40 C112,46 113,52 112,58',
  'M96,106 C102,104 110,106 114,112',
  'M96,150 L112,150',
  'M96,190 L110,190',
];

const NAVEL = { x: 100, y: 198 };

/* ------------------------------------------------------------------ */
/* Regions                                                             */
/* ------------------------------------------------------------------ */

const frontRegions: Region[] = [
  { id: 'scalp', name: 'scalp', label: 'Scalp', description: 'Top of the head, cranium', bodySystem: 'neurological', labelAt: { x: 100, y: 24 }, shape: P('M100,8 C88,8 79,20 79,36 C79,40 80,43 81,46 C87,39 93,37 100,37 C107,37 113,39 119,46 C120,43 121,40 121,36 C121,20 112,8 100,8 Z'), separationConfig: S(0, -1, 1.5, 1.5, 5) },
  { id: 'forehead', name: 'forehead', label: 'Forehead', description: 'Forehead, brow ridge', bodySystem: 'neurological', labelAt: { x: 100, y: 44 }, shape: P('M100,30 C89,30 81,37 80,48 C85,43 92,41 100,41 C108,41 115,43 120,48 C119,37 111,30 100,30 Z'), separationConfig: S(0, -1, 1.5, 1.5, 5) },
  { id: 'face', name: 'face', label: 'Face', description: 'Cheeks, eyes, nose, mouth', bodySystem: 'general', labelAt: { x: 100, y: 56 }, shape: P('M100,44 C91,44 84,47 82,52 C84,60 91,66 100,66 C109,66 116,60 118,52 C116,47 109,44 100,44 Z'), separationConfig: S(0, -1, 1.2, 1.6, 4) },
  { id: 'jaw', name: 'jaw', label: 'Jaw', description: 'Jawline, chin', bodySystem: 'musculoskeletal', labelAt: { x: 100, y: 70 }, shape: P('M83,54 C83,66 90,74 100,74 C110,74 117,66 117,54 C112,62 106,65 100,65 C94,65 88,62 83,54 Z'), separationConfig: S(0, 1, 1.5, 1.5, 5) },
  { id: 'ears', name: 'ears', label: 'Ears', description: 'Ears, sides of the head', bodySystem: 'general', shape: E(82, 48, 5, 8), separationConfig: S(-1, 0, 4, 1.2, 9, 2) },

  { id: 'neck_front', name: 'neck', label: 'Neck', description: 'Front of the neck, throat', bodySystem: 'respiratory', labelAt: { x: 100, y: 80 }, shape: P('M88,62 L112,62 L111,92 L89,92 Z'), separationConfig: S(0, -1, 1, 1.6, 4) },
  { id: 'throat', name: 'throat', label: 'Throat', description: 'Throat, larynx area', bodySystem: 'respiratory', shape: E(100, 80, 8, 12), separationConfig: S(0, -1, 1, 1.6, 4) },

  { id: 'left_shoulder', name: 'shoulder', label: 'Left Shoulder', description: 'Left shoulder, deltoid', bodySystem: 'musculoskeletal', shape: E(66, 104, 17, 16), separationConfig: S(-1, -1, 3, 1.2, 8) },
  { id: 'right_shoulder', name: 'shoulder', label: 'Right Shoulder', description: 'Right shoulder, deltoid', bodySystem: 'musculoskeletal', shape: E(134, 104, 17, 16), separationConfig: S(1, -1, 3, 1.2, 8) },
  { id: 'collarbone', name: 'collarbone', label: 'Collarbone', description: 'Clavicle, collarbone', bodySystem: 'musculoskeletal', labelAt: { x: 100, y: 94 }, shape: P('M74,94 C86,89 114,89 126,94 C126,99 114,97 100,97 C86,97 74,99 74,94 Z'), separationConfig: S(0, -1, 1, 1.6, 4) },

  { id: 'chest', name: 'chest', label: 'Chest', description: 'Chest, ribcage', bodySystem: 'cardiovascular', labelAt: { x: 100, y: 124 }, shape: P('M66,112 C70,105 84,101 100,101 C116,101 130,105 134,112 L132,152 C120,160 80,160 68,152 Z'), separationConfig: S(0, -1, 1, 1.6, 4) },
  { id: 'left_pec', name: 'left_pec', label: 'Left Chest', description: 'Left pectoral muscle', bodySystem: 'musculoskeletal', shape: E(84, 128, 17, 18), separationConfig: S(-1, 0, 1, 1.4, 5) },
  { id: 'right_pec', name: 'right_pec', label: 'Right Chest', description: 'Right pectoral muscle', bodySystem: 'musculoskeletal', shape: E(116, 128, 17, 18), separationConfig: S(1, 0, 1, 1.4, 5) },
  { id: 'heart_area', name: 'heart_area', label: 'Heart', description: 'Heart, left chest', bodySystem: 'cardiovascular', shape: E(86, 126, 11, 10), separationConfig: S(-1, -1, 3, 1.1, 7, 1.6) },

  { id: 'upper_abdomen', name: 'upper_abdomen', label: 'Upper Abdomen', description: 'Upper belly, navel area', bodySystem: 'general', labelAt: { x: 100, y: 168 }, shape: P('M69,152 C80,160 120,160 131,152 L129,188 C120,194 80,194 71,188 Z'), separationConfig: S(0, -1, 1, 1.6, 4) },
  { id: 'lower_abdomen', name: 'lower_abdomen', label: 'Lower Abdomen', description: 'Lower belly, pelvis', bodySystem: 'general', labelAt: { x: 100, y: 205 }, shape: P('M71,188 C80,194 120,194 129,188 L127,222 C120,230 80,230 73,222 Z'), separationConfig: S(0, 1, 1, 1.6, 4) },
  { id: 'stomach', name: 'stomach', label: 'Stomach', description: 'Stomach, left upper abdomen', bodySystem: 'general', shape: E(83, 170, 12, 15), separationConfig: S(-1, 0, 3, 1.2, 8) },

  { id: 'left_hip', name: 'hip', label: 'Left Hip', description: 'Left hip, iliac crest', bodySystem: 'musculoskeletal', shape: E(80, 220, 16, 16), separationConfig: S(-1, 0, 3, 1.2, 8) },
  { id: 'right_hip', name: 'hip', label: 'Right Hip', description: 'Right hip, iliac crest', bodySystem: 'musculoskeletal', shape: E(120, 220, 16, 16), separationConfig: S(1, 0, 3, 1.2, 8) },

  { id: 'left_upper_arm', name: 'upper_arm', label: 'Left Upper Arm', description: 'Left bicep, tricep', bodySystem: 'musculoskeletal', shape: E(52, 150, 12, 40), separationConfig: S(-1, 0, 3, 1.2, 8, 1.4) },
  { id: 'left_lower_arm', name: 'lower_arm', label: 'Left Forearm', description: 'Left forearm, wrist', bodySystem: 'musculoskeletal', shape: E(50, 235, 11, 38), separationConfig: S(-1, 0, 3, 1.2, 8, 1.4) },
  { id: 'left_hand', name: 'hand', label: 'Left Hand', description: 'Left hand, palm', bodySystem: 'general', shape: E(49, 286, 11, 18), separationConfig: S(-1, 0, 4, 1.1, 9, 1.7) },
  { id: 'left_fingers', name: 'fingers', label: 'Left Fingers', description: 'Left fingers', bodySystem: 'general', shape: E(48, 306, 10, 14), separationConfig: S(0, 1, 4, 1.2, 9, 2) },

  { id: 'right_upper_arm', name: 'upper_arm', label: 'Right Upper Arm', description: 'Right bicep, tricep', bodySystem: 'musculoskeletal', shape: E(148, 150, 12, 40), separationConfig: S(1, 0, 3, 1.2, 8, 1.4) },
  { id: 'right_lower_arm', name: 'lower_arm', label: 'Right Forearm', description: 'Right forearm, wrist', bodySystem: 'musculoskeletal', shape: E(150, 235, 11, 38), separationConfig: S(1, 0, 3, 1.2, 8, 1.4) },
  { id: 'right_hand', name: 'hand', label: 'Right Hand', description: 'Right hand, palm', bodySystem: 'general', shape: E(151, 286, 11, 18), separationConfig: S(1, 0, 4, 1.1, 9, 1.7) },
  { id: 'right_fingers', name: 'fingers', label: 'Right Fingers', description: 'Right fingers', bodySystem: 'general', shape: E(152, 306, 10, 14), separationConfig: S(0, 1, 4, 1.2, 9, 2) },

  { id: 'left_thigh', name: 'thigh', label: 'Left Thigh', description: 'Left thigh, quadricep', bodySystem: 'musculoskeletal', shape: E(79, 272, 18, 42), separationConfig: S(-1, 0, 2, 1.4, 6, 1.3) },
  { id: 'left_knee', name: 'knee', label: 'Left Knee', description: 'Left knee, patella', bodySystem: 'musculoskeletal', shape: E(80, 306, 13, 14), separationConfig: S(0, -1, 2, 1.3, 7, 1.5) },
  { id: 'left_lower_leg', name: 'lower_leg', label: 'Left Shin', description: 'Left shin, tibia', bodySystem: 'musculoskeletal', shape: E(80, 352, 12, 42), separationConfig: S(-1, 0, 2, 1.3, 7, 1.3) },
  { id: 'left_calf', name: 'calf', label: 'Left Calf', description: 'Left calf muscle', bodySystem: 'musculoskeletal', shape: E(86, 346, 11, 34), separationConfig: S(1, 0, 2, 1.3, 7, 1.3) },
  { id: 'left_ankle', name: 'ankle', label: 'Left Ankle', description: 'Left ankle', bodySystem: 'musculoskeletal', shape: E(82, 402, 9, 10), separationConfig: S(0, 1, 2, 1.4, 7, 1.5) },
  { id: 'left_foot', name: 'foot', label: 'Left Foot', description: 'Left foot and toes', bodySystem: 'general', labelAt: { x: 79, y: 418 }, shape: P('M64,404 C64,416 67,425 74,427 L96,427 C98,420 95,412 90,406 C83,403 74,402 64,404 Z'), separationConfig: S(0, 1, 2.5, 1.3, 8, 1.4) },

  { id: 'right_thigh', name: 'thigh', label: 'Right Thigh', description: 'Right thigh, quadricep', bodySystem: 'musculoskeletal', shape: E(121, 272, 18, 42), separationConfig: S(1, 0, 2, 1.4, 6, 1.3) },
  { id: 'right_knee', name: 'knee', label: 'Right Knee', description: 'Right knee, patella', bodySystem: 'musculoskeletal', shape: E(120, 306, 13, 14), separationConfig: S(0, -1, 2, 1.3, 7, 1.5) },
  { id: 'right_lower_leg', name: 'lower_leg', label: 'Right Shin', description: 'Right shin, tibia', bodySystem: 'musculoskeletal', shape: E(120, 352, 12, 42), separationConfig: S(1, 0, 2, 1.3, 7, 1.3) },
  { id: 'right_calf', name: 'calf', label: 'Right Calf', description: 'Right calf muscle', bodySystem: 'musculoskeletal', shape: E(114, 346, 11, 34), separationConfig: S(-1, 0, 2, 1.3, 7, 1.3) },
  { id: 'right_ankle', name: 'ankle', label: 'Right Ankle', description: 'Right ankle', bodySystem: 'musculoskeletal', shape: E(118, 402, 9, 10), separationConfig: S(0, 1, 2, 1.4, 7, 1.5) },
  { id: 'right_foot', name: 'foot', label: 'Right Foot', description: 'Right foot and toes', bodySystem: 'general', labelAt: { x: 121, y: 418 }, shape: P('M136,404 C136,416 133,425 126,427 L104,427 C102,420 105,412 110,406 C117,403 126,402 136,404 Z'), separationConfig: S(0, 1, 2.5, 1.3, 8, 1.4) },
];

const backRegions: Region[] = [
  { id: 'head_back', name: 'head', label: 'Head (Back)', description: 'Back of the head, occiput', bodySystem: 'neurological', shape: E(100, 36, 21, 27), separationConfig: S(0, -1, 1, 1.5, 5) },
  { id: 'neck_back', name: 'neck', label: 'Neck (Back)', description: 'Back of the neck, cervical spine', bodySystem: 'musculoskeletal', labelAt: { x: 100, y: 80 }, shape: P('M88,62 L112,62 L111,92 L89,92 Z'), separationConfig: S(0, -1, 1, 1.6, 4) },

  { id: 'upper_back', name: 'upper_back', label: 'Upper Back', description: 'Trapezius, upper back', bodySystem: 'musculoskeletal', labelAt: { x: 100, y: 122 }, shape: P('M66,112 C70,105 84,101 100,101 C116,101 130,105 134,112 L132,150 C120,158 80,158 68,150 Z'), separationConfig: S(0, -1, 1, 1.6, 4) },
  { id: 'left_scapula', name: 'scapula', label: 'Left Shoulder Blade', description: 'Left scapula, shoulder blade', bodySystem: 'musculoskeletal', shape: E(80, 128, 16, 17), separationConfig: S(-1, -1, 3, 1.2, 8) },
  { id: 'right_scapula', name: 'scapula', label: 'Right Shoulder Blade', description: 'Right scapula, shoulder blade', bodySystem: 'musculoskeletal', shape: E(120, 128, 16, 17), separationConfig: S(1, -1, 3, 1.2, 8) },

  { id: 'mid_back', name: 'mid_back', label: 'Mid Back', description: 'Middle back, thoracic region', bodySystem: 'musculoskeletal', labelAt: { x: 100, y: 168 }, shape: P('M69,150 C80,158 120,158 131,150 L129,186 C120,192 80,192 71,186 Z'), separationConfig: S(0, -1, 1, 1.6, 4) },
  { id: 'thoracic_spine', name: 'thoracic_spine', label: 'Thoracic Spine', description: 'Mid-back spine', bodySystem: 'musculoskeletal', shape: E(100, 152, 6, 34), separationConfig: S(0, -1, 1.5, 1.4, 6) },

  { id: 'lower_back', name: 'lower_back', label: 'Lower Back', description: 'Lumbar area, base of spine', bodySystem: 'musculoskeletal', labelAt: { x: 100, y: 205 }, shape: P('M71,186 C80,192 120,192 129,186 L127,220 C120,228 80,228 73,220 Z'), separationConfig: S(0, 1, 1, 1.6, 4) },
  { id: 'lumbar_spine', name: 'lumbar_spine', label: 'Lumbar Spine', description: 'Lower back spine', bodySystem: 'musculoskeletal', shape: E(100, 196, 6, 26), separationConfig: S(0, 1, 1.5, 1.4, 6) },

  { id: 'left_glute', name: 'glute', label: 'Left Buttock', description: 'Left gluteal muscle', bodySystem: 'musculoskeletal', shape: E(83, 234, 17, 17), separationConfig: S(-1, 0, 3, 1.2, 8) },
  { id: 'right_glute', name: 'glute', label: 'Right Buttock', description: 'Right gluteal muscle', bodySystem: 'musculoskeletal', shape: E(117, 234, 17, 17), separationConfig: S(1, 0, 3, 1.2, 8) },

  { id: 'left_arm_back', name: 'arm', label: 'Left Upper Arm (Back)', description: 'Left upper arm, back', bodySystem: 'musculoskeletal', shape: E(52, 150, 12, 40), separationConfig: S(-1, 0, 3, 1.2, 8, 1.4) },
  { id: 'right_arm_back', name: 'arm', label: 'Right Upper Arm (Back)', description: 'Right upper arm, back', bodySystem: 'musculoskeletal', shape: E(148, 150, 12, 40), separationConfig: S(1, 0, 3, 1.2, 8, 1.4) },
  { id: 'left_forearm_back', name: 'lower_arm', label: 'Left Forearm (Back)', description: 'Left forearm, back', bodySystem: 'musculoskeletal', shape: E(50, 235, 11, 38), separationConfig: S(-1, 0, 3, 1.2, 8, 1.4) },
  { id: 'right_forearm_back', name: 'lower_arm', label: 'Right Forearm (Back)', description: 'Right forearm, back', bodySystem: 'musculoskeletal', shape: E(150, 235, 11, 38), separationConfig: S(1, 0, 3, 1.2, 8, 1.4) },
  { id: 'left_hand_back', name: 'hand', label: 'Left Hand (Back)', description: 'Left hand, back', bodySystem: 'general', shape: E(49, 286, 11, 18), separationConfig: S(-1, 0, 4, 1.1, 9, 1.7) },
  { id: 'right_hand_back', name: 'hand', label: 'Right Hand (Back)', description: 'Right hand, back', bodySystem: 'general', shape: E(151, 286, 11, 18), separationConfig: S(1, 0, 4, 1.1, 9, 1.7) },

  { id: 'left_thigh_back', name: 'thigh', label: 'Left Thigh (Back)', description: 'Left thigh, back', bodySystem: 'musculoskeletal', shape: E(79, 272, 18, 42), separationConfig: S(-1, 0, 2, 1.4, 6, 1.3) },
  { id: 'right_thigh_back', name: 'thigh', label: 'Right Thigh (Back)', description: 'Right thigh, back', bodySystem: 'musculoskeletal', shape: E(121, 272, 18, 42), separationConfig: S(1, 0, 2, 1.4, 6, 1.3) },
  { id: 'left_knee_back', name: 'knee', label: 'Left Knee (Back)', description: 'Left knee, back', bodySystem: 'musculoskeletal', shape: E(80, 306, 13, 14), separationConfig: S(0, -1, 2, 1.3, 7, 1.5) },
  { id: 'right_knee_back', name: 'knee', label: 'Right Knee (Back)', description: 'Right knee, back', bodySystem: 'musculoskeletal', shape: E(120, 306, 13, 14), separationConfig: S(0, -1, 2, 1.3, 7, 1.5) },
  { id: 'left_lower_leg_back', name: 'lower_leg', label: 'Left Shin (Back)', description: 'Left calf, back', bodySystem: 'musculoskeletal', shape: E(80, 352, 12, 42), separationConfig: S(-1, 0, 2, 1.3, 7, 1.3) },
  { id: 'right_lower_leg_back', name: 'lower_leg', label: 'Right Shin (Back)', description: 'Right calf, back', bodySystem: 'musculoskeletal', shape: E(120, 352, 12, 42), separationConfig: S(1, 0, 2, 1.3, 7, 1.3) },
  { id: 'left_calf_back', name: 'calf', label: 'Left Calf (Back)', description: 'Left calf muscle, back', bodySystem: 'musculoskeletal', shape: E(86, 346, 11, 34), separationConfig: S(-1, 0, 2, 1.3, 7, 1.3) },
  { id: 'right_calf_back', name: 'calf', label: 'Right Calf (Back)', description: 'Right calf muscle, back', bodySystem: 'musculoskeletal', shape: E(114, 346, 11, 34), separationConfig: S(1, 0, 2, 1.3, 7, 1.3) },
  { id: 'left_ankle_back', name: 'ankle', label: 'Left Ankle (Back)', description: 'Left ankle, back', bodySystem: 'musculoskeletal', shape: E(82, 402, 9, 10), separationConfig: S(0, 1, 2, 1.4, 7, 1.5) },
  { id: 'right_ankle_back', name: 'ankle', label: 'Right Ankle (Back)', description: 'Right ankle, back', bodySystem: 'musculoskeletal', shape: E(118, 402, 9, 10), separationConfig: S(0, 1, 2, 1.4, 7, 1.5) },
  { id: 'left_foot_back', name: 'foot', label: 'Left Foot (Back)', description: 'Left heel and foot, back', bodySystem: 'general', labelAt: { x: 79, y: 418 }, shape: P('M64,404 C64,416 67,425 74,427 L96,427 C98,420 95,412 90,406 C83,403 74,402 64,404 Z'), separationConfig: S(0, 1, 2.5, 1.3, 8, 1.4) },
  { id: 'right_foot_back', name: 'foot', label: 'Right Foot (Back)', description: 'Right heel and foot, back', bodySystem: 'general', labelAt: { x: 121, y: 418 }, shape: P('M136,404 C136,416 133,425 126,427 L104,427 C102,420 105,412 110,406 C117,403 126,402 136,404 Z'), separationConfig: S(0, 1, 2.5, 1.3, 8, 1.4) },
];

const sideRegions: Region[] = [
  { id: 'head_side', name: 'head', label: 'Head (Side)', description: 'Side of the head', bodySystem: 'neurological', shape: E(97, 34, 17, 26), separationConfig: S(0, -1, 1, 1.5, 5) },
  { id: 'face_side', name: 'face', label: 'Face (Side)', description: 'Side of the face', bodySystem: 'general', shape: E(107, 52, 12, 16), separationConfig: S(1, -1, 2, 1.4, 6) },
  { id: 'ear', name: 'ear', label: 'Ear', description: 'Ear, side of the head', bodySystem: 'general', shape: E(92, 46, 6, 9), separationConfig: S(-1, 0, 4, 1.2, 9, 1.8) },

  { id: 'neck_side', name: 'neck', label: 'Neck (Side)', description: 'Side of the neck', bodySystem: 'respiratory', labelAt: { x: 98, y: 80 }, shape: P('M88,66 L110,66 L108,92 L90,92 Z'), separationConfig: S(0, -1, 1, 1.6, 4) },

  { id: 'torso_side', name: 'torso', label: 'Torso (Side)', description: 'Side of the torso', bodySystem: 'musculoskeletal', labelAt: { x: 96, y: 150 }, shape: P('M70,120 C74,108 84,100 96,96 L106,96 C114,102 118,116 118,132 C118,160 116,186 112,206 C104,214 88,214 78,208 C72,186 70,150 70,120 Z'), separationConfig: S(0, -1, 1, 1.6, 4) },
  { id: 'ribcage_side', name: 'ribcage', label: 'Ribcage (Side)', description: 'Side of the ribcage', bodySystem: 'cardiovascular', shape: E(96, 140, 20, 26), separationConfig: S(0, -1, 1.5, 1.4, 6) },
  { id: 'waist_side', name: 'waist', label: 'Waist (Side)', description: 'Side waist, waistline', bodySystem: 'musculoskeletal', shape: E(94, 182, 20, 24), separationConfig: S(0, 1, 1.5, 1.4, 6) },
  { id: 'hip_side', name: 'hip', label: 'Hip (Side)', description: 'Side of the hip', bodySystem: 'musculoskeletal', shape: E(94, 226, 22, 22), separationConfig: S(0, 1, 2, 1.3, 7) },

  { id: 'arm_side', name: 'arm', label: 'Arm (Side)', description: 'Arm at the side', bodySystem: 'musculoskeletal', shape: E(74, 152, 12, 44), separationConfig: S(-1, 0, 3, 1.2, 8, 1.4) },
  { id: 'hand_side', name: 'hand', label: 'Hand (Side)', description: 'Hand at the side', bodySystem: 'general', shape: E(72, 268, 10, 22), separationConfig: S(-1, 0, 4, 1.1, 9, 1.7) },

  { id: 'leg_side', name: 'leg', label: 'Leg (Side)', description: 'Leg, side view', bodySystem: 'musculoskeletal', shape: E(96, 272, 20, 42), separationConfig: S(0, 1, 2, 1.4, 6, 1.3) },
  { id: 'knee_side', name: 'knee', label: 'Knee (Side)', description: 'Knee, side view', bodySystem: 'musculoskeletal', shape: E(98, 308, 13, 14), separationConfig: S(0, -1, 2, 1.3, 7, 1.5) },
  { id: 'shin_side', name: 'shin', label: 'Shin (Side)', description: 'Shin, side view', bodySystem: 'musculoskeletal', shape: E(98, 354, 12, 42), separationConfig: S(0, 1, 2, 1.3, 7, 1.3) },
  { id: 'calf_side', name: 'calf', label: 'Calf (Side)', description: 'Calf, side view', bodySystem: 'musculoskeletal', shape: E(88, 348, 11, 34), separationConfig: S(-1, 0, 2, 1.3, 7, 1.3) },
  { id: 'ankle_side', name: 'ankle', label: 'Ankle (Side)', description: 'Ankle, side view', bodySystem: 'musculoskeletal', shape: E(98, 404, 10, 10), separationConfig: S(0, 1, 2, 1.4, 7, 1.5) },
  { id: 'foot_side', name: 'foot', label: 'Foot (Side)', description: 'Foot, side view', bodySystem: 'general', labelAt: { x: 112, y: 418 }, shape: P('M84,404 C90,402 104,403 116,406 C128,410 136,414 140,419 C142,422 140,425 134,425 L102,425 C94,424 88,418 84,410 Z'), separationConfig: S(1, 1, 2.5, 1.3, 8, 1.4) },
];

interface ShapeProps {
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeLinejoin?: 'round' | 'miter' | 'bevel';
  style?: React.CSSProperties;
  pointerEvents?: 'all' | 'none' | 'auto';
  role?: string;
  tabIndex?: number;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

interface BodyMapProps {
  selectedArea: string | null;
  onSelectArea: (areaId: string) => void;
  highlightOnly?: boolean;
  className?: string;
}

export const BodyMap: React.FC<BodyMapProps> = ({
  selectedArea,
  onSelectArea,
  highlightOnly = false,
  className = '',
}) => {
  const { t, language } = useLanguage();
  const [currentView, setCurrentView] = useState<ViewMode>('front');
  const [view, setView] = useState({ zoom: 1, x: 0, y: 0 });
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; region: Region } | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const regions = useMemo(() => {
    if (currentView === 'front') return frontRegions;
    if (currentView === 'back') return backRegions;
    return sideRegions;
  }, [currentView]);

  const details = currentView === 'front' ? FRONT_DETAILS : currentView === 'back' ? BACK_DETAILS : SIDE_DETAILS;
  const silhouette = currentView === 'front' || currentView === 'back' ? FRONT_BODY : SIDE_BODY;
  const hair = currentView === 'front' ? FRONT_HAIR : currentView === 'back' ? BACK_HAIR : SIDE_HAIR;
  const faceDetails = currentView === 'front' ? FRONT_FACE : [];

  const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));

  const zoomAt = useCallback((factor: number, clientX?: number, clientY?: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    setView((v) => {
      const nz = clampZoom(v.zoom * factor);
      if (nz === v.zoom || !rect) return { ...v, zoom: nz };
      const mx = (clientX ?? rect.left + rect.width / 2) - rect.left;
      const my = (clientY ?? rect.top + rect.height / 2) - rect.top;
      const cx = (mx - v.x) / v.zoom;
      const cy = (my - v.y) / v.zoom;
      return { zoom: nz, x: mx - nz * cx, y: my - nz * cy };
    });
  }, []);

  const zoomAtRef = useRef(zoomAt);
  zoomAtRef.current = zoomAt;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      zoomAtRef.current(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY);
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  const resetView = useCallback(() => setView({ zoom: 1, x: 0, y: 0 }), []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (highlightOnly) return;
    dragRef.current = { x: e.clientX, y: e.clientY };
    movedRef.current = false;
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) movedRef.current = true;
    if (movedRef.current) {
      setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
      dragRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const onPointerUp = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const getRegionById = useCallback((id: string) => regions.find((r) => r.id === id), [regions]);

  const handleRegionClick = (region: Region) => {
    if (highlightOnly || movedRef.current) return;
    onSelectArea(region.id);
  };

  const handleRegionKeyDown = (e: React.KeyboardEvent, region: Region) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRegionClick(region);
    }
  };

  const getCenter = (region: Region): { x: number; y: number } => {
    if (region.shape.type === 'ellipse') return { x: region.shape.cx, y: region.shape.cy };
    if (region.labelAt) return region.labelAt;
    return { x: 100, y: 200 };
  };

  const visualFill = (region: Region) => {
    const color = BODY_SYSTEMS[region.bodySystem].color;
    if (selectedArea === region.id) return color;
    if (hovered === region.id) return color;
    return 'none';
  };

  const visualOpacity = (region: Region) => {
    if (selectedArea === region.id) return 0.78;
    if (hovered === region.id) return 0.3;
    return 0;
  };

  const visualStroke = (region: Region) => {
    const color = BODY_SYSTEMS[region.bodySystem].color;
    if (selectedArea === region.id) return color;
    if (hovered === region.id) return color;
    return 'none';
  };

  const renderShape = (region: Region, props: ShapeProps, key: string) => {
    if (region.shape.type === 'ellipse') {
      return (
        <ellipse
          key={key}
          cx={region.shape.cx}
          cy={region.shape.cy}
          rx={region.shape.rx}
          ry={region.shape.ry}
          {...props}
        />
      );
    }
    return <path key={key} d={region.shape.d} {...props} />;
  };

  const getSep = (region: Region) =>
    region.separationConfig ? getSeparationOffset(region.separationConfig, view.zoom) : { x: 0, y: 0 };

  const viewButtons: { mode: ViewMode; label: string }[] = [
    { mode: 'front', label: t('front_view') },
    { mode: 'back', label: t('back_view') },
    { mode: 'left_side', label: 'Side' },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          {viewButtons.map(({ mode, label }) => (
            <button
              key={mode}
              type="button"
              onClick={() => { setCurrentView(mode); resetView(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                currentView === mode ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {!highlightOnly && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => zoomAt(1 / 1.25)}
              disabled={view.zoom <= MIN_ZOOM + 0.001}
              className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-base leading-none"
              aria-label="Zoom out"
            >
              −
            </button>
            <input
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.05}
              value={view.zoom}
              onChange={(e) => {
                const target = clampZoom(parseFloat(e.target.value));
                zoomAt(target / view.zoom);
              }}
              className="w-28 accent-blue-600"
              aria-label="Zoom level"
            />
            <button
              type="button"
              onClick={() => zoomAt(1.25)}
              disabled={view.zoom >= MAX_ZOOM - 0.001}
              className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-base leading-none"
              aria-label="Zoom in"
            >
              +
            </button>
            <span className="w-12 text-right text-xs tabular-nums text-gray-500">
              {Math.round(view.zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={resetView}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(BODY_SYSTEMS).map(([key, system]) => (
          <span
            key={key}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
            style={{ backgroundColor: system.color + '20', color: system.color }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: system.color }} />
            {language === 'ur' ? system.ur : system.label}
          </span>
        ))}
      </div>

      {/* Body canvas */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl border border-gray-200 select-none"
        style={{
          height: '440px',
          touchAction: 'none',
          cursor: dragging ? 'grabbing' : 'grab',
          background: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #f4f7fb 70%, #e9eef5 100%)',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <svg
          viewBox="0 0 200 440"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          style={{
            transformOrigin: '0 0',
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
            transition: dragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          <defs>
            <radialGradient id="skin" cx="50%" cy="34%" r="78%">
              <stop offset="0%" stopColor="#f6d8bd" />
              <stop offset="58%" stopColor="#ecbf99" />
              <stop offset="100%" stopColor="#d49e78" />
            </radialGradient>
            <radialGradient id="hlSoft">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="shSoft">
              <stop offset="0%" stopColor="#7c4a2c" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#7c4a2c" stopOpacity="0" />
            </radialGradient>
            <clipPath id="bodyClip">
              <path d={silhouette} />
            </clipPath>
          </defs>

          {/* Base body */}
          <path d={silhouette} fill="url(#skin)" stroke="#c98f66" strokeWidth="0.9" strokeLinejoin="round" />

          {/* Hair */}
          <path d={hair} fill="#4a3527" stroke="#3a2a1f" strokeWidth="0.5" strokeLinejoin="round" />

          {/* Shading + anatomy (clipped to body) */}
          <g clipPath="url(#bodyClip)" style={{ pointerEvents: 'none' }}>
            {/* soft volume highlights */}
            <ellipse cx="94" cy="34" rx="16" ry="20" fill="url(#hlSoft)" />
            <ellipse cx="100" cy="124" rx="30" ry="34" fill="url(#hlSoft)" />
            <ellipse cx="100" cy="184" rx="26" ry="30" fill="url(#hlSoft)" />
            <ellipse cx="79" cy="266" rx="12" ry="34" fill="url(#hlSoft)" />
            <ellipse cx="121" cy="266" rx="12" ry="34" fill="url(#hlSoft)" />
            {/* side shadows */}
            <ellipse cx="66" cy="180" rx="16" ry="80" fill="url(#shSoft)" />
            <ellipse cx="134" cy="180" rx="16" ry="80" fill="url(#shSoft)" />
            <ellipse cx="44" cy="170" rx="10" ry="70" fill="url(#shSoft)" />
            <ellipse cx="156" cy="170" rx="10" ry="70" fill="url(#shSoft)" />
            {/* under chin / chest */}
            <ellipse cx="100" cy="72" rx="16" ry="7" fill="url(#shSoft)" />
            <ellipse cx="100" cy="162" rx="26" ry="10" fill="url(#shSoft)" />

            {/* anatomical detail lines */}
            {details.map((d, i) => (
              <path key={`d${i}`} d={d} fill="none" stroke="#a86b44" strokeWidth="0.7" strokeLinecap="round" opacity="0.45" />
            ))}
            {faceDetails.map((d, i) => (
              <path key={`f${i}`} d={d} fill="none" stroke="#7a4a2c" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
            ))}
            <circle cx={NAVEL.x} cy={NAVEL.y} r="2.2" fill="#a86b44" opacity="0.5" />

            {/* region highlights */}
            {regions.map((region) => {
              const sep = getSep(region);
              return (
                <g key={`v-${region.id}`} transform={`translate(${sep.x} ${sep.y})`}>
                  {renderShape(region, {
                    fill: visualFill(region),
                    fillOpacity: visualOpacity(region),
                    stroke: visualStroke(region),
                    strokeWidth: selectedArea === region.id ? 1.6 : 1,
                    strokeLinejoin: 'round',
                    style: { pointerEvents: 'none', transition: 'fill-opacity 120ms ease, stroke 120ms ease' },
                  }, `v-${region.id}`)}
                </g>
              );
            })}
          </g>

          {/* Hit targets */}
          {!highlightOnly &&
            regions.map((region) => {
              const c = getCenter(region);
              const sep = getSep(region);
              const hs = getHitTargetScale(region.separationConfig, view.zoom);
              const hitPart = hs !== 1 ? ` translate(${c.x} ${c.y}) scale(${hs}) translate(${-c.x} ${-c.y})` : '';
              const transform = `translate(${sep.x} ${sep.y})${hitPart}`;
              return (
                <g
                  key={`h-${region.id}`}
                  transform={transform}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRegionClick(region)}
                  onPointerEnter={(e) => {
                    setHovered(region.id);
                    const rect = containerRef.current?.getBoundingClientRect();
                    if (rect) setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, region });
                  }}
                  onPointerMove={(e) => {
                    const rect = containerRef.current?.getBoundingClientRect();
                    if (rect) setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, region });
                  }}
                  onPointerLeave={() => {
                    setHovered(null);
                    setTooltip(null);
                  }}
                >
                  {renderShape(region, {
                    fill: 'transparent',
                    pointerEvents: 'all',
                    role: 'button',
                    tabIndex: 0,
                    'aria-label': region.label,
                    'aria-pressed': selectedArea === region.id,
                    onKeyDown: (e: React.KeyboardEvent) => handleRegionKeyDown(e, region),
                  }, `hs-${region.id}`)}
                </g>
              );
            })}

          {/* Labels on hover/select */}
          {!highlightOnly &&
            regions.map((region) => {
              if (selectedArea !== region.id && hovered !== region.id) return null;
              const c = getCenter(region);
              const sep = getSep(region);
              return (
                <text
                  key={`l-${region.id}`}
                  x={c.x + sep.x}
                  y={c.y + sep.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ pointerEvents: 'none' }}
                  fontSize="8"
                  fontWeight="600"
                  fill="#1f2937"
                  stroke="#ffffff"
                  strokeWidth="2.2"
                  paintOrder="stroke"
                >
                  {region.label}
                </text>
              );
            })}
        </svg>

        {/* Tooltip */}
        {tooltip && !highlightOnly && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-gray-900/95 px-3 py-2 text-xs font-medium text-white shadow-xl whitespace-nowrap"
            style={{ left: tooltip.x, top: tooltip.y - 12 }}
          >
            <p className="font-semibold">{tooltip.region.label}</p>
            <p className="text-gray-300 text-[10px] mt-0.5">{tooltip.region.description}</p>
            <span
              className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-medium"
              style={{
                backgroundColor: BODY_SYSTEMS[tooltip.region.bodySystem].color + '40',
                color: '#fff',
              }}
            >
              {language === 'ur' ? BODY_SYSTEMS[tooltip.region.bodySystem].ur : BODY_SYSTEMS[tooltip.region.bodySystem].label}
            </span>
          </div>
        )}
      </div>

      {/* Selection info */}
      {!highlightOnly && selectedArea && (
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">
            {t('selected_area')}{' '}
            <span className="text-blue-600">
              {getRegionById(selectedArea)?.label || selectedArea}
            </span>
          </p>
          <p className="mt-1 text-sm text-gray-500">{t('cant_find')}</p>
        </div>
      )}

      {!highlightOnly && (
        <p className="text-center text-xs text-gray-400">
          Scroll or +/− to zoom · Drag to pan · Click a body part to select
        </p>
      )}
    </div>
  );
};
