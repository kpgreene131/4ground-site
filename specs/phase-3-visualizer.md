# Phase 3: Interactive Stem Visualizer MVP

## Objective
Build a fully functional stem visualizer with EQ/FX processing, beat-synced controls, and mobile optimization. Replace the placeholder component with a real Web Audio API implementation capable of loading and mixing individual track stems.

## Duration
7-10 days

## Technical Overview

### Web Audio API Architecture
```
AudioContext
├── Master Output
│   ├── Master Gain Node
│   ├── Master Compressor (optional)
│   └── Destination
├── Per-Stem Chains (4x)
│   ├── Source: AudioBufferSourceNode
│   ├── Gain: GainNode (volume control)
│   ├── EQ Chain: 3x BiquadFilterNode
│   │   ├── Low: highpass + peaking
│   │   ├── Mid: peaking
│   │   └── High: peaking + lowpass
│   ├── FX Sends
│   │   ├── Reverb Send: GainNode → Reverb Bus
│   │   └── Delay Send: GainNode → Delay Bus
│   └── Dry Signal: Direct to Master
├── FX Buses
│   ├── Reverb Bus
│   │   ├── ConvolverNode (impulse response)
│   │   ├── Feedback: DelayNode + GainNode
│   │   └── Return: GainNode → Master
│   └── Delay Bus
│       ├── DelayNode (configurable time)
│       ├── Feedback: GainNode
│       ├── Filter: BiquadFilterNode
│       └── Return: GainNode → Master
└── Analysis
    ├── AnalyserNode per stem
    └── Master AnalyserNode for visualization
```

## Core Features

### Stem Control
- **Per-stem playback**: Individual mute, solo, gain control
- **Perfect sync**: All stems start/stop together using AudioContext scheduling
- **Crossfading**: Smooth transitions for mute/unmute operations
- **Gain staging**: Proper headroom management (-6dB default per stem)

### 3-Band EQ per Stem
```javascript
// EQ Configuration
const EQ_BANDS = {
  low: {
    type: 'peaking',
    frequency: 100,
    gain: 0,     // -12dB to +12dB
    Q: 0.7
  },
  mid: {
    type: 'peaking', 
    frequency: 1000,
    gain: 0,
    Q: 0.7
  },
  high: {
    type: 'peaking',
    frequency: 8000, 
    gain: 0,
    Q: 0.7
  }
};
```

### Macro LPF Sweep
- **Filter**: 24dB/octave lowpass filter on master bus
- **Frequency range**: 20Hz - 20kHz with exponential scaling
- **Automation**: Beat-synced parameter changes (quantized to 1/8 notes)
- **FX coupling**: LPF position controls reverb send amount (more filter = more reverb)

### FX Processing

#### Reverb Bus
- **Algorithm**: Convolution reverb with procedural impulse response
- **Parameters**: Size (0.1s - 4s decay), dampening, pre-delay
- **Send amount**: 0-100% per stem
- **CPU optimization**: Single shared reverb for all stems

#### Delay Bus  
- **Type**: Stereo ping-pong delay
- **Time**: Synced to BPM (1/4, 1/8, 1/16 note values)
- **Feedback**: 0-90% with high-frequency dampening
- **Send amount**: 0-100% per stem

### Beat Synchronization
- **Tempo**: Extract BPM from track metadata or default to 128 BPM
- **Quantization**: Control changes snap to 1/8 note grid
- **Scheduling**: Use AudioContext.currentTime for precise timing
- **Visual feedback**: Metronome indicator for timing reference

### Visualization
- **Spectrum analyzer**: Real-time FFT display per stem + master
- **Waveform**: Static waveform display with playback position
- **Level meters**: Per-stem and master peak/RMS metering
- **EQ curve**: Visual EQ response curve overlay

## Mobile Optimization (Lite Mode)

### Performance Constraints
- **Target devices**: Mid-tier Android (Snapdragon 660), iPhone 8
- **CPU budget**: <60% average usage during playback
- **Memory budget**: <100MB total JavaScript heap
- **Battery**: Minimize wake locks, reduce processing when backgrounded

### Lite Mode Differences
- **FX disabled**: No reverb/delay processing
- **Reduced FFT size**: 512 → 256 bins for visualization  
- **Simplified EQ**: Single peaking filter per band instead of complex chains
- **Lower sample rate**: 44.1kHz → 22kHz for visualization only
- **Reduced UI**: Sliders instead of knobs, simplified layout

