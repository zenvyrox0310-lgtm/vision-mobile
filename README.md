# Vision Mobile

Um sistema profissional de Realidade Mista (Mixed Reality) inspirado no Apple Vision Pro e Meta Quest 3, desenvolvido com arquitetura limpa, modular e escalável.

## 🎯 Objetivo

Criar uma experiência imersiva de Mixed Reality com:
- Sistema de câmera Pass-through
- Motor de Realidade Aumentada (WebXR)
- World Locking avançado com âncoras espaciais
- Interface Espacial com profundidade real
- Renderização VR SBS
- Performance otimizada (30-60 FPS)
- Menus e objetos em espaço 3D

## 📐 Arquitetura

```
vision-mobile/
├── core/
│   ├── engine/               # Core dos motores
│   │   ├── ar-engine.ts      # Motor de AR/WebXR
│   │   ├── render-engine.ts  # Motor de renderização
│   │   └── xr-manager.ts     # Gerenciador XR
│   │
│   ├── tracking/             # Sistema de rastreamento
│   │   ├── pose-tracker.ts   # Rastreamento de pose
│   │   ├── hand-tracker.ts   # Rastreamento de mãos
│   │   └── tracker.ts        # Orchestrador
│   │
│   ├── anchors/              # World Locking e âncoras espaciais
│   │   ├── anchor-system.ts  # Sistema de âncoras
│   │   ├── spatial-anchor.ts # Âncora espacial
│   │   └── fallback-anchor.ts # Fallback para navegadores limitados
│   │
│   └── performance/          # Gerenciador de performance
│       ├── performance-monitor.ts
│       ├── frame-scheduler.ts
│       └── gpu-optimizer.ts
│
├── modules/
│   ├── camera/               # MÓDULO 1: Pass-through
│   │   ├── camera-system.ts
│   │   ├── camera-manager.ts
│   │   └── resolution-controller.ts
│   │
│   ├── ar/                   # MÓDULO 2: Motor AR
│   │   ├── ar-system.ts
│   │   └── xr-fallback.ts
│   │
│   ├── world-locking/        # MÓDULO 3: World Locking
│   │   ├── world-lock.ts
│   │   ├── spatial-mapping.ts
│   │   └── plane-detection.ts
│   │
│   ├── spatial-ui/           # MÓDULO 4: Interface Espacial
│   │   ├── spatial-window.ts
│   │   ├── glass-material.ts
│   │   ├── spatial-lighting.ts
│   │   └── spatial-shadow.ts
│   │
│   ├── virtual-display/      # MÓDULO 5: Tela Virtual 65"
│   │   ├── virtual-display.ts
│   │   └── display-renderer.ts
│   │
│   ├── vr-sbs/               # MÓDULO 6: VR Box SBS
│   │   ├── stereo-renderer.ts
│   │   ├── ipd-calibration.ts
│   │   └── vr-mask.ts
│   │
│   ├── session/              # Gerenciador de Sessão
│   │   ├── session-manager.ts
│   │   └── session-state.ts
│   │
│   └── ui/                   # MÓDULO 8: Menus 3D
│       ├── spatial-menu.ts
│       ├── menu-renderer.ts
│       └── interaction.ts
│
├── utils/
│   ├── math/                 # Utilitários matemáticos
│   ├── webxr-detector.ts     # Detecção de recursos
│   ├── compatibility.ts      # Camada de compatibilidade
│   └── logger.ts             # Sistema de logging
│
├── tests/                    # Testes por módulo
│   ├── camera.test.ts
│   ├── ar.test.ts
│   ├── world-locking.test.ts
│   └── ...
│
├── index.html               # Entry point
├── main.ts                  # Bootstrap
├── styles.css
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## 📋 Roadmap de Desenvolvimento

### ✅ FASE 1: Fundação

- [ ] **MÓDULO 1**: Sistema de Câmera Pass-through
  - [ ] Inicialização de câmera com permissões
  - [ ] Controle de resolução automático
  - [ ] Preview sem tela preta
  - [ ] Testes de compatibilidade

- [ ] **MÓDULO 2**: Motor de Realidade Aumentada
  - [ ] Detecção de WebXR
  - [ ] Inicialização de sessão XR
  - [ ] Fallback para modo compatível
  - [ ] Renderização de objetos 3D

- [ ] **MÓDULO 3**: Sistema de World Locking
  - [ ] Âncoras espaciais nativas (quando disponível)
  - [ ] Fallback baseado em pose/inércia
  - [ ] Detecção de planos
  - [ ] Testes de estabilidade

### 🔄 FASE 2: Interface e Visualização

- [ ] **MÓDULO 4**: Interface Espacial
  - [ ] Sistema de vidro (glass morphism 3D)
  - [ ] Iluminação dinâmica
  - [ ] Sombras em tempo real
  - [ ] Perspectiva e profundidade

- [ ] **MÓDULO 5**: Tela Virtual 65"
  - [ ] Renderização de monitor real
  - [ ] World-locked positioning
  - [ ] Conteúdo responsivo

- [ ] **MÓDULO 8**: Menus Espaciais
  - [ ] Objetos 3D em espaço
  - [ ] Interação por gaze/hand tracking
  - [ ] Animações fluidas

### 🎮 FASE 3: Imersão e Performance

- [ ] **MÓDULO 6**: VR Box SBS
  - [ ] Renderização estéreo
  - [ ] Calibração IPD
  - [ ] Máscara VR

- [ ] **MÓDULO 7**: Sistema de Performance
  - [ ] Monitoramento FPS
  - [ ] Otimização GPU
  - [ ] Frame scheduling

## 🔧 Stack Tecnológico

- **Linguagem**: TypeScript
- **Build**: Vite
- **3D Graphics**: Three.js (ou Babylon.js)
- **XR**: WebXR API
- **Rendering**: WebGL 2.0 / WebGPU
- **Threading**: Web Workers (para cálculos pesados)
- **Tests**: Vitest + Testing Library

## 📱 Requisitos

- Navegador moderno com suporte a WebXR (recomendado)
- Dispositivo com câmera e sensores IMU (ideal)
- Para VR Box: Smartphone com giroscópio

## 🚀 Como Começar

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Testes
npm run test
```

## 📄 Princípios de Design

1. **Modularidade**: Cada módulo funciona independentemente
2. **Escalabilidade**: Preparado para crescimento
3. **Compatibilidade**: Detecta e adapta-se aos recursos disponíveis
4. **Performance**: Otimizado para dispositivos móveis
5. **Qualidade**: Sem compromissos visuais

## 📝 Notas Importantes

- Nenhum elemento deve estar "preso à câmera" (HUD) a menos que intencionalmente
- World Locking é prioridade: objetos devem estar no espaço, não na tela
- Performance é crítica: foco em 30-60 FPS
- Compatibilidade: APIs alternativas sempre que WebXR não disponível

---

**Status**: Iniciação de Projeto  
**Versão**: 0.0.1-alpha  
**Última Atualização**: 2026-07-20
