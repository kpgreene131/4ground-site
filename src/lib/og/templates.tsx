import React from 'react';

// Base styles that work well with @vercel/og
const baseStyles = {
  background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
  color: '#ffffff',
  fontFamily: 'Inter, system-ui, sans-serif',
};

const brandColors = {
  primary: '#00ff88',
  secondary: '#ff6b35',
  accent: '#8b5cf6',
  text: {
    primary: '#ffffff',
    secondary: '#a1a1aa',
    tertiary: '#71717a',
  },
};

// Release OG Image Template
export function ReleaseOGTemplate({
  title,
  bpm,
  key,
  releaseDate,
  coverImageUrl,
}: {
  title: string;
  bpm: number;
  key: string;
  releaseDate: string;
  coverImageUrl?: string;
}) {
  const formattedDate = new Date(releaseDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      style={{
        display: 'flex',
        width: '1200px',
        height: '630px',
        ...baseStyles,
        padding: '60px',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Left Side - Text Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          marginRight: '60px',
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: brandColors.primary,
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            4ground
          </div>
          <div
            style={{
              marginLeft: '20px',
              fontSize: '18px',
              color: brandColors.text.tertiary,
            }}
          >
            New Release
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            lineHeight: '1.1',
            marginBottom: '30px',
            background: `linear-gradient(45deg, ${brandColors.primary}, ${brandColors.secondary})`,
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {title}
        </h1>

        {/* Metadata */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            fontSize: '20px',
            color: brandColors.text.secondary,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span>🎵 {bpm} BPM</span>
            <span>🎹 {key}</span>
          </div>
          <div>📅 {formattedDate}</div>
        </div>

        {/* Interactive Element Indicator */}
        <div
          style={{
            marginTop: '40px',
            padding: '15px 25px',
            background: 'rgba(0, 255, 136, 0.1)',
            border: `2px solid ${brandColors.primary}`,
            borderRadius: '8px',
            fontSize: '16px',
            color: brandColors.primary,
            display: 'inline-block',
          }}
        >
          🎛️ Interactive Stem Player Available
        </div>
      </div>

      {/* Right Side - Cover Art */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '400px',
            height: '400px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: `4px solid ${brandColors.primary}`,
            boxShadow: '0 25px 50px rgba(0, 255, 136, 0.3)',
            background: coverImageUrl
              ? `url(${coverImageUrl})`
              : 'linear-gradient(135deg, #333, #666)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!coverImageUrl && (
            <div
              style={{
                fontSize: '80px',
                color: brandColors.text.tertiary,
              }}
            >
              ♪
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Show/Event OG Image Template
export function ShowOGTemplate({
  title,
  venue,
  city,
  country,
  showDate,
  ticketUrl,
}: {
  title: string;
  venue: string;
  city: string;
  country: string;
  showDate: string;
  ticketUrl?: string;
}) {
  const formattedDate = new Date(showDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(showDate).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '1200px',
        height: '630px',
        ...baseStyles,
        padding: '60px',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        background:
          'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 50%, #1a1a1a 100%)',
      }}
    >
      {/* Event Type */}
      <div
        style={{
          fontSize: '20px',
          color: brandColors.secondary,
          textTransform: 'uppercase',
          letterSpacing: '3px',
          marginBottom: '20px',
        }}
      >
        Live Performance
      </div>

      {/* Brand */}
      <div
        style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: brandColors.primary,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '40px',
        }}
      >
        4ground
      </div>

      {/* Event Title */}
      <h1
        style={{
          fontSize: '56px',
          fontWeight: 'bold',
          lineHeight: '1.1',
          marginBottom: '40px',
          background: `linear-gradient(45deg, ${brandColors.primary}, ${brandColors.secondary})`,
          backgroundClip: 'text',
          color: 'transparent',
          maxWidth: '900px',
        }}
      >
        {title}
      </h1>

      {/* Venue & Location */}
      <div
        style={{
          fontSize: '24px',
          color: brandColors.text.primary,
          marginBottom: '20px',
        }}
      >
        <strong>{venue}</strong>
      </div>

      <div
        style={{
          fontSize: '20px',
          color: brandColors.text.secondary,
          marginBottom: '40px',
        }}
      >
        {city}, {country}
      </div>

      {/* Date & Time */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          padding: '30px 50px',
          background: 'rgba(0, 255, 136, 0.1)',
          border: `2px solid ${brandColors.primary}`,
          borderRadius: '16px',
          marginBottom: '30px',
        }}
      >
        <div
          style={{
            fontSize: '28px',
            color: brandColors.primary,
            fontWeight: 'bold',
          }}
        >
          {formattedDate}
        </div>
        <div
          style={{
            fontSize: '22px',
            color: brandColors.text.secondary,
          }}
        >
          {formattedTime}
        </div>
      </div>

      {/* Ticket CTA */}
      {ticketUrl && (
        <div
          style={{
            fontSize: '18px',
            color: brandColors.accent,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          🎫 Tickets Available
        </div>
      )}
    </div>
  );
}

// Lab Piece OG Image Template
export function LabPieceOGTemplate({
  title,
  description,
  techStack,
  isActive,
  featured,
}: {
  title: string;
  description: string;
  techStack: string[];
  isActive: boolean;
  featured: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        width: '1200px',
        height: '630px',
        ...baseStyles,
        padding: '60px',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0d1117 0%, #1a1a1a 100%)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: brandColors.primary,
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            4ground
          </div>
          <div
            style={{
              fontSize: '18px',
              color: brandColors.text.tertiary,
            }}
          >
            Audio Lab
          </div>
        </div>

        {/* Status Badges */}
        <div style={{ display: 'flex', gap: '15px' }}>
          {featured && (
            <div
              style={{
                padding: '8px 16px',
                background: brandColors.secondary,
                color: '#ffffff',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              ⭐ Featured
            </div>
          )}
          {isActive && (
            <div
              style={{
                padding: '8px 16px',
                background: brandColors.primary,
                color: '#000000',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              🔨 Active
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: '52px',
          fontWeight: 'bold',
          lineHeight: '1.2',
          marginBottom: '30px',
          background: `linear-gradient(45deg, ${brandColors.primary}, ${brandColors.accent})`,
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {title}
      </h1>

      {/* Description */}
      <p
        style={{
          fontSize: '22px',
          color: brandColors.text.secondary,
          lineHeight: '1.5',
          marginBottom: '40px',
          maxWidth: '900px',
        }}
      >
        {description}
      </p>

      {/* Tech Stack */}
      {techStack.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
          }}
        >
          {techStack.slice(0, 6).map((tech, index) => (
            <div
              key={index}
              style={{
                padding: '10px 20px',
                background: 'rgba(139, 92, 246, 0.2)',
                border: `2px solid ${brandColors.accent}`,
                borderRadius: '25px',
                fontSize: '16px',
                color: brandColors.accent,
                fontWeight: 'bold',
              }}
            >
              {tech}
            </div>
          ))}
          {techStack.length > 6 && (
            <div
              style={{
                padding: '10px 20px',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '25px',
                fontSize: '16px',
                color: brandColors.text.tertiary,
              }}
            >
              +{techStack.length - 6} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Default/Fallback OG Image Template
export function DefaultOGTemplate({
  title = '4ground',
  subtitle = 'Electronic Music & Audio Innovation',
  type = 'website',
}: {
  title?: string;
  subtitle?: string;
  type?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '1200px',
        height: '630px',
        ...baseStyles,
        padding: '80px',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        background:
          'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
      }}
    >
      {/* Logo/Brand */}
      <div
        style={{
          fontSize: '80px',
          fontWeight: 'bold',
          color: brandColors.primary,
          textTransform: 'uppercase',
          letterSpacing: '4px',
          marginBottom: '30px',
          textShadow: '0 0 30px rgba(0, 255, 136, 0.5)',
        }}
      >
        4ground
      </div>

      {/* Subtitle */}
      <p
        style={{
          fontSize: '28px',
          color: brandColors.text.secondary,
          marginBottom: '60px',
          maxWidth: '800px',
          lineHeight: '1.4',
        }}
      >
        {subtitle}
      </p>

      {/* Visual Element */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
        }}
      >
        {[brandColors.primary, brandColors.secondary, brandColors.accent].map(
          (color, index) => (
            <div
              key={index}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: color,
                boxShadow: `0 0 20px ${color}`,
              }}
            />
          )
        )}
      </div>
    </div>
  );
}
