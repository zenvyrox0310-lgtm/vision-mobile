/**
 * WebXR Capability Detection
 * Detects available XR features and APIs
 */

import { XRCapabilities } from '@types/index';
import { logger } from './logger';

export class WebXRDetector {
  static detect(): XRCapabilities {
    const capabilities: XRCapabilities = {
      hasWebXR: !!navigator.xr,
      hasWebXRImmersive: false,
      hasSpatialAnchors: false,
      hasPlaneDetection: false,
      hasHandTracking: false,
      hasLightEstimation: false,
    };

    if (!capabilities.hasWebXR) {
      logger.warn('WebXRDetector', 'WebXR not supported');
      return capabilities;
    }

    // Check for immersive sessions
    navigator.xr!.isSessionSupported('immersive-ar')
      .then((supported) => {
        if (supported) {
          capabilities.hasWebXRImmersive = true;
          logger.info('WebXRDetector', 'WebXR immersive-ar supported');
        }
      })
      .catch(() => {
        logger.debug('WebXRDetector', 'WebXR immersive-ar check failed');
      });

    return capabilities;
  }

  static hasWebXR(): boolean {
    return !!navigator.xr;
  }

  static async checkFeature(feature: string): Promise<boolean> {
    if (!this.hasWebXR()) return false;

    try {
      return await navigator.xr!.isSessionSupported(feature as XRSessionMode);
    } catch {
      return false;
    }
  }
}
