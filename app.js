const DAILY_URL = "https://lichess.org/api/puzzle/daily";

const fallbackPuzzle = {
  game: {
    id: "fallback",
    pgn: "Fallback position"
  },
  puzzle: {
    id: "local",
    rating: 1200,
    themes: ["mate", "daily"],
    fen: "6k1/5ppp/8/7Q/8/8/5PPP/6K1 w - - 0 1",
    lastMove: "g8g7",
    solution: ["h5f7"]
  }
};

const pieces = {
  p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
  P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔"
};

const board = document.getElementById("board");
const statusEl = document.getElementById("status");
const summary = document.getElementById("summary");
const puzzleId = document.getElementById("puzzle-id");
const side = document.getElementById("side");
const rating = document.getElementById("rating");
const themes = document.getElementById("themes");
const solution = document.getElementById("solution");
const reveal = document.getElementById("reveal");
const lichessLink = document.getElementById("lichess-link");

let currentPuzzle = fallbackPuzzle;

function parseFenBoard(fen) {
  const rows = fen.split(" ")[0].split("/");
  return rows.map((row) => {
    const squares = [];
    for (const char of row) {
      if (/\d/.test(char)) {
        for (let i = 0; i < Number(char); i += 1) squares.push("");
      } else {
        squares.push(char);
      }
    }
    return squares;
  });
}

function moveSquares(move) {
  if (!move || move.length < 4) return new Set();
  return new Set([move.slice(0, 2), move.slice(2, 4)]);
}

function renderBoard(fen, lastMove) {
  const grid = parseFenBoard(fen);
  const highlights = moveSquares(lastMove);
  board.innerHTML = "";

  for (let rankIndex = 0; rankIndex < 8; rankIndex += 1) {
    for (let fileIndex = 0; fileIndex < 8; fileIndex += 1) {
      const file = String.fromCharCode(97 + fileIndex);
      const rank = String(8 - rankIndex);
      const coord = `${file}${rank}`;
      const square = document.createElement("div");
      square.className = `square ${((rankIndex + fileIndex) % 2 === 0) ? "light" : "dark"}`;
      if (highlights.has(coord)) square.classList.add("last");
      square.dataset.square = coord;
      square.innerHTML = `<span>${pieces[grid[rankIndex][fileIndex]] || ""}</span>`;
      if (fileIndex === 0 || rankIndex === 7) {
        const label = document.createElement("small");
        label.className = "coord";
        label.textContent = fileIndex === 0 ? rank : file;
        square.appendChild(label);
      }
      board.appendChild(square);
    }
  }
}

function renderSolution(moves, revealed) {
  solution.classList.toggle("revealed", revealed);
  solution.innerHTML = "";
  const visible = revealed ? moves : moves.map(() => "••••");
  for (const move of visible) {
    const item = document.createElement("li");
    item.textContent = move;
    solution.appendChild(item);
  }
}

function renderPuzzle(data, source) {
  const puzzle = data.puzzle;
  currentPuzzle = data;
  statusEl.textContent = source;
  puzzleId.textContent = puzzle.id ? `#${puzzle.id}` : "Daily";
  side.textContent = puzzle.fen.includes(" w ") ? "White" : "Black";
  rating.textContent = puzzle.rating || "-";
  themes.textContent = Array.isArray(puzzle.themes) ? puzzle.themes.join(", ") : "-";
  summary.textContent = `Solve the ${side.textContent.toLowerCase()} move from today's Lichess puzzle.`;
  lichessLink.href = puzzle.id ? `https://lichess.org/training/${puzzle.id}` : "https://lichess.org/training";
  renderBoard(puzzle.fen, puzzle.lastMove);
  renderSolution(puzzle.solution || [], false);
}

async function loadDailyPuzzle() {
  try {
    const response = await fetch(DAILY_URL, {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error(`Lichess returned ${response.status}`);
    const data = await response.json();
    renderPuzzle(data, "Lichess");
  } catch (error) {
    console.warn(error);
    renderPuzzle(fallbackPuzzle, "Fallback");
  }
}

reveal.addEventListener("click", () => {
  renderSolution(currentPuzzle.puzzle.solution || [], true);
});

loadDailyPuzzle();
