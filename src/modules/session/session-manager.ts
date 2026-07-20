/**
 * Gerenciador de Sessão
 * Controla o estado geral da aplicação
 */

import { logger } from '@utils/logger';
import { SessionState, PerformanceMetrics } from '@types/index';

export class SessionManager {
  private state: SessionState = {
    initialized: false,
    isXRActive: false,
    isPaused: false,
    currentTime: 0,
    frameCount: 0,
    performance: {
      fps: 0,
      frameDuration: 0,
      jank: 0,
      cpuTime: 0,
      gpuTime: 0,
      memoryUsage: 0,
    },
  };
  private startTime = Date.now();

  constructor() {
    logger.info('SessionManager', 'Gerenciador de sessão inicializado');
  }

  public initialize(): void {
    this.state.initialized = true;
    logger.info('SessionManager', 'Sessão inicializada');
  }

  public getState(): SessionState {
    return { ...this.state };
  }

  public updatePerformance(metrics: PerformanceMetrics): void {
    this.state.performance = metrics;
  }

  public setXRActive(active: boolean): void {
    this.state.isXRActive = active;
  }
}
