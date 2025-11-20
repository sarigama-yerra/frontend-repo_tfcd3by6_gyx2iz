import React, { useEffect, useMemo, useRef, useState } from "react";
import OnScreenControls from "./OnScreenControls";

const CELL = 20; // px per grid square
const COLS = 20;
const ROWS = 20;
const SPEEDS = {
  easy: 160,
  normal: 120,
  hard: 80,
};

const randCell = () => ({
  x: Math.floor(Math.random() * COLS),
  y: Math.floor(Math.random() * ROWS),
});

function SnakeGame() {
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState("normal");
  const [dir, setDir] = useState({ x: 1, y: 0 }); // start moving right
  const [snake, setSnake] = useState([{ x: 8, y: 10 }]);
  const [food, setFood] = useState(randCell);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const pendingDir = useRef(dir);

  const size = useMemo(() => ({ w: COLS * CELL, h: ROWS * CELL }), []);

  const reset = () => {
    setSnake([{ x: 8, y: 10 }]);
    setDir({ x: 1, y: 0 });
    pendingDir.current = { x: 1, y: 0 };
    setFood(randCell());
    setScore(0);
    setGameOver(false);
    setRunning(false);
  };

  const placeFood = (occupied) => {
    let f = randCell();
    while (occupied.some((c) => c.x === f.x && c.y === f.y)) {
      f = randCell();
    }
    return f;
  };

  const step = () => {
    setSnake((prev) => {
      const nextDir = pendingDir.current;
      const head = { x: prev[0].x + nextDir.x, y: prev[0].y + nextDir.y };

      // collisions
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
        setGameOver(true);
        setRunning(false);
        return prev;
      }
      if (prev.some((c) => c.x === head.x && c.y === head.y)) {
        setGameOver(true);
        setRunning(false);
        return prev;
      }

      const ate = head.x === food.x && head.y === food.y;
      const nextSnake = [head, ...prev];
      if (!ate) nextSnake.pop();

      if (ate) {
        setScore((s) => s + 1);
        setFood((f) => placeFood(nextSnake));
      }

      return nextSnake;
    });
  };

  useEffect(() => {
    if (!running || gameOver) return;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(step, SPEEDS[speed]);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, speed, gameOver]);

  useEffect(() => {
    const onKey = (e) => {
      const key = e.key;
      if (key === "ArrowUp" && dir.y !== 1) pendingDir.current = { x: 0, y: -1 };
      if (key === "ArrowDown" && dir.y !== -1) pendingDir.current = { x: 0, y: 1 };
      if (key === "ArrowLeft" && dir.x !== 1) pendingDir.current = { x: -1, y: 0 };
      if (key === "ArrowRight" && dir.x !== -1) pendingDir.current = { x: 1, y: 0 };
      if (key === " " || key === "Enter") setRunning((r) => !r);
      if (key.toLowerCase() === "r") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dir]);

  // sync dir after each tick
  useEffect(() => {
    const id = setInterval(() => setDir(pendingDir.current), 5);
    return () => clearInterval(id);
  }, []);

  // draw
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, size.w, size.h);

    // background grid
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? "#0f172a" : "#111827"; // slate shades
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }

    // food
    ctx.fillStyle = "#f43f5e"; // rose-500
    ctx.shadowColor = "#f43f5e";
    ctx.shadowBlur = 10;
    ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);
    ctx.shadowBlur = 0;

    // snake
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? "#60a5fa" : "#3b82f6"; // blue-400/500
      ctx.strokeStyle = "#1e40af";
      ctx.lineWidth = 2;
      const x = seg.x * CELL;
      const y = seg.y * CELL;

      ctx.beginPath();
      const radius = 6;
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + CELL, y, x + CELL, y + CELL, radius);
      ctx.arcTo(x + CELL, y + CELL, x, y + CELL, radius);
      ctx.arcTo(x, y + CELL, x, y, radius);
      ctx.arcTo(x, y, x + CELL, y, radius);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  }, [snake, food, size]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-slate-800/70 border border-blue-500/30 text-blue-200">
            Score: <span className="font-semibold text-white">{score}</span>
          </span>
          <select
            className="px-3 py-1 rounded-lg bg-slate-800/70 border border-blue-500/30 text-blue-200"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow"
          >
            {running ? "Pause" : "Play"}
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-blue-100 border border-blue-500/30"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-blue-500/20 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={size.w}
          height={size.h}
          className="block w-full h-auto bg-slate-900"
        />

        {gameOver && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center p-6 rounded-xl bg-slate-800/80 border border-blue-500/30">
              <h2 className="text-2xl font-bold text-white mb-2">Game Over</h2>
              <p className="text-blue-200 mb-4">Your score: {score}</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={reset}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium"
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-center md:hidden">
        <OnScreenControls
          onUp={() => (pendingDir.current = dir.y !== 1 ? { x: 0, y: -1 } : pendingDir.current)}
          onDown={() => (pendingDir.current = dir.y !== -1 ? { x: 0, y: 1 } : pendingDir.current)}
          onLeft={() => (pendingDir.current = dir.x !== 1 ? { x: -1, y: 0 } : pendingDir.current)}
          onRight={() => (pendingDir.current = dir.x !== -1 ? { x: 1, y: 0 } : pendingDir.current)}
        />
      </div>
    </div>
  );
}

export default SnakeGame;
