import "./style.css";
import { DROPPABLE_BALL_TYPES, FRAME_PER_ACCEL, FRAME_TIME_MSEC, DROPPABLE_LARGEST_BALL, PLAY_AREA_HEIGHT, DROP_AREA_HEIGHT, PLAY_AREA_PADDING, PLAY_AREA_MAX_X } from "./constants";
import { Ball } from "./ball";
import { calc_collision } from "./collision";

const canvas = document.getElementById("main_canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const score_elm = document.getElementById("current_score") as HTMLOutputElement;
const range_input_elm = document.getElementById("drop_point") as HTMLInputElement;

let balls: Ball[] = [];
let tmp_ball: Ball | null = null;
let drop_queue: Ball[] = [];
let score = 0;

// save best 3 score to local storage
function save_score(score: number) {
    const scores = JSON.parse(localStorage.getItem("scores") || "[]");
    scores.push(score);
    scores.sort((a: number, b: number) => b - a);
    localStorage.setItem("scores", JSON.stringify(scores.slice(0, 3)));
}

// load best 3 score from local storage
function load_score() {
    const scores = JSON.parse(localStorage.getItem("scores") || "[]");
    const score_elm = document.getElementById("high_scores") as HTMLOListElement;
    score_elm.innerHTML = "";
    scores.forEach((score: number) => {
        const li = document.createElement("li");
        li.textContent = String(score);
        score_elm.appendChild(li);
    });
}

function reset() {
    balls = [];
    drop_queue = [];
    score = 0;
    tmp_ball = null;
    init_drop_queue();
    set_range_input();
    set_drop_balls_position();
    load_score();
}

function can_drop(): boolean {
    if (tmp_ball === null) {
        return true;
    } else {
        const result = tmp_ball.get_point().y - tmp_ball.get_radius() > canvas.height - PLAY_AREA_PADDING * 2 - PLAY_AREA_HEIGHT;
        if (result) tmp_ball = null;
        return result;
    }
}

function main_loop() {
    setTimeout(main_loop, FRAME_TIME_MSEC);
    clear_canvas();
    draw();
    if (is_game_over()) {
        alert(`Game Over! Your score is ${score}!`);
        save_score(score);
        reset();
    }
}

function is_game_over(): boolean {
    return balls.some((ball) => {
        return ball.get_point().y + ball.get_radius() < canvas.height - PLAY_AREA_PADDING * 2 - PLAY_AREA_HEIGHT;
    });
}

function init_drop_queue() {
    const first_ball_type = DROPPABLE_BALL_TYPES[Math.floor(Math.random() * DROPPABLE_BALL_TYPES.length)];
    const second_ball_type = DROPPABLE_BALL_TYPES[Math.floor(Math.random() * DROPPABLE_BALL_TYPES.length)];
    const first_ball = new Ball(first_ball_type);
    const second_ball = new Ball(second_ball_type);
    drop_queue.push(first_ball);
    drop_queue.push(second_ball);
}

function set_drop_balls_position() {
    const first_ball = drop_queue[0]!;
    const second_ball = drop_queue[1]!;
    first_ball.set_point({ x: parseInt(range_input_elm.value), y: canvas.height - PLAY_AREA_HEIGHT - PLAY_AREA_PADDING * 2 - first_ball.get_radius() }, PLAY_AREA_MAX_X, canvas.height);
    second_ball.set_point({ x: PLAY_AREA_MAX_X + DROPPABLE_LARGEST_BALL.radius + PLAY_AREA_PADDING * 2, y: DROPPABLE_LARGEST_BALL.radius + PLAY_AREA_PADDING * 2 }, canvas.width, canvas.height);
}

function set_range_input() {
    const first_ball = drop_queue[0]!;
    range_input_elm.max = String(PLAY_AREA_MAX_X - first_ball.get_radius());
    range_input_elm.min = String(first_ball.get_radius() + PLAY_AREA_PADDING);
}

function drop_ball() {
    if (!can_drop()) {
        return;
    }
    const first_ball = drop_queue.shift()!;
    const new_ball_type = DROPPABLE_BALL_TYPES[Math.floor(Math.random() * DROPPABLE_BALL_TYPES.length)];
    const new_ball = new Ball(new_ball_type);
    first_ball.set_acceleration({ x: 0, y: FRAME_PER_ACCEL });
    tmp_ball = first_ball;
    drop_queue.push(new_ball);
    balls.push(first_ball);
    set_range_input();
    set_drop_balls_position();
}

document.addEventListener("DOMContentLoaded", () => {
    canvas.width = PLAY_AREA_MAX_X + DROPPABLE_LARGEST_BALL.radius * 2 + PLAY_AREA_PADDING * 4;
    canvas.height = PLAY_AREA_PADDING * 2 + PLAY_AREA_HEIGHT + DROP_AREA_HEIGHT;
    reset();
    main_loop();
});

document.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
        drop_ball();
        return;
    }
    if (e.key === "ArrowLeft") {
        const first_ball = drop_queue[0]!;
        first_ball.set_point({ x: first_ball.get_point().x - 1, y: first_ball.get_point().y }, PLAY_AREA_MAX_X, canvas.height);
    }
    if (e.key === "ArrowRight") {
        const first_ball = drop_queue[0]!;
        first_ball.set_point({ x: first_ball.get_point().x + 1, y: first_ball.get_point().y }, PLAY_AREA_MAX_X, canvas.height);
    }
    range_input_elm.value = String(drop_queue[0]!.get_point().x);
});