### Touch Interface
- **Gesture support**: Pinch-to-zoom on waveform, swipe for navigation
- **Touch targets**: Minimum 44px with adequate spacing
- **Haptic feedback**: Subtle vibration on control interaction (if supported)
- **Portrait mode**: Vertical slider layout for compact screens

## Audio File Handling

### Supported Formats
- **Primary**: WAV (uncompressed, 44.1kHz+)
- **Fallback**: MP3 320kbps, AAC 256kbps
- **Compression**: Optional OGG Vorbis for smaller file sizes

### Loading Strategy
```javascript
// Parallel loading with progress tracking
const loadStems = async (trackData) => {
  const stemPromises = trackData.stems.map(async (stem, index) => {
    const response = await fetch(stem.file);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return { index, name: stem.name, buffer: audioBuffer };
  });
  
  return Promise.all(stemPromises);
};
```

### Error Handling
- **Network failures**: Retry with exponential backoff
- **Decode failures**: Fall back to mixed track playback
- **Missing files**: Show clear error message, disable stem controls
- **Browser compatibility**: Graceful degradation for unsupported formats

### Caching Strategy
- **Browser cache**: Set proper cache headers for audio files
- **Service worker**: Cache stems for offline playback (optional)
- **IndexedDB**: Store decoded AudioBuffers for faster subsequent loads

## User Interface Design

### Desktop Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Track Info + Transport Controls                             │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ │  Stem 1  │ │  Stem 2  │ │  Stem 3  │ │  Stem 4  │        │
│ │ ┌─────┐  │ │ ┌─────┐  │ │ ┌─────┐  │ │ ┌─────┐  │        │
│ │ │ EQ  │  │ │ │ EQ  │  │ │ │ EQ  │  │ │ │ EQ  │  │        │
│ │ └─────┘  │ │ └─────┘  │ │ └─────┘  │ │ └─────┘  │        │
│ │ Volume   │ │ Volume   │ │ Volume   │ │ Volume   │        │
│ │ FX Sends │ │ FX Sends │ │ FX Sends │ │ FX Sends │        │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
├─────────────────────────────────────────────────────────────┤
│ Master Section + Macro Controls                             │
├─────────────────────────────────────────────────────────────┤
│ Spectrum Analyzer / Waveform Display                       │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Layout (Portrait)
```
┌───────────────────────────────────┐
│ Track Info + Transport            │
├───────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │      Stem 1 Controls            │ │
│ │ [MUTE] [SOLO] Volume: ████▓▓▓   │ │
│ │ EQ: L██▓ M███▓ H█▓▓▓            │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │      Stem 2 Controls            │ │
│ └─────────────────────────────────┘ │
│ ... (repeat for all stems)         │
├───────────────────────────────────┤
│ Master Volume + Macro LPF         │
├───────────────────────────────────┤
│ Simplified Visualization          │
└───────────────────────────────────┘
```

### Control Specifications
- **Knobs**: Circular drag gesture, scroll wheel support, double-click to reset
- **Sliders**: Horizontal for desktop, vertical for mobile
- **Buttons**: Clear on/off states with visual feedback
- **Meters**: Peak hold with decay, clip indicators

## Performance Requirements

### CPU Benchmarks
- **Desktop Chrome**: <30% CPU usage during full playback with FX
- **Mobile Safari**: <60% CPU usage in Lite mode
- **Audio dropouts**: Zero tolerance - implement buffer monitoring
- **UI responsiveness**: 60fps during visualization, 30fps minimum on mobile

### Memory Management
- **AudioBuffer cleanup**: Dispose unused buffers promptly
- **Visualization buffers**: Reuse typed arrays, avoid allocations in render loop
- **Garbage collection**: Minimize object creation during audio callbacks

### Network Optimization
- **Compression**: Use appropriate codec for quality/size balance
- **Progressive loading**: Start playback while remaining stems load
- **CDN integration**: Serve from geographically distributed edge locations

## Browser Compatibility

### Tier 1 Support (Full Features)
- **Chrome 66+**: Full Web Audio API support, SharedArrayBuffer
- **Firefox 60+**: Complete feature support
- **Safari 14.1+**: iOS Web Audio limitations handled gracefully

### Tier 2 Support (Lite Mode Only)
- **Safari 13**: No SharedArrayBuffer, reduced concurrent streams
- **Chrome Android 66+**: Mobile-optimized experience
- **Edge 79+**: Chromium-based, full support expected

### Fallback Strategy
- **No Web Audio API**: Display static waveform, external player links
- **Limited memory**: Automatically enable Lite mode
- **Slow connection**: Progressive loading with quality adaptation

