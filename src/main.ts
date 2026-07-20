import * as THREE from 'three';
import { CameraSystem } from '@modules/camera/camera-system';
import { AREngine } from '@core/engine/ar-engine';
import { WorldLockingSystem } from '@modules/world-locking/world-lock';
import { SpatialUISystem } from '@modules/spatial-ui/spatial-ui-system';
import { PerformanceMonitor } from '@core/performance/performance-monitor';
import { SessionManager } from '@modules/session/session-manager';
import { logger } from '@utils/logger';
import { WebXRDetector } from '@utils/webxr-detector';

/**
 * Vision Mobile - Mixed Reality Application
 * Main entry point
 */

class VisionMobile {
  private camera: CameraSystem | null = null;
  private arEngine: AREngine | null = null;
  private worldLocking: WorldLockingSystem | null = null;
  private spatialUI: SpatialUISystem | null = null;
  private performanceMonitor: PerformanceMonitor | null = null;
  private sessionManager: SessionManager | null = null;
  private scene: THREE.Scene | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private isRunning = false;

  async initialize(): Promise<void> {
    logger.info('VisionMobile', '🚀 Inicializando Vision Mobile...');

    try {
      // Detectar capacidades XR
      const xrCaps = WebXRDetector.detect();
      this.updateDebug('WebXR Detectado', xrCaps.hasWebXR);
      this.updateDebug('Immersive AR', xrCaps.hasWebXRImmersive);

      // Inicializar gerenciador de sessão
      this.sessionManager = new SessionManager();

      // Inicializar monitor de performance
      this.performanceMonitor = new PerformanceMonitor();
      this.performanceMonitor.start();

      // Inicializar sistema de câmera
      this.camera = new CameraSystem();
      await this.camera.initialize();
      this.updateDebug('Câmera', 'Pronta');

      // Inicializar Three.js
      this.setupThreeJS();

      // Inicializar motor AR
      this.arEngine = new AREngine(this.scene!, this.renderer!);
      await this.arEngine.initialize();
      this.updateDebug('Motor AR', 'Inicializado');

      // Inicializar World Locking
      this.worldLocking = new WorldLockingSystem(this.scene!);
      await this.worldLocking.initialize();
      this.updateDebug('World Locking', 'Ativo');

      // Inicializar UI Espacial
      this.spatialUI = new SpatialUISystem(this.scene!);
      this.spatialUI.createDemoScene();
      this.updateDebug('UI Espacial', 'Carregada');

      // Iniciar loop de renderização
      this.isRunning = true;
      this.animate();

      logger.info('VisionMobile', '✅ Inicialização completa!');
      this.updateDebug('Status', 'Pronto');
    } catch (error) {
      logger.error('VisionMobile', 'Erro na inicialização', error);
      this.updateDebug('Erro', String(error));
    }
  }

  private setupThreeJS(): void {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer
    const canvas = document.getElementById('render-canvas') as HTMLCanvasElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    this.scene.add(directionalLight);

    // Handle resize
    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      this.renderer!.setSize(w, h);
    });

    logger.info('VisionMobile', 'Three.js configurado');
  }

  private animate = (): void => {
    if (!this.isRunning) return;
    requestAnimationFrame(this.animate);

    if (this.scene && this.renderer) {
      // Renderizar câmera pass-through
      if (this.camera) {
        this.camera.renderToCanvas();
      }

      // Atualizar performance
      if (this.performanceMonitor) {
        const metrics = this.performanceMonitor.getMetrics();
        document.getElementById('fps')!.textContent = Math.round(metrics.fps).toString();
      }

      // Atualizar World Locking
      if (this.worldLocking) {
        this.worldLocking.update();
      }

      // Renderizar cena 3D
      this.renderer.render(this.scene, this.renderer.domElement.parentElement?.querySelector('canvas') as any || new THREE.PerspectiveCamera());
    }
  };

  toggleCamera(): void {
    if (this.camera) {
      if (this.camera.isRunning()) {
        this.camera.stop();
        document.getElementById('camera-status')!.textContent = 'Parada';
        this.updateDebug('Câmera', 'Parada');
      } else {
        this.camera.start();
        document.getElementById('camera-status')!.textContent = 'Ativa';
        this.updateDebug('Câmera', 'Ativa');
      }
    }
  }

  async startXR(): Promise<void> {
    if (this.arEngine) {
      try {
        await this.arEngine.requestSession();
        this.updateDebug('XR', 'Ativo');
      } catch (error) {
        logger.error('VisionMobile', 'Erro ao iniciar XR', error);
        this.updateDebug('XR', 'Não suportado');
      }
    }
  }

  private updateDebug(key: string, value: any): void {
    const debugOutput = document.getElementById('debug-output');
    if (debugOutput) {
      const line = document.createElement('div');
      line.textContent = `${key}: ${JSON.stringify(value).substring(0, 30)}`;
      debugOutput.appendChild(line);
      if (debugOutput.children.length > 10) {
        debugOutput.removeChild(debugOutput.firstChild!);
      }
    }
  }

  getScene(): THREE.Scene | null {
    return this.scene;
  }

  getRenderer(): THREE.WebGLRenderer | null {
    return this.renderer;
  }
}

// Instância global
const app = new VisionMobile();

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', async () => {
  await app.initialize();

  // Botões de controle
  document.getElementById('btn-toggle-camera')?.addEventListener('click', () => app.toggleCamera());
  document.getElementById('btn-xr-start')?.addEventListener('click', () => app.startXR());
  document.getElementById('btn-demo')?.addEventListener('click', () => {
    const event = new CustomEvent('demo-activated');
    document.dispatchEvent(event);
  });
});

export { app };
