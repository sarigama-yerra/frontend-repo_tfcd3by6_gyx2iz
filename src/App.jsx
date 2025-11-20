import GameHeader from "./components/GameHeader";
import SnakeGame from "./components/SnakeGame";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-blue-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.06),transparent_50%)] pointer-events-none"></div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          <GameHeader />
          <SnakeGame />

          <div className="mt-10 text-center text-blue-300/70 text-sm">
            <p>Controls: Arrow keys • Space/Enter to play/pause • R to reset</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