document.getElementById("drop_button")?.addEventListener("click", drop_ball);
document.getElementById("reset_button")?.addEventListener("click", reset);
document.getElementById("drop_point")?.addEventListener("input", (e) => {
    const input = e.target as HTMLInputElement;
    const first_ball = drop_queue[0]!;
    first_ball.set_point({ x: parseInt(input.value), y: first_ball.get_point().y }, PLAY_AREA_MAX_X, canvas.height);
});

function clear_canvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw_border() {
    // play area
    ctx.beginPath();
    ctx.strokeStyle = "#222222";
    ctx.moveTo(PLAY_AREA_PADDING, DROP_AREA_HEIGHT);
    ctx.lineTo(PLAY_AREA_PADDING, canvas.height - PLAY_AREA_PADDING);
    ctx.lineTo(PLAY_AREA_MAX_X, canvas.height - PLAY_AREA_PADDING);
    ctx.lineTo(PLAY_AREA_MAX_X, DROP_AREA_HEIGHT);
    ctx.stroke();

    // next ball area
    ctx.beginPath();
    ctx.strokeStyle = "#7E7E7E";
    ctx.moveTo(PLAY_AREA_MAX_X + PLAY_AREA_PADDING, PLAY_AREA_PADDING);
    ctx.lineTo(PLAY_AREA_MAX_X + PLAY_AREA_PADDING, PLAY_AREA_PADDING * 3 + DROPPABLE_LARGEST_BALL.radius * 2);
    ctx.lineTo(PLAY_AREA_MAX_X + DROPPABLE_LARGEST_BALL.radius * 2 + PLAY_AREA_PADDING * 3, PLAY_AREA_PADDING * 3 + DROPPABLE_LARGEST_BALL.radius * 2);
    ctx.lineTo(PLAY_AREA_MAX_X + DROPPABLE_LARGEST_BALL.radius * 2 + PLAY_AREA_PADDING * 3, PLAY_AREA_PADDING);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();

    ctx.fillStyle = "#7E7E7E";
    ctx.fillText("NEXT", PLAY_AREA_MAX_X + DROPPABLE_LARGEST_BALL.radius * 2, PLAY_AREA_PADDING * 4 + DROPPABLE_LARGEST_BALL.radius * 2);
}

function draw_drop_line() {
    const first_ball = drop_queue[0]!;
    ctx.beginPath();
    ctx.strokeStyle = "#7E7E7E";
    ctx.moveTo(first_ball.get_point().x, first_ball.get_point().y + first_ball.get_radius());
    ctx.lineTo(first_ball.get_point().x, canvas.height - PLAY_AREA_PADDING);
    ctx.stroke();
}

function draw_drop_queue() {
    drop_queue.forEach((ball) => {
        ball.draw(ctx);
    });
    draw_drop_line();
}

function draw_balls() {
    for (let idx = 0; idx < balls.length; idx++) {
        const ball = balls[idx];
        ball.move(PLAY_AREA_MAX_X, canvas.height - PLAY_AREA_PADDING);
        for (let other_idx = idx + 1; other_idx < balls.length; other_idx++) {
            const other = balls[other_idx];
            if (calc_collision(ball, other, PLAY_AREA_MAX_X, canvas.height - PLAY_AREA_PADDING)) {
                if (ball === tmp_ball || other === tmp_ball) {
                    tmp_ball = null;
                }
                if (ball.is_same_ball_type(other)) {
                    ball.upgrade_ball_type();
                    ball.set_point({ x: (ball.get_point().x + other.get_point().x) / 2, y: (ball.get_point().y + other.get_point().y) / 2 }, PLAY_AREA_MAX_X, canvas.height - PLAY_AREA_PADDING);
                    ball.set_velocity({ x: (ball.get_velocity().x + other.get_velocity().x) / 2, y: (ball.get_velocity().y + other.get_velocity().y) / 2 });
                    balls.splice(other_idx, 1);
                    score += ball.get_score();
                }
            }
        }
        ball.draw(ctx);
    }
}

function draw() {
    draw_drop_queue();
    draw_balls();
    draw_border();

    score_elm.textContent = String(score);
}
