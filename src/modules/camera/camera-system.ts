/**
 * MÓDULO 1: Sistema de Câmera Pass-through
 * Gerencia feed da câmera em tempo real com controle de resolução automático
 */

import { logger } from '@utils/logger';
import { CameraConfig } from '@types/index';

export class CameraSystem {
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private stream: MediaStream | null = null;
  private isRunning = false;
  private config: CameraConfig = {
    width: 1920,
    height: 1080,
    frameRate: 60,
    facingMode: 'environment',
  };

  async initialize(): Promise<void> {
    logger.info('CameraSystem', '📷 Inicializando câmera pass-through...');

    this.video = document.getElementById('camera-feed') as HTMLVideoElement;
    this.canvas = document.getElementById('camera-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');

    if (!this.video || !this.canvas || !this.ctx) {
      throw new Error('Elementos de câmera não encontrados no DOM');
    }

    try {
      // Solicitar permissão de câmera
      const constraints = this.getOptimalConstraints();
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Atribuir stream ao vídeo
      this.video.srcObject = this.stream;

      // Aguardar o vídeo carregar metadata
      await new Promise<void>((resolve) => {
        this.video!.onloadedmetadata = () => {
          this.video!.play().catch(console.error);
          resolve();
        };
      });

      // Ajustar tamanho do canvas
      this.adjustCanvasSize();

      // Iniciar renderização
      this.isRunning = true;
      this.renderLoop();

      logger.info('CameraSystem', '✅ Câmera inicializada com sucesso');
      document.getElementById('camera-status')!.textContent = 'Ativa';
    } catch (error) {
      logger.error('CameraSystem', 'Erro ao acessar câmera', error);
      document.getElementById('camera-status')!.textContent = 'Erro';
      throw error;
    }
  }

  private getOptimalConstraints(): MediaStreamConstraints {
    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
    const isLandscape = window.innerWidth > window.innerHeight;

    let width = isMobile ? 1280 : 1920;
    let height = isMobile ? 720 : 1080;

    if (!isLandscape) {
      [width, height] = [height, width];
    }

    return {
      video: {
        facingMode: this.config.facingMode,
        width: { ideal: width },
        height: { ideal: height },
        frameRate: { ideal: this.config.frameRate },
      },
      audio: false,
    };
  }

  private adjustCanvasSize(): void {
    if (!this.video || !this.canvas) return;

    this.config.width = this.video.videoWidth;
    this.config.height = this.video.videoHeight;
    this.canvas.width = this.config.width;
    this.canvas.height = this.config.height;

    logger.info('CameraSystem', `Canvas ajustado: ${this.config.width}x${this.config.height}`);
  }

  private renderLoop = (): void => {
    if (!this.isRunning) return;

    if (this.video && this.ctx) {
      // Renderizar frame da câmera no canvas
      this.ctx.drawImage(this.video, 0, 0, this.canvas!.width, this.canvas!.height);
    }

    requestAnimationFrame(this.renderLoop);
  };

  public renderToCanvas(): void {
    if (this.video && this.ctx) {
      this.ctx.drawImage(this.video, 0, 0, this.canvas!.width, this.canvas!.height);
    }
  }

  public start(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.enabled = true;
      });
      this.isRunning = true;
      logger.info('CameraSystem', 'Câmera iniciada');
    }
  }

  public stop(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.enabled = false;
      });
      this.isRunning = false;
      logger.info('CameraSystem', 'Câmera parada');
    }
  }

  public isRunning(): boolean {
    return this.isRunning;
  }

  public getConfig(): CameraConfig {
    return { ...this.config };
  }

  public setResolution(width: number, height: number): void {
    this.config.width = width;
    this.config.height = height;
    logger.info('CameraSystem', `Resolução alterada para ${width}x${height}`);
  }

  public dispose(): void {
    this.isRunning = false;
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    logger.info('CameraSystem', 'Sistema de câmera descartado');
  }
}
