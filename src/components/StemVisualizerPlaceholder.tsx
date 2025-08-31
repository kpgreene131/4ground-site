import { useState, useEffect } from 'react';

interface StemVisualizerPlaceholderProps {
  trackTitle: string;
  stemCount: number;
  bpm?: number;
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

const StemVisualizerPlaceholder: React.FC<StemVisualizerPlaceholderProps> = ({ 
  trackTitle, 
  stemCount, 
  bpm = 128 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(240); // 4 minutes
  const [isLiteMode, setIsLiteMode] = useState(false);
  const [masterVolume, setMasterVolume] = useState(75);

  const [stems, setStems] = useState<StemState[]>(() => {
    const stemNames = ['Kick & Bass', 'Percussion', 'Synths', 'FX & Vocals'];
    return Array.from({ length: stemCount }, (_, i) => ({
      id: `stem-${i}`,
      name: stemNames[i] || `Stem ${i + 1}`,
      volume: 75,
      muted: false,
      solo: false,
      eq: { low: 0, mid: 0, high: 0 },
      fx: { reverb: 0, delay: 0 }
    }));
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 1;
          return next >= duration ? 0 : next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const updateStem = (id: string, updates: Partial<StemState>) => {
    setStems(stems.map(stem => 
      stem.id === id ? { ...stem, ...updates } : stem
    ));
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const resetAll = () => {
    setStems(stems.map(stem => ({
      ...stem,
      volume: 75,
      muted: false,
      solo: false,
      eq: { low: 0, mid: 0, high: 0 },
      fx: { reverb: 0, delay: 0 }
    })));
    setMasterVolume(75);
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{trackTitle}</h3>
            <p className="text-sm text-gray-400">{bpm} BPM • {formatTime(duration)}</p>
          </div>
          <div className="flex items-center space-x-3">
            <label className="flex items-center text-sm text-gray-300">
              <input 
                type="checkbox" 
                checked={isLiteMode}
                onChange={(e) => setIsLiteMode(e.target.checked)}
                className="mr-2"
              />
              Lite Mode
            </label>
            <button 
              onClick={resetAll}
              className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 4a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1zM14 4a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a.5.5 0 01.8-.4l9.466 5.545a.5.5 0 010 .8L7.067 16.945a.5.5 0 01-.8-.4V3.455z" />
              </svg>
            )}
          </button>
          
          <div className="flex-1">
            <div className="relative">
              <div className="w-full bg-gray-700 rounded h-2">
                <div 
                  className="bg-blue-600 h-2 rounded transition-all duration-1000"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Master</span>
            <input 
              type="range"
              min="0"
              max="100"
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseInt(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-gray-300 w-8">{masterVolume}</span>
          </div>
        </div>
      </div>

      {/* Stem Controls */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stems.map(stem => (
            <div key={stem.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white">{stem.name}</h4>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => updateStem(stem.id, { muted: !stem.muted })}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      stem.muted ? 'bg-red-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                    }`}
                  >
                    MUTE
                  </button>
                  <button 
                    onClick={() => updateStem(stem.id, { solo: !stem.solo })}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      stem.solo ? 'bg-yellow-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                    }`}
                  >
                    SOLO
                  </button>
                </div>
              </div>

              {/* Volume */}
              <div className="mb-3">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs text-gray-400 w-12">VOL</span>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={stem.volume}
                    onChange={(e) => updateStem(stem.id, { volume: parseInt(e.target.value) })}
                    className="flex-1"
                    disabled={stem.muted}
                  />
                  <span className="text-xs text-gray-300 w-8">{stem.volume}</span>
                </div>
              </div>

              {/* EQ */}
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-2">EQ</div>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'mid', 'high'] as const).map(band => (
                    <div key={band} className="text-center">
                      <div className="text-xs text-gray-400 mb-1">{band.toUpperCase()}</div>
                      <input 
                        type="range"
                        min="-12"
                        max="12"
                        value={stem.eq[band]}
                        onChange={(e) => updateStem(stem.id, { 
                          eq: { ...stem.eq, [band]: parseInt(e.target.value) }
                        })}
                        className="w-full"
                        disabled={stem.muted}
                      />
                      <div className="text-xs text-gray-300">{stem.eq[band]}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FX (disabled in lite mode) */}
              {!isLiteMode && (
                <div>
                  <div className="text-xs text-gray-400 mb-2">FX SENDS</div>
                  <div className="grid grid-cols-2 gap-2">
                    {(['reverb', 'delay'] as const).map(fx => (
                      <div key={fx} className="text-center">
                        <div className="text-xs text-gray-400 mb-1">{fx.toUpperCase()}</div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={stem.fx[fx]}
                          onChange={(e) => updateStem(stem.id, { 
                            fx: { ...stem.fx, [fx]: parseInt(e.target.value) }
                          })}
                          className="w-full"
                          disabled={stem.muted}
                        />
                        <div className="text-xs text-gray-300">{stem.fx[fx]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="px-4 py-2 bg-gray-800 rounded-b-lg border-t border-gray-700">
        <div className="text-xs text-gray-400 text-center">
          {isPlaying ? '🎵 Playing' : '⏸️ Paused'} • 
          {isLiteMode ? ' Lite Mode' : ' Full Mode'} • 
          Interactive stem player demo
        </div>
      </div>
    </div>
  );
};

export default StemVisualizerPlaceholder;