import React from "react";
import RefreshIcon from "@mui/icons-material/Refresh";

/**
 * BlobButton - Reusable animated gooey blob button component
 *
 * @param {Function} onClick - Click handler
 * @param {boolean} disabled - Disabled state
 * @param {boolean} isLoading - Loading spinner state
 * @param {string} label - Button text label
 * @param {string} loadingLabel - Text label during loading
 * @param {React.ReactNode} icon - Custom icon override
 * @param {string} className - Additional CSS classes
 * @param {Object} style - Inline styles
 * @param {boolean} fixed - If true, renders docked fixed at bottom-right viewport
 */
export const BlobButton = ({
  onClick,
  disabled = false,
  isLoading = false,
  label = "Refresh",
  loadingLabel = "Refreshing...",
  icon,
  className = "",
  style = {},
  fixed = false,
}) => {
  const IconComponent = icon || (
    <RefreshIcon
      sx={{ fontSize: 16 }}
      className={isLoading ? "animate-spin" : ""}
    />
  );

  const buttonElement = (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`refresh-blob-btn ${className}`}
      style={style}
    >
      {IconComponent}
      <span>{label}</span>
      <span className="refresh-blob-btn__inner">
        <span className="refresh-blob-btn__blobs">
          <span className="refresh-blob-btn__blob" />
          <span className="refresh-blob-btn__blob" />
          <span className="refresh-blob-btn__blob" />
          <span className="refresh-blob-btn__blob" />
        </span>
      </span>
    </button>
  );

  return (
    <>
      {fixed ? (
        <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {buttonElement}
        </div>
      ) : (
        buttonElement
      )}

      {/* Gooey SVG Filter Definition */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              result="blur"
              stdDeviation="10"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"
              result="goo"
            />
            <feBlend in2="goo" in="SourceGraphic" result="mix" />
          </filter>
        </defs>
      </svg>
    </>
  );
};

export default BlobButton;
