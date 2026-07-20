/**
 * MÓDULO 4: Sistema de Interface Espacial
 * Cria janelas e elementos com profundidade real e vidro
 */

import * as THREE from 'three';
import { logger } from '@utils/logger';

export class SpatialUISystem {
  private scene: THREE.Scene;
  private windows: Map<string, THREE.Group> = new Map();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public createSpatialWindow(
    position: THREE.Vector3,
    width: number,
    height: number,
    title: string
  ): string {
    const group = new THREE.Group();
    group.position.copy(position);

    // Criar vidro (glass effect)
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.7,
      roughness: 0.1,
      transparent: true,
      opacity: 0.9,
    });

    const geometry = new THREE.BoxGeometry(width, height, 0.02);
    const mesh = new THREE.Mesh(geometry, glassMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Adicionar borda
    const edgeGeometry = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(
      edgeGeometry,
      new THREE.LineBasicMaterial({ color: 0x0ea5e9, linewidth: 2 })
    );
    group.add(mesh);
    group.add(line);

    const id = `window-${Date.now()}`;
    this.windows.set(id, group);
    this.scene.add(group);

    logger.info('SpatialUISystem', `Janela espacial criada: ${title}`);
    return id;
  }

  public createDemoScene(): void {
    logger.info('SpatialUISystem', 'Criando cena de demonstração...');

    // Criar cubo girando
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      metalness: 0.5,
      roughness: 0.5,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, -5);
    cube.castShadow = true;
    cube.receiveShadow = true;
    this.scene.add(cube);

    // Animar cubo
    const animate = () => {
      cube.rotation.x += 0.005;
      cube.rotation.y += 0.005;
      requestAnimationFrame(animate);
    };
    animate();

    // Criar esfera
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      metalness: 0.8,
      roughness: 0.2,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-3, 0, -5);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    this.scene.add(sphere);
  }

  public getWindow(id: string): THREE.Group | undefined {
    return this.windows.get(id);
  }

  public removeWindow(id: string): void {
    const window = this.windows.get(id);
    if (window) {
      this.scene.remove(window);
      this.windows.delete(id);
    }
  }
}
