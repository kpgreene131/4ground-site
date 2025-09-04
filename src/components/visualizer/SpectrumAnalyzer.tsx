import { useEffect, useRef } from 'react';

interface SpectrumAnalyzerProps {
  analyserData: Uint8Array | null;
  width?: number;
  height?: number;
  className?: string;
  isLiteMode?: boolean;
}

const SpectrumAnalyzer: React.FC<SpectrumAnalyzerProps> = ({
  analyserData,
  width = 400,
  height = 120,
  className = '',
  isLiteMode = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (!analyserData) {
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      const bufferLength = analyserData.length;
      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      // Create gradient for bars
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, '#10B981'); // Green at bottom
      gradient.addColorStop(0.5, '#F59E0B'); // Yellow in middle
      gradient.addColorStop(1, '#EF4444'); // Red at top

      ctx.fillStyle = gradient;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (analyserData[i] / 255) * height * 0.8;

        // Draw frequency bar
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        // Add subtle outline in lite mode for better visibility
        if (isLiteMode) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, height - barHeight, barWidth, barHeight);
        }

        x += barWidth + 1;
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyserData, width, height, isLiteMode]);

  return (
    <div className={`bg-black rounded border border-gray-700 ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      <div className="px-2 py-1 text-xs text-gray-400 border-t border-gray-700">
        Spectrum Analyzer {isLiteMode ? '(Lite)' : ''}
      </div>
    </div>
  );
};

export default SpectrumAnalyzer;
