/**
 * Type definitions for Vision Mobile
 */

/**
 * Camera Pass-through Types
 */
export interface CameraConstraints {
  width?: ConstrainULong;
  height?: ConstrainULong;
  deviceId?: ConstrainDOMString;
  facingMode?: ConstrainDOMString;
}

export interface CameraConfig {
  width: number;
  height: number;
  frameRate: number;
  facingMode: 'environment' | 'user';
}

/**
 * XR Session Types
 */
export interface XRSessionConfig {
  requiredFeatures: string[];
  optionalFeatures: string[];
  domOverlay?: { root: Element };
}

export interface XRCapabilities {
  hasWebXR: boolean;
  hasWebXRImmersive: boolean;
  hasSpatialAnchors: boolean;
  hasPlaneDetection: boolean;
  hasHandTracking: boolean;
  hasLightEstimation: boolean;
}

/**
 * Anchor and World Locking Types
 */
export interface Pose {
  position: [number, number, number];
  quaternion: [number, number, number, number];
}

export interface SpatialAnchorData {
  id: string;
  pose: Pose;
  createdAt: number;
  lastUpdated: number;
}

/**
 * Performance Types
 */
export interface PerformanceMetrics {
  fps: number;
  frameDuration: number;
  jank: number;
  cpuTime: number;
  gpuTime: number;
  memoryUsage: number;
}

/**
 * Spatial UI Types
 */
export interface SpatialWindowConfig {
  position: [number, number, number];
  size: [number, number];
  rotation?: [number, number, number];
  depth?: number;
  opacity?: number;
}

/**
 * Session Types
 */
export interface SessionState {
  initialized: boolean;
  isXRActive: boolean;
  isPaused: boolean;
  currentTime: number;
  frameCount: number;
  performance: PerformanceMetrics;
}

/**
 * Tracking Types
 */
export interface HandData {
  joints: Record<string, Pose>;
  gesture: string;
  confidence: number;
}

export interface PoseData {
  position: [number, number, number];
  quaternion: [number, number, number, number];
  linearVelocity?: [number, number, number];
  angularVelocity?: [number, number, number];
}
