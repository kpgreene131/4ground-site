import { useState, useEffect, useRef, useCallback } from 'react';
import SpectrumAnalyzer from './visualizer/SpectrumAnalyzer';
import LevelMeter from './visualizer/LevelMeter';

export interface StemData {
  name: string;
  file: string;
}

export interface StemVisualizerProps {
  trackTitle: string;
  stemBasePath: string;
  bpm?: number;
  className?: string;
}

interface StemState {
  id: string;
  name: string;
  volume: number;
  muted: boolean;
  solo: boolean;
  eq: {
    low: number;
    mid: number;
    high: number;
  };
  fx: {
    reverb: number;
    delay: number;
  };
}

interface AudioEngineState {
  context: AudioContext | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  stems: StemState[];
  masterVolume: number;
  macroLPF: number;
  isLiteMode: boolean;
  isLoading: boolean;
  error: string | null;
}

class AudioEngine {
  private _context: AudioContext | null = null;

  get context(): AudioContext | null {
    return this._context;
  }
  private masterGain: GainNode | null = null;
  private stems: Map<
    string,
    {
      buffer: AudioBuffer | null;
      source: AudioBufferSourceNode | null;
      gain: GainNode;
      eqLow: BiquadFilterNode;
      eqMid: BiquadFilterNode;
      eqHigh: BiquadFilterNode;
      reverbSend: GainNode;
      delaySend: GainNode;
      analyser: AnalyserNode;
    }
  > = new Map();
  private reverbBus: {
    convolver: ConvolverNode | null;
    return: GainNode | null;
  } = { convolver: null, return: null };
  private delayBus: {
    delay: DelayNode | null;
    feedback: GainNode | null;
    filter: BiquadFilterNode | null;
    return: GainNode | null;
  } = { delay: null, feedback: null, filter: null, return: null };
  private macroFilter: BiquadFilterNode | null = null;
  private analyser: AnalyserNode | null = null;
  private startTime: number = 0;
  private isInitialized: boolean = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Check for Web Audio API support
    if (!window.AudioContext && !(window as any).webkitAudioContext) {
      throw new Error(
        'Web Audio API is not supported in this browser. Please use Chrome 66+, Firefox 60+, or Safari 14.1+.'
      );
    }

