import "./style.css";
import { FRAME_TIME_MSEC, PLAY_AREA_PADDING, FPS } from "./constants";
import init, {
    reset as game_reset,
    Game,
    get_play_area,
    get_color,
    get_radius,
    get_droppable_large_ball_radius,
    get_drop_area_height,
} from "wasm-lib";
import { TickBall } from "./types";

const canvas = document.getElementById("main_canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const score_elm = document.getElementById("current_score") as HTMLOutputElement;
const range_input_elm = document.getElementById("drop_point") as HTMLInputElement;

let score: number = 0;

let game: Game;

// save best 3 score to local storage
function save_score(score: number) {
    const scores = JSON.parse(localStorage.getItem("scores") || "[]");
    scores.push(score);
    scores.sort((a: number, b: number) => b - a);
    localStorage.setItem("scores", JSON.stringify(scores.slice(0, 3)));
}

// load best 3 score from local storage
function load_score(): number[] {
    const scores = JSON.parse(localStorage.getItem("scores") || "[]");
    return scores;
}

function draw_high_scores(scores: number[]) {
    const score_elm = document.getElementById("high_scores") as HTMLOListElement;
    score_elm.innerHTML = "";
    scores.forEach((score: number) => {
        const li = document.createElement("li");
        li.textContent = String(score);
        score_elm.appendChild(li);
    });
}

function reset() {
    game = game_reset(BigInt(FPS));
    draw_high_scores(load_score());
}

function main_loop() {
    clear_canvas();
    draw();

    if (game.is_game_over()) {
        alert(`Game Over! Your score is ${score}!`);
        save_score(score);
        reset();
    }
    setTimeout(main_loop, FRAME_TIME_MSEC);
}

document.addEventListener("DOMContentLoaded", async () => {
    await init();
    const play_area = get_play_area();
    const droppable_largest_radius = get_droppable_large_ball_radius();
    canvas.width = play_area.x + droppable_largest_radius * 2 + PLAY_AREA_PADDING * 5;
    canvas.height = play_area.y + PLAY_AREA_PADDING * 2;
    reset();
    main_loop();
});

document.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
        game.drop(PLAY_AREA_PADDING);
        return;
    }

    if (e.key === "ArrowLeft") {
        const x = Number(range_input_elm.value) - 1;
        range_input_elm.value = String(x);
        game.set_drop_x(x);
    }
    if (e.key === "ArrowRight") {
        const x = Number(range_input_elm.value) + 1;
        range_input_elm.value = String(x);
        game.set_drop_x(x);
    }
});

//document.getElementById("drop_button")?.addEventListener("click", drop_ball);
document.getElementById("drop_button")?.addEventListener("click", () => {
    game.drop(PLAY_AREA_PADDING);
});

document.getElementById("reset_button")?.addEventListener("click", reset);
document.getElementById("drop_point")?.addEventListener("input", (e) => {
    const input = e.target as HTMLInputElement;
    const x = Number(input.value);
    game.set_drop_x(x);
});

function clear_canvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw_border() {
    const play_area = get_play_area();
    const drop_area_height = get_drop_area_height();
    const droppable_largest_radius = get_droppable_large_ball_radius();
    // play area
    ctx.beginPath();
    ctx.strokeStyle = "#222222";
    ctx.moveTo(PLAY_AREA_PADDING, PLAY_AREA_PADDING + drop_area_height);
    ctx.lineTo(PLAY_AREA_PADDING, play_area.y + PLAY_AREA_PADDING);
    ctx.lineTo(play_area.x + PLAY_AREA_PADDING, play_area.y + PLAY_AREA_PADDING);
    ctx.lineTo(play_area.x + PLAY_AREA_PADDING, PLAY_AREA_PADDING + drop_area_height);
    ctx.stroke();

    // next ball area
    ctx.beginPath();
    ctx.strokeStyle = "#7E7E7E";
    ctx.moveTo(play_area.x + PLAY_AREA_PADDING * 2, PLAY_AREA_PADDING);
    ctx.lineTo(
        play_area.x + PLAY_AREA_PADDING * 2,
        PLAY_AREA_PADDING * 3 + droppable_largest_radius * 2
    );
    ctx.lineTo(
        play_area.x + PLAY_AREA_PADDING * 4 + droppable_largest_radius * 2,
        PLAY_AREA_PADDING * 3 + droppable_largest_radius * 2
    );
    ctx.lineTo(
        play_area.x + PLAY_AREA_PADDING * 4 + droppable_largest_radius * 2,
        PLAY_AREA_PADDING
    );
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();

    ctx.fillStyle = "#7E7E7E";
    ctx.fillText(
        "NEXT",
        play_area.x + PLAY_AREA_PADDING * 7 + droppable_largest_radius,
        PLAY_AREA_PADDING * 5 + droppable_largest_radius * 2
    );
}

function draw_drop_line(ball: TickBall) {
    const play_area = get_play_area();

    ctx.beginPath();
    ctx.strokeStyle = "#7E7E7E";
    ctx.moveTo(
        ball.point.x + PLAY_AREA_PADDING,
        ball.point.y + get_radius(ball.ball_type) + PLAY_AREA_PADDING
    );
    ctx.lineTo(ball.point.x + PLAY_AREA_PADDING, play_area.y + PLAY_AREA_PADDING);
    ctx.stroke();
}

function draw_ball(ball: TickBall) {
    ctx.beginPath();
    ctx.fillStyle = get_color(ball.ball_type);
    ctx.arc(
        ball.point.x + PLAY_AREA_PADDING,
        ball.point.y + PLAY_AREA_PADDING,
        get_radius(ball.ball_type),
        0,
        2 * Math.PI
    );
    ctx.fill();
}

function set_drop_range(ball: TickBall) {
    const play_area = get_play_area();
    range_input_elm.min = String(get_radius(ball.ball_type));
    range_input_elm.max = String(play_area.x - get_radius(ball.ball_type));
}

function draw_drop_queue(queues: TickBall[]) {
    const play_area = get_play_area();
    const droppable_largest_radius = get_droppable_large_ball_radius();
    const first_ball = queues[0];
    set_drop_range(first_ball);
    draw_drop_line(first_ball);
    draw_ball(first_ball);

    const second_ball = queues[1];
    second_ball.point.x = PLAY_AREA_PADDING * 2 + play_area.x + droppable_largest_radius;
    second_ball.point.y = PLAY_AREA_PADDING * 1 + droppable_largest_radius;
    draw_ball(second_ball);
}

function draw_balls() {
    const tick_data = game.tick();
    const balls = tick_data.balls;
    const drop_queue = tick_data.drop_queue;
    const tick_score = tick_data.score;
    draw_drop_queue(drop_queue);
    balls.forEach((ball: TickBall) => {
        draw_ball(ball);
    });
    score = tick_score;
}

function draw() {
    draw_balls();
    draw_border();

    score_elm.textContent = String(score);
}
