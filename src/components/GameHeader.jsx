import React from "react";

const GameHeader = () => {
  return (
    <div className="text-center mb-6">
      <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
        Snake
      </h1>
      <p className="mt-2 text-blue-200/80 text-sm">
        Use arrow keys or tap the controls to play. Eat the food, don’t hit the walls or yourself!
      </p>
    </div>
  );
};

export default GameHeader;