    try {
      this._context = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Check for minimum sample rate
      if (this._context.sampleRate < 22050) {
        console.warn('Low sample rate detected. Audio quality may be reduced.');
      }

      if (this._context.state === 'suspended') {
        await this._context.resume();
      }

      this.setupMasterChain();
      this.setupFXBuses();
      this.isInitialized = true;
    } catch (error) {
      throw new Error(
        `Failed to initialize audio context: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private setupMasterChain(): void {
    if (!this._context) return;

    this.masterGain = this._context.createGain();
    this.masterGain.gain.value = 0.75;

    this.macroFilter = this._context.createBiquadFilter();
    this.macroFilter.type = 'lowpass';
    this.macroFilter.frequency.value = 20000;
    this.macroFilter.Q.value = 0.7;

    this.analyser = this._context.createAnalyser();
    this.analyser.fftSize = 512;

    this.masterGain.connect(this.macroFilter);
    this.macroFilter.connect(this.analyser);
    this.analyser.connect(this._context.destination);
  }

  private setupFXBuses(): void {
    if (!this._context || !this.masterGain) return;

    // Reverb bus
    this.reverbBus.convolver = this._context.createConvolver();
    this.reverbBus.return = this._context.createGain();
    this.reverbBus.return.gain.value = 0.3;

    // Create impulse response for reverb
    this.createImpulseResponse();

    this.reverbBus.convolver.connect(this.reverbBus.return);
    this.reverbBus.return.connect(this.masterGain);

    // Delay bus
    this.delayBus.delay = this._context.createDelay(1.0);
    this.delayBus.delay.delayTime.value = 0.25;

    this.delayBus.feedback = this._context.createGain();
    this.delayBus.feedback.gain.value = 0.4;

    this.delayBus.filter = this._context.createBiquadFilter();
    this.delayBus.filter.type = 'highpass';
    this.delayBus.filter.frequency.value = 800;

    this.delayBus.return = this._context.createGain();
    this.delayBus.return.gain.value = 0.3;

    this.delayBus.delay.connect(this.delayBus.feedback);
    this.delayBus.feedback.connect(this.delayBus.filter);
    this.delayBus.filter.connect(this.delayBus.delay);
    this.delayBus.delay.connect(this.delayBus.return);
    this.delayBus.return.connect(this.masterGain);
  }

  private createImpulseResponse(): void {
    if (!this._context || !this.reverbBus.convolver) return;

    const sampleRate = this._context.sampleRate;
    const length = sampleRate * 2; // 2 second reverb
    const impulse = this._context.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const decay = Math.pow(1 - i / length, 2);
        channelData[i] = (Math.random() * 2 - 1) * decay;
      }
    }

    this.reverbBus.convolver.buffer = impulse;
  }

  async loadStem(id: string, name: string, url: string): Promise<void> {
    if (!this._context || !this.masterGain) {
      throw new Error('Audio context not initialized');
    }

    let retryCount = 0;
    const maxRetries = 3;

    const loadWithRetry = async (): Promise<ArrayBuffer> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch(url, {
          signal: controller.signal,
          mode: 'cors',
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.arrayBuffer();
      } catch (error) {
        retryCount++;
        if (
          retryCount <= maxRetries &&
          error instanceof Error &&
          error.name !== 'AbortError'
        ) {
          console.warn(
            `Retry ${retryCount}/${maxRetries} for ${name}: ${error.message}`
          );
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * retryCount)
          ); // Exponential backoff
          return loadWithRetry();
        }
        throw error;
      }
    };

    try {
      const arrayBuffer = await loadWithRetry();
      const audioBuffer = await this._context.decodeAudioData(arrayBuffer);

      // Create audio nodes for this stem
      const gain = this._context.createGain();
      gain.gain.value = 0.75;

      const eqLow = this._context.createBiquadFilter();
      eqLow.type = 'peaking';
      eqLow.frequency.value = 100;
      eqLow.Q.value = 0.7;
      eqLow.gain.value = 0;

      const eqMid = this._context.createBiquadFilter();
      eqMid.type = 'peaking';
      eqMid.frequency.value = 1000;
      eqMid.Q.value = 0.7;
      eqMid.gain.value = 0;

      const eqHigh = this._context.createBiquadFilter();
      eqHigh.type = 'peaking';
      eqHigh.frequency.value = 8000;
      eqHigh.Q.value = 0.7;
      eqHigh.gain.value = 0;

      const reverbSend = this._context.createGain();
      reverbSend.gain.value = 0;

      const delaySend = this._context.createGain();
      delaySend.gain.value = 0;

      const analyser = this._context.createAnalyser();
      analyser.fftSize = 256; // Will be reduced further in Lite mode

      // Connect the chain
      gain.connect(eqLow);
      eqLow.connect(eqMid);
      eqMid.connect(eqHigh);
      eqHigh.connect(analyser);
      analyser.connect(this.masterGain);

      // Connect FX sends
      if (this.reverbBus.convolver) {
        eqHigh.connect(reverbSend);
        reverbSend.connect(this.reverbBus.convolver);
      }

      if (this.delayBus.delay) {
        eqHigh.connect(delaySend);
        delaySend.connect(this.delayBus.delay);
      }

      this.stems.set(id, {
        buffer: audioBuffer,
        source: null,
        gain,
        eqLow,
        eqMid,
        eqHigh,
        reverbSend,
        delaySend,
        analyser,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(
            `Loading "${name}" timed out. Please check your internet connection.`
          );
        } else if (error.message.includes('decodeAudioData')) {
          throw new Error(
            `"${name}" contains unsupported audio format. Please use WAV, MP3, or AAC.`
          );
        } else if (error.message.includes('CORS')) {
          throw new Error(
            `Cannot load "${name}" due to CORS policy. Audio files must be served from the same domain.`
          );
        }
      }
      throw new Error(
        `Failed to load stem "${name}": ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  play(): void {
    if (!this._context) return;

    this.startTime = this._context.currentTime;

    this.stems.forEach((stemData, id) => {
      if (stemData.buffer) {
        stemData.source = this._context!.createBufferSource();
        stemData.source.buffer = stemData.buffer;
        stemData.source.connect(stemData.gain);
        stemData.source.start(this.startTime);
      }
    });
  }

  pause(): void {
    this.stems.forEach((stemData) => {
      if (stemData.source) {
        stemData.source.stop();
        stemData.source = null;
      }
    });
  }

  setStemVolume(id: string, volume: number): void {
    const stem = this.stems.get(id);
    if (stem) {
      stem.gain.gain.value = volume / 100;
    }
  }

  setStemMute(id: string, muted: boolean, volume: number = 75): void {
    const stem = this.stems.get(id);
    if (stem) {
      stem.gain.gain.value = muted ? 0 : (volume / 100);
    }
  }

  setStemSolo(stems: StemState[]): void {
    // Solo logic: if any stem is soloed, mute all others
    const soloedStems = stems.filter(s => s.solo);
    const hasSoloedStems = soloedStems.length > 0;
    
    stems.forEach(stem => {
      const audioStem = this.stems.get(stem.id);
      if (audioStem) {
        if (hasSoloedStems) {
          // If there are soloed stems, only unmute the soloed ones
          audioStem.gain.gain.value = stem.solo ? (stem.volume / 100) : 0;
        } else {
          // No stems are soloed, use normal mute/volume logic
          audioStem.gain.gain.value = stem.muted ? 0 : (stem.volume / 100);
        }
      }
    });
  }

  setStemEQ(id: string, band: 'low' | 'mid' | 'high', value: number): void {
    const stem = this.stems.get(id);
    if (!stem) return;

    const filter =
      band === 'low' ? stem.eqLow : band === 'mid' ? stem.eqMid : stem.eqHigh;

    filter.gain.value = value;
  }

  setStemFX(id: string, fx: 'reverb' | 'delay', value: number): void {
    const stem = this.stems.get(id);
    if (!stem) return;

    const send = fx === 'reverb' ? stem.reverbSend : stem.delaySend;
    send.gain.value = value / 100;
  }

  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = volume / 100;
    }
  }

