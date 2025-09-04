import { useEffect, useRef, useState } from 'react';

interface LevelMeterProps {
  analyserData: Uint8Array | null;
  width?: number;
  height?: number;
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  className?: string;
}

const LevelMeter: React.FC<LevelMeterProps> = ({
  analyserData,
  width = 20,
  height = 100,
  orientation = 'vertical',
  label = '',
  className = '',
}) => {
  const [level, setLevel] = useState(0);
  const [peak, setPeak] = useState(0);
  const peakHoldRef = useRef(0);
  const peakTimeRef = useRef(0);

  useEffect(() => {
    if (!analyserData) return;

    // Calculate RMS and peak levels
    let sum = 0;
    let max = 0;

    for (let i = 0; i < analyserData.length; i++) {
      const value = analyserData[i] / 255;
      sum += value * value;
      max = Math.max(max, value);
    }

    const rms = Math.sqrt(sum / analyserData.length);
    setLevel(rms);

    // Peak hold logic
    const now = Date.now();
    if (max > peakHoldRef.current || now - peakTimeRef.current > 1000) {
      peakHoldRef.current = max;
      peakTimeRef.current = now;
      setPeak(max);
    }
  }, [analyserData]);

  const getLevelColor = (level: number) => {
    if (level > 0.8) return '#EF4444'; // Red - clipping
    if (level > 0.6) return '#F59E0B'; // Yellow - hot
    return '#10B981'; // Green - safe
  };

  const meterStyle =
    orientation === 'vertical'
      ? { width: `${width}px`, height: `${height}px` }
      : { width: `${height}px`, height: `${width}px` };

  const levelBarStyle =
    orientation === 'vertical'
      ? {
          width: '100%',
          height: `${level * 100}%`,
          bottom: 0,
        }
      : {
          width: `${level * 100}%`,
          height: '100%',
          left: 0,
        };

  const peakBarStyle =
    orientation === 'vertical'
      ? {
          width: '100%',
          height: '2px',
          bottom: `${peak * 100}%`,
          transform: 'translateY(1px)',
        }
      : {
          width: '2px',
          height: '100%',
          left: `${peak * 100}%`,
          transform: 'translateX(-1px)',
        };

  return (
    <div
      className={`flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row'} items-center gap-1 ${className}`}
    >
      {label && (
        <div
          className={`text-xs text-gray-400 ${orientation === 'vertical' ? 'mb-1' : 'mr-1'}`}
        >
          {label}
        </div>
      )}

      <div
        className="relative bg-gray-800 border border-gray-600 rounded-sm overflow-hidden"
        style={meterStyle}
      >
        {/* Background tick marks */}
        <div className="absolute inset-0">
          {[0.2, 0.4, 0.6, 0.8].map((tick, i) => (
            <div
              key={i}
              className="absolute bg-gray-600"
              style={
                orientation === 'vertical'
                  ? {
                      bottom: `${tick * 100}%`,
                      left: '0',
                      right: '0',
                      height: '1px',
                    }
                  : {
                      left: `${tick * 100}%`,
                      top: '0',
                      bottom: '0',
                      width: '1px',
                    }
              }
            />
          ))}
        </div>

        {/* Level bar */}
        <div
          className="absolute transition-all duration-100 ease-out"
          style={{
            ...levelBarStyle,
            backgroundColor: getLevelColor(level),
          }}
        />

        {/* Peak indicator */}
        <div className="absolute bg-white" style={peakBarStyle} />
      </div>

      {/* Level text */}
      <div
        className={`text-xs font-mono text-gray-300 ${orientation === 'vertical' ? 'mt-1' : 'ml-1'}`}
      >
        {Math.round(level * 100)}
      </div>
    </div>
  );
};

export default LevelMeter;
