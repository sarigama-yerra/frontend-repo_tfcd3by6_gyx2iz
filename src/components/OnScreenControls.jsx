import React from "react";

const Button = ({ label, onClick, children }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center w-16 h-16 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-blue-500/30 text-blue-200 hover:text-white transition-colors active:scale-95 shadow-lg"
    aria-label={label}
  >
    {children}
  </button>
);

const OnScreenControls = ({ onUp, onDown, onLeft, onRight }) => {
  return (
    <div className="grid grid-cols-3 gap-4 select-none">
      <div></div>
      <Button label="Up" onClick={onUp}>
        ↑
      </Button>
      <div></div>

      <Button label="Left" onClick={onLeft}>←</Button>
      <div></div>
      <Button label="Right" onClick={onRight}>→</Button>

      <div></div>
      <Button label="Down" onClick={onDown}>↓</Button>
      <div></div>
    </div>
  );
};

export default OnScreenControls;