  setMacroLPF(frequency: number): void {
    if (this.macroFilter) {
      // Exponential scaling from 20Hz to 20kHz
      const scaledFreq = 20 * Math.pow(1000, frequency / 100);
      this.macroFilter.frequency.value = Math.min(scaledFreq, 20000);

      // Couple with reverb - more filter = more reverb
      if (this.reverbBus.return) {
        const reverbAmount = Math.max(0, 1 - frequency / 100) * 0.5;
        this.reverbBus.return.gain.value = reverbAmount;
      }
    }
  }

  getCurrentTime(): number {
    if (!this._context || !this.startTime) return 0;
    return this._context.currentTime - this.startTime;
  }

  getAnalyserData(): Uint8Array | null {
    if (!this.analyser) return null;
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  getStemAnalyserData(id: string): Uint8Array | null {
    const stem = this.stems.get(id);
    if (!stem || !stem.analyser) return null;
    const bufferLength = stem.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    stem.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  setLiteMode(enabled: boolean): void {
    // Adjust FFT size for performance
    const fftSize = enabled ? 128 : 512;

    if (this.analyser) {
      this.analyser.fftSize = fftSize;
    }

    this.stems.forEach((stem) => {
      if (stem.analyser) {
        stem.analyser.fftSize = enabled ? 128 : 256;
      }

      // Disable FX in lite mode
      if (enabled) {
        stem.reverbSend.gain.value = 0;
        stem.delaySend.gain.value = 0;
      }
    });
  }

  dispose(): void {
    this.pause();
    if (this._context) {
      this._context.close();
    }
    this.stems.clear();
    this.isInitialized = false;
  }
}

const StemVisualizer: React.FC<StemVisualizerProps> = ({
  trackTitle,
  stemBasePath,
  bpm = 128,
  className = '',
}) => {
  const audioEngineRef = useRef<AudioEngine>(new AudioEngine());
  const animationFrameRef = useRef<number>();

  // Generate stems from standard file names
  const standardStems = [
    { name: 'Bass', file: `${stemBasePath}/bass.wav` },
    { name: 'Drums', file: `${stemBasePath}/drums.wav` },
    { name: 'FX & Vocals', file: `${stemBasePath}/fx-vocals.wav` },
    { name: 'Synths', file: `${stemBasePath}/synths.wav` },
  ];

  const [state, setState] = useState<AudioEngineState>({
    context: null,
    isPlaying: false,
    currentTime: 0,
    duration: 240, // Default 4 minutes
    stems: standardStems.map((stem, i) => ({
      id: `stem-${i}`,
      name: stem.name,
      volume: 75,
      muted: false,
      solo: false,
      eq: { low: 0, mid: 0, high: 0 },
      fx: { reverb: 0, delay: 0 },
    })),
    masterVolume: 75,
    macroLPF: 100,
    isLiteMode: false,
    isLoading: true,
    error: null,
  });

  const [visualizerData, setVisualizerData] = useState<{
    master: Uint8Array | null;
    stems: Map<string, Uint8Array | null>;
  }>({
    master: null,
    stems: new Map(),
  });

  // Detect mobile and auto-enable Lite mode
  useEffect(() => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    const isLowPowerDevice =
      navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

    if (isMobile || isLowPowerDevice) {
      setState((prev) => ({ ...prev, isLiteMode: true }));
    }
  }, []);

  // Initialize audio engine
  useEffect(() => {
    const initAudio = async () => {
      try {
        await audioEngineRef.current.initialize();

        // Load stems with individual error handling
        const loadedStems: string[] = [];
        const failedStems: string[] = [];

        const loadPromises = standardStems.map(async (stem, i) => {
          try {
            await audioEngineRef.current.loadStem(
              `stem-${i}`,
              stem.name,
              stem.file
            );
            loadedStems.push(stem.name);
          } catch (error) {
            console.error(`Failed to load ${stem.name}:`, error);
            failedStems.push(stem.name);
          }
        });

        await Promise.allSettled(loadPromises);

        if (loadedStems.length === 0) {
          throw new Error(
            'No audio stems could be loaded. Please check your internet connection and try again.'
          );
        }

        if (failedStems.length > 0) {
          const warningMsg = `Warning: ${failedStems.length} stem(s) failed to load: ${failedStems.join(', ')}. Playback will continue with available stems.`;
          console.warn(warningMsg);
        }

        setState((prev) => ({ ...prev, isLoading: false }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    };

    initAudio();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      audioEngineRef.current.dispose();
    };
  }, [stemBasePath]);

  // Animation loop for real-time updates
  useEffect(() => {
    const updateLoop = () => {
      if (state.isPlaying) {
        const currentTime = audioEngineRef.current.getCurrentTime();
        setState((prev) => ({ ...prev, currentTime }));

        // Update visualizer data
        const masterData = audioEngineRef.current.getAnalyserData();
        const stemDataMap = new Map<string, Uint8Array | null>();

        state.stems.forEach((stem) => {
          const stemAnalyzerData = audioEngineRef.current.getStemAnalyserData(
            stem.id
          );
          stemDataMap.set(stem.id, stemAnalyzerData);
        });

        setVisualizerData({
          master: masterData,
          stems: stemDataMap,
        });
      }
      animationFrameRef.current = requestAnimationFrame(updateLoop);
    };

    updateLoop();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isPlaying, state.stems]);

  const togglePlay = useCallback(async () => {
    if (state.isLoading || state.error) return;

    try {
      if (state.isPlaying) {
        audioEngineRef.current.pause();
        setState((prev) => ({ ...prev, isPlaying: false }));
      } else {
        // Resume audio context if suspended (common on mobile)
        const engine = audioEngineRef.current;
        if (engine.context && engine.context.state === 'suspended') {
          await engine.context.resume();
        }

        engine.play();
        setState((prev) => ({ ...prev, isPlaying: true }));
      }
    } catch (error) {
      console.error('Playback error:', error);
      setState((prev) => ({
        ...prev,
        error: `Playback failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }));
    }
  }, [state.isLoading, state.error, state.isPlaying]);

  const updateStem = useCallback((id: string, updates: Partial<StemState>) => {
    setState((prev) => {
      const newStems = prev.stems.map((stem) =>
        stem.id === id ? { ...stem, ...updates } : stem
      );

      // If solo state changed, update solo logic for all stems
      if (updates.solo !== undefined) {
        audioEngineRef.current.setStemSolo(newStems);
      } else {
        // Apply individual changes to audio engine
        if (updates.volume !== undefined) {
          audioEngineRef.current.setStemVolume(id, updates.volume);
        }
        if (updates.muted !== undefined) {
          // Find current stem volume for mute logic
          const currentStem = prev.stems.find(s => s.id === id);
          const currentVolume = currentStem ? currentStem.volume : 75;
          audioEngineRef.current.setStemMute(id, updates.muted, currentVolume);
        }
      }

      return {
        ...prev,
        stems: newStems,
      };
    });

    // Apply EQ and FX changes
    if (updates.eq) {
      Object.entries(updates.eq).forEach(([band, value]) => {
        audioEngineRef.current.setStemEQ(
          id,
          band as 'low' | 'mid' | 'high',
          value
        );
      });
    }
    if (updates.fx) {
      Object.entries(updates.fx).forEach(([fx, value]) => {
        audioEngineRef.current.setStemFX(id, fx as 'reverb' | 'delay', value);
      });
    }
  }, []);

  const setMasterVolume = useCallback((volume: number) => {
    setState((prev) => ({ ...prev, masterVolume: volume }));
    audioEngineRef.current.setMasterVolume(volume);
  }, []);

  const setMacroLPF = useCallback((value: number) => {
    setState((prev) => ({ ...prev, macroLPF: value }));
    audioEngineRef.current.setMacroLPF(value);
  }, []);

  const toggleLiteMode = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, isLiteMode: enabled }));
    audioEngineRef.current.setLiteMode(enabled);
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      // Only handle when visualizer is focused or contains the focused element
      const element = document.activeElement;
      const visualizerContainer = document.querySelector(
        '[data-visualizer="stem-player"]'
      );
      if (!visualizerContainer || !visualizerContainer.contains(element)) {
        return;
      }

      switch (event.key) {
        case ' ':
          event.preventDefault();
          togglePlay();
          break;
        case 'l':
          event.preventDefault();
          toggleLiteMode(!state.isLiteMode);
          break;
        case 'ArrowUp':
          event.preventDefault();
          setMasterVolume(Math.min(100, state.masterVolume + 5));
          break;
        case 'ArrowDown':
          event.preventDefault();
          setMasterVolume(Math.max(0, state.masterVolume - 5));
          break;
        case 'ArrowLeft':
          event.preventDefault();
          setMacroLPF(Math.max(0, state.macroLPF - 5));
          break;
        case 'ArrowRight':
          event.preventDefault();
          setMacroLPF(Math.min(100, state.macroLPF + 5));
          break;
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [
    togglePlay,
    toggleLiteMode,
    state.isLiteMode,
    state.masterVolume,
    state.macroLPF,
    setMasterVolume,
    setMacroLPF,
  ]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const retryLoading = useCallback(() => {
    setState((prev) => ({ ...prev, error: null, isLoading: true }));
    // Force re-initialization by changing the dependency
    window.location.reload();
  }, []);

  if (state.error) {
    const isBrowserSupport = state.error.includes(
      'Web Audio API is not supported'
    );

    return (
      <div
        className={`bg-gray-900 rounded-lg border border-red-500 p-6 ${className}`}
      >
        <div className="text-center">
          <div className="text-red-400 mb-2">⚠️ Audio Error</div>
          <div className="text-white text-sm mb-4">{state.error}</div>

          {!isBrowserSupport && (
            <button
              onClick={retryLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors mb-3"
            >
              Try Again
            </button>
          )}

          <div className="text-gray-400 text-xs">
            {isBrowserSupport
              ? 'Please use a modern browser (Chrome 66+, Firefox 60+, Safari 14.1+) to use the interactive player.'
              : 'Check your internet connection and audio file accessibility.'}
          </div>
        </div>
      </div>
    );
  }

  if (state.isLoading) {
    return (
      <div
        className={`bg-gray-900 rounded-lg border border-gray-700 p-6 ${className}`}
      >
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-white mb-2">Loading Audio Engine...</div>
          <div className="text-gray-400 text-sm">
            Decoding audio files and initializing Web Audio API
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gray-900 rounded-lg border border-gray-700 ${className}`}
      data-visualizer="stem-player"
      role="application"
      aria-label={`Interactive stem player for ${trackTitle}`}
      tabIndex={0}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{trackTitle}</h3>
            <p className="text-sm text-gray-400">
              {bpm} BPM • {formatTime(state.duration)}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <label className="flex items-center text-sm text-gray-300">
              <input
                type="checkbox"
                checked={state.isLiteMode}
                onChange={(e) => toggleLiteMode(e.target.checked)}
                className="mr-2"
                aria-describedby="lite-mode-desc"
              />
              Lite Mode{' '}
              {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
              ) && '(Auto)'}
              <span id="lite-mode-desc" className="sr-only">
                Reduces CPU usage by disabling effects and lowering
                visualization quality
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="p-4 border-b border-gray-700">
        <div
          className={`flex items-center ${state.isLiteMode ? 'flex-col space-y-4' : 'space-x-4'}`}
        >
          <button
            onClick={togglePlay}
            disabled={state.isLoading}
            className="w-12 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full text-white transition-colors"
            aria-label={state.isPlaying ? 'Pause' : 'Play'}
          >
            {state.isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 4a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1zM14 4a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 ml-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a.5.5 0 01.8-.4l9.466 5.545a.5.5 0 010 .8L7.067 16.945a.5.5 0 01-.8-.4V3.455z"
                />
              </svg>
            )}
          </button>

          <div
            className="flex-1"
            role="progressbar"
            aria-label="Track progress"
            aria-valuenow={state.currentTime}
            aria-valuemin={0}
            aria-valuemax={state.duration}
          >
            <div className="relative">
              <div className="w-full bg-gray-700 rounded h-2">
                <div
                  className="bg-blue-600 h-2 rounded transition-all duration-100"
                  style={{
                    width: `${(state.currentTime / state.duration) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span
                  aria-label={`Current time: ${formatTime(state.currentTime)}`}
                >
                  {formatTime(state.currentTime)}
                </span>
                <span
                  aria-label={`Total duration: ${formatTime(state.duration)}`}
                >
                  {formatTime(state.duration)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="master-volume" className="text-sm text-gray-400">
              Master
            </label>
            <input
              id="master-volume"
              type="range"
              min="0"
              max="100"
              value={state.masterVolume}
              onChange={(e) => setMasterVolume(parseInt(e.target.value))}
              className="w-20"
              aria-label={`Master volume: ${state.masterVolume}%`}
            />
            <span className="text-sm text-gray-300 w-8" aria-hidden="true">
              {state.masterVolume}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="macro-lpf" className="text-sm text-gray-400">
              LPF
            </label>
            <input
              id="macro-lpf"
              type="range"
              min="0"
              max="100"
              value={state.macroLPF}
              onChange={(e) => setMacroLPF(parseInt(e.target.value))}
              className="w-20"
              aria-label={`Low-pass filter frequency: ${state.macroLPF}%`}
              aria-describedby="lpf-desc"
            />
            <span className="text-sm text-gray-300 w-8" aria-hidden="true">
              {state.macroLPF}
            </span>
            <span id="lpf-desc" className="sr-only">
              Controls overall brightness of the mix. Lower values create warmer
              sound.
            </span>
          </div>
        </div>
      </div>

      {/* Stem Controls */}
      <div className="p-4">
        <div
          className={`grid gap-4 ${state.isLiteMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}
        >
          {state.stems.map((stem) => (
            <div
              key={stem.id}
              className="bg-gray-800 rounded-lg p-4"
              role="group"
              aria-labelledby={`${stem.id}-title`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 id={`${stem.id}-title`} className="font-medium text-white">
                  {stem.name}
                </h4>
                <div
                  className="flex space-x-1"
                  role="group"
                  aria-label={`${stem.name} playback controls`}
                >
                  <button
                    onClick={() => updateStem(stem.id, { muted: !stem.muted })}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      stem.muted
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                    }`}
                    aria-pressed={stem.muted}
                    aria-label={`${stem.muted ? 'Unmute' : 'Mute'} ${stem.name}`}
                  >
                    MUTE
                  </button>
                  <button
                    onClick={() => updateStem(stem.id, { solo: !stem.solo })}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      stem.solo
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                    }`}
                    aria-pressed={stem.solo}
                    aria-label={`${stem.solo ? 'Unsolo' : 'Solo'} ${stem.name}`}
                  >
                    SOLO
                  </button>
                </div>
              </div>

              {/* Volume */}
              <div className="mb-3">
                <div
                  className={`flex items-center space-x-2 mb-1 ${state.isLiteMode ? 'flex-col space-y-2 space-x-0' : ''}`}
                >
                  <label
                    htmlFor={`${stem.id}-volume`}
                    className="text-xs text-gray-400 w-12"
                  >
                    VOL
                  </label>
                  <input
                    id={`${stem.id}-volume`}
                    type="range"
                    min="0"
                    max="100"
                    value={stem.volume}
                    onChange={(e) =>
                      updateStem(stem.id, { volume: parseInt(e.target.value) })
                    }
                    className={`${state.isLiteMode ? 'w-full' : 'flex-1'}`}
                    disabled={stem.muted}
                    style={{ minHeight: state.isLiteMode ? '30px' : 'auto' }}
                    aria-label={`${stem.name} volume: ${stem.volume}%`}
                  />
                  <span
                    className="text-xs text-gray-300 w-8"
                    aria-hidden="true"
                  >
                    {stem.volume}
                  </span>
                </div>
              </div>

              {/* EQ */}
              <div
                className="mb-3"
                role="group"
                aria-labelledby={`${stem.id}-eq-title`}
              >
                <div
                  id={`${stem.id}-eq-title`}
                  className="text-xs text-gray-400 mb-2"
                >
                  EQ
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'mid', 'high'] as const).map((band) => (
                    <div key={band} className="text-center">
                      <label
                        htmlFor={`${stem.id}-eq-${band}`}
                        className="text-xs text-gray-400 mb-1 block"
                      >
                        {band.toUpperCase()}
                      </label>
                      <input
                        id={`${stem.id}-eq-${band}`}
                        type="range"
                        min="-12"
                        max="12"
                        value={stem.eq[band]}
                        onChange={(e) =>
                          updateStem(stem.id, {
                            eq: {
                              ...stem.eq,
                              [band]: parseInt(e.target.value),
                            },
                          })
                        }
                        className="w-full"
                        disabled={stem.muted}
                        aria-label={`${stem.name} ${band} EQ: ${stem.eq[band]}dB`}
                      />
                      <div className="text-xs text-gray-300" aria-hidden="true">
                        {stem.eq[band]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FX (disabled in lite mode) */}
              {!state.isLiteMode && (
                <div role="group" aria-labelledby={`${stem.id}-fx-title`}>
                  <div
                    id={`${stem.id}-fx-title`}
                    className="text-xs text-gray-400 mb-2"
                  >
                    FX SENDS
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(['reverb', 'delay'] as const).map((fx) => (
                      <div key={fx} className="text-center">
                        <label
                          htmlFor={`${stem.id}-fx-${fx}`}
                          className="text-xs text-gray-400 mb-1 block"
                        >
                          {fx.toUpperCase()}
                        </label>
                        <input
                          id={`${stem.id}-fx-${fx}`}
                          type="range"
                          min="0"
                          max="100"
                          value={stem.fx[fx]}
                          onChange={(e) =>
                            updateStem(stem.id, {
                              fx: {
                                ...stem.fx,
                                [fx]: parseInt(e.target.value),
                              },
                            })
                          }
                          className="w-full"
                          disabled={stem.muted}
                          aria-label={`${stem.name} ${fx} send: ${stem.fx[fx]}%`}
                        />
                        <div
                          className="text-xs text-gray-300"
                          aria-hidden="true"
                        >
                          {stem.fx[fx]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stem Level Meter */}
              <div className="mt-3 flex justify-center">
                <LevelMeter
                  analyserData={visualizerData.stems.get(stem.id) || null}
                  width={12}
                  height={60}
                  orientation="vertical"
                  label={stem.name.substring(0, 4)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Master Spectrum Analyzer */}
      {!state.isLiteMode && (
        <div className="px-4 pb-4">
          <SpectrumAnalyzer
            analyserData={visualizerData.master}
            width={400}
            height={100}
            isLiteMode={state.isLiteMode}
            className="w-full"
          />
        </div>
      )}

      {/* Help Text */}
      <div className="px-4 py-2 border-t border-gray-700 bg-gray-800">
        <details className="text-xs text-gray-400">
          <summary className="cursor-pointer hover:text-gray-300 mb-1">
            Keyboard Shortcuts
          </summary>
          <div className="mt-2 space-y-1">
            <div>
              <kbd className="px-1 bg-gray-700 rounded text-xs">Space</kbd>{' '}
              Play/Pause
            </div>
            <div>
              <kbd className="px-1 bg-gray-700 rounded text-xs">L</kbd> Toggle
              Lite Mode
            </div>
            <div>
              <kbd className="px-1 bg-gray-700 rounded text-xs">↑↓</kbd> Master
              Volume
            </div>
            <div>
              <kbd className="px-1 bg-gray-700 rounded text-xs">←→</kbd> LPF
              Frequency
            </div>
            <div className="text-gray-500 mt-2">
              Focus the player above to use keyboard shortcuts
            </div>
          </div>
        </details>
      </div>

      {/* Status */}
      <div className="px-4 py-2 bg-gray-800 rounded-b-lg border-t border-gray-700">
        <div className="text-xs text-gray-400 text-center">
          {state.isPlaying ? '🎵 Playing' : '⏸️ Paused'} •
          {state.isLiteMode ? ' Lite Mode' : ' Full Mode'} • Real-time Web Audio
          API stem player
        </div>
      </div>
    </div>
  );
};

export default StemVisualizer;
