/**
 * MÓDULO 7: Monitor de Performance
 * Controla FPS e otimiza renderização
 */

import { logger } from '@utils/logger';
import { PerformanceMetrics } from '@types/index';

export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private metrics: PerformanceMetrics = {
    fps: 60,
    frameDuration: 0,
    jank: 0,
    cpuTime: 0,
    gpuTime: 0,
    memoryUsage: 0,
  };
  private isRunning = false;
  private lastFrameTimes: number[] = [];
  private targetFrameTime = 16.67; // 60 FPS

  public start(): void {
    this.isRunning = true;
    logger.info('PerformanceMonitor', '📊 Monitor de performance iniciado');
    this.monitorLoop();
  }

  private monitorLoop = (): void => {
    if (!this.isRunning) return;

    const now = performance.now();
    const delta = now - this.lastTime;

    this.lastFrameTimes.push(delta);
    if (this.lastFrameTimes.length > 60) {
      this.lastFrameTimes.shift();
    }

    this.frameCount++;

    // Atualizar FPS a cada segundo
    if (delta >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = now;
    }

    // Calcular métricas
    this.updateMetrics();

    requestAnimationFrame(this.monitorLoop);
  };

  private updateMetrics(): void {
    const avgFrameTime = this.lastFrameTimes.reduce((a, b) => a + b, 0) / this.lastFrameTimes.length;
    this.metrics.fps = this.fps;
    this.metrics.frameDuration = avgFrameTime;
    this.metrics.jank = Math.max(...this.lastFrameTimes) - Math.min(...this.lastFrameTimes);

    if (performance.memory) {
      this.metrics.memoryUsage = performance.memory.usedJSHeapSize / 1048576; // MB
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public stop(): void {
    this.isRunning = false;
    logger.info('PerformanceMonitor', 'Monitor de performance parado');
  }
}