## Security Considerations

### CORS Configuration
```javascript
// Audio file requests must include proper headers
const loadAudio = (url) => {
  return fetch(url, {
    mode: 'cors',
    credentials: 'omit'
  });
};
```

### Content Security Policy
```
default-src 'self';
connect-src 'self' https://*.r2.dev;
media-src 'self' https://*.r2.dev;
script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval';
```

## Acceptance Criteria

### Core Functionality
- [ ] All 4 stems load and play in perfect synchronization
- [ ] Individual stem mute/solo/gain controls work smoothly
- [ ] 3-band EQ per stem provides audible frequency shaping
- [ ] Macro LPF sweep affects master output with beat-sync quantization
- [ ] Reverb and delay sends work per stem with proper mixing
- [ ] Beat synchronization maintains timing throughout playback

### User Experience
- [ ] Play/pause/seek controls respond immediately
- [ ] All knobs and sliders provide smooth, responsive control
- [ ] Visual feedback matches audio processing (meters, spectrum)
- [ ] Lite mode toggle works without interrupting playback
- [ ] Error states are clearly communicated to user

### Performance
- [ ] CPU usage stays within budget on target devices
- [ ] Memory usage remains stable during extended playback
- [ ] No audio dropouts or glitches during processing
- [ ] UI maintains target framerate during visualization
- [ ] Battery usage is reasonable on mobile devices

### Compatibility
- [ ] Works in iOS Safari with touch controls
- [ ] Functions properly in Android Chrome
- [ ] Desktop browsers support full feature set
- [ ] Graceful degradation when features unavailable
- [ ] CORS headers allow audio loading from CDN

### Accessibility
- [ ] Keyboard navigation works for all controls
- [ ] Screen readers can access transport controls
- [ ] Focus indicators are visible and logical
- [ ] Color is not sole indicator of state
- [ ] Touch targets meet minimum size requirements

## Definition of Done

### Code Quality
- [ ] TypeScript strict mode with no `any` types
- [ ] Comprehensive error handling for all audio operations
- [ ] Unit tests for audio processing utilities
- [ ] Performance monitoring and logging implemented
- [ ] Code documentation covers Web Audio API usage

### Testing
- [ ] Manual testing on all Tier 1 browsers
- [ ] Performance testing on target mobile devices
- [ ] Accessibility audit with screen reader testing
- [ ] Load testing with various file sizes and formats
- [ ] Network failure scenarios tested and handled

### Integration
- [ ] Component integrates cleanly with existing Astro pages
- [ ] Audio files load from configured CDN location
- [ ] Fallback behavior works when audio unavailable
- [ ] Analytics events track user engagement with features
- [ ] Error reporting captures audio-specific issues

## Implementation Phases

### Phase 3.1: Core Audio Engine (3 days)
- Web Audio API context setup and lifecycle management
- Stem loading, decoding, and synchronized playback
- Basic gain control and mute/solo functionality
- Error handling and fallback to mixed track

### Phase 3.2: EQ and FX Processing (2-3 days)  
- 3-band EQ implementation per stem
- Reverb and delay bus architecture
- Macro LPF with beat-sync quantization
- FX send amount controls

### Phase 3.3: User Interface (2-3 days)
- Control components (knobs, sliders, buttons)
- Real-time visualization (spectrum, meters)
- Responsive layout for desktop and mobile
- Lite mode toggle and mobile optimization

### Phase 3.4: Polish and Testing (1-2 days)
- Cross-browser compatibility testing
- Performance optimization and profiling
- Accessibility implementation and testing
- Integration with release page and labs section

## Risk Mitigation

### Audio Performance Issues
- **Risk**: Audio dropouts due to CPU overload
- **Mitigation**: Implement CPU monitoring, automatic Lite mode fallback
- **Testing**: Stress test on minimum spec devices

### Browser Compatibility
- **Risk**: Web Audio API differences between browsers
- **Mitigation**: Abstract audio engine behind interface, test extensively
- **Fallback**: Static player with external links if Web Audio unavailable

### File Size and Loading
- **Risk**: Large stem files cause slow loading times
- **Mitigation**: Implement progressive loading, compression optimization
- **UX**: Loading states and progress indicators

### Mobile Performance
- **Risk**: Poor performance on older mobile devices
- **Mitigation**: Aggressive Lite mode, CPU/memory monitoring
- **Testing**: Test on 3-year-old Android and iOS devices