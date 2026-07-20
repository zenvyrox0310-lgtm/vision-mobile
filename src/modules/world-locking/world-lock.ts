/**
 * MÓDULO 3: Sistema de World Locking
 * Mantém objetos presos ao ambiente, não à câmera
 */

import * as THREE from 'three';
import { logger } from '@utils/logger';

export class WorldLockingSystem {
  private scene: THREE.Scene;
  private anchors: Map<string, THREE.Object3D> = new Map();
  private isSupported = false;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  async initialize(): Promise<void> {
    logger.info('WorldLockingSystem', '🔒 Inicializando World Locking...');

    // Verificar suporte a âncoras espaciais
    this.isSupported = await this.checkAnchorSupport();

    if (this.isSupported) {
      logger.info('WorldLockingSystem', 'Âncoras espaciais suportadas');
    } else {
      logger.info('WorldLockingSystem', 'Usando fallback: World Locking baseado em pose');
    }
  }

  private async checkAnchorSupport(): Promise<boolean> {
    if (!navigator.xr) return false;

    try {
      const supported = await navigator.xr.isSessionSupported('immersive-ar');
      return supported;
    } catch {
      return false;
    }
  }

  public createWorldLockedObject(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    position: THREE.Vector3
  ): string {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const id = `anchor-${Date.now()}`;
    this.anchors.set(id, mesh);
    this.scene.add(mesh);

    logger.info('WorldLockingSystem', `Objeto world-locked criado: ${id}`);
    return id;
  }

  public getAnchoredObject(id: string): THREE.Object3D | undefined {
    return this.anchors.get(id);
  }

  public removeAnchor(id: string): void {
    const obj = this.anchors.get(id);
    if (obj) {
      this.scene.remove(obj);
      this.anchors.delete(id);
      logger.info('WorldLockingSystem', `Âncora removida: ${id}`);
    }
  }

  public update(): void {
    // Atualizar posições das âncoras se necessário
    this.anchors.forEach((obj) => {
      // Implementar lógica de atualização de pose se needed
      obj.updateMatrixWorld(true);
    });
  }

  public getAnchors(): Map<string, THREE.Object3D> {
    return new Map(this.anchors);
  }
}
