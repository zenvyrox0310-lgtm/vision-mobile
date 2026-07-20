/**
 * MÓDULO 2: Motor de Realidade Aumentada
 * Gerencia WebXR e renderização de objetos 3D
 */

import * as THREE from 'three';
import { logger } from '@utils/logger';
import { WebXRDetector } from '@utils/webxr-detector';

export class AREngine {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private xrSession: XRSession | null = null;
  private isActive = false;

  constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
    this.scene = scene;
    this.renderer = renderer;
  }

  async initialize(): Promise<void> {
    logger.info('AREngine', '🥽 Inicializando motor AR...');

    const hasWebXR = WebXRDetector.hasWebXR();
    if (!hasWebXR) {
      logger.warn('AREngine', 'WebXR não disponível, usando modo compatível');
      this.initializeFallbackMode();
      return;
    }

    try {
      const isSupported = await WebXRDetector.checkFeature('immersive-ar');
      if (isSupported) {
        logger.info('AREngine', 'Immersive AR suportado');
      } else {
        logger.info('AREngine', 'Usando modo AR compatível');
        this.initializeFallbackMode();
      }
    } catch (error) {
      logger.error('AREngine', 'Erro ao inicializar AR', error);
      this.initializeFallbackMode();
    }
  }

  private initializeFallbackMode(): void {
    logger.info('AREngine', 'Modo compatível ativado');
    // Aqui implementaríamos rendering sem WebXR
  }

  async requestSession(): Promise<void> {
    if (!navigator.xr) {
      throw new Error('WebXR não disponível');
    }

    try {
      this.xrSession = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'dom-overlay'],
        optionalFeatures: ['dom-overlay-for-handheld-ar', 'camera-access'],
        domOverlay: { root: document.body },
      });

      this.isActive = true;
      logger.info('AREngine', 'Sessão XR iniciada');
      document.getElementById('xr-status')!.textContent = 'Ativa';
    } catch (error) {
      logger.error('AREngine', 'Erro ao solicitar sessão XR', error);
      document.getElementById('xr-status')!.textContent = 'Indisponível';
      throw error;
    }
  }

  public isXRActive(): boolean {
    return this.isActive;
  }

  public addObject(object: THREE.Object3D): void {
    this.scene.add(object);
  }

  public removeObject(object: THREE.Object3D): void {
    this.scene.remove(object);
  }
}
