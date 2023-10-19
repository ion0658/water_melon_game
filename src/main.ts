import "./style.css";
import * as CONSTANTS from "./constants";
import init, * as wasm from "../wasm-lib/pkg";
import { TickBall, TickGame } from "./types";
import * as PIXI from "pixi.js";

const score_elm = document.getElementById("current_score") as HTMLOutputElement;
const range_input_elm = document.getElementById("drop_point") as HTMLInputElement;

let score: number = 0;

let game: wasm.Game;
let tick_data: TickGame;

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
    if (game) {
        game.free();
    }
    game = wasm.reset(BigInt(CONSTANTS.FPS));
    draw_high_scores(load_score());
}

function game_loop() {
    setTimeout(game_loop, CONSTANTS.FRAME_TIME_MSEC);
    if (game.is_game_over()) {
        alert(`Game Over! Your score is ${score}!`);
        save_score(score);
        reset();
    }
    tick_data = game.tick();
}

function draw_loop(ctx: PIXI.Application) {
    window.requestAnimationFrame(() => draw_loop(ctx));
    draw(ctx);
}

document.addEventListener("DOMContentLoaded", async () => {
    await init();
    const play_area = wasm.get_play_area();
    const droppable_largest_radius = wasm.get_droppable_large_ball_radius();
    const ctx = new PIXI.Application({
        antialias: true,
        backgroundColor: 0xeeeeee,
        width: play_area.x + droppable_largest_radius * 2 + CONSTANTS.PLAY_AREA_PADDING * 5,
        height: play_area.y + CONSTANTS.PLAY_AREA_PADDING * 2,
    });
    document.getElementById("game_area")?.appendChild(ctx.view as HTMLCanvasElement);
    reset();
    game_loop();
    draw_loop(ctx);
});

document.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
        game.drop(CONSTANTS.PLAY_AREA_PADDING);
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

document.getElementById("drop_button")?.addEventListener("click", () => {
    game.drop(CONSTANTS.PLAY_AREA_PADDING);
});

document.getElementById("reset_button")?.addEventListener("click", reset);
document.getElementById("drop_point")?.addEventListener("input", (e) => {
    const input = e.target as HTMLInputElement;
    const x = Number(input.value);
    game.set_drop_x(x);
});

function draw_border(ctx: PIXI.Application) {
    const play_area = wasm.get_play_area();
    const drop_area_height = wasm.get_drop_area_height();
    const droppable_largest_radius = wasm.get_droppable_large_ball_radius();
    const graphics = new PIXI.Graphics();

    graphics.lineStyle(1, 0x222222, 1);
    graphics.moveTo(CONSTANTS.PLAY_AREA_PADDING, CONSTANTS.PLAY_AREA_PADDING + drop_area_height);
    graphics.lineTo(CONSTANTS.PLAY_AREA_PADDING, play_area.y + CONSTANTS.PLAY_AREA_PADDING);
    graphics.lineTo(
        play_area.x + CONSTANTS.PLAY_AREA_PADDING,
        play_area.y + CONSTANTS.PLAY_AREA_PADDING
    );
    graphics.lineTo(
        play_area.x + CONSTANTS.PLAY_AREA_PADDING,
        CONSTANTS.PLAY_AREA_PADDING + drop_area_height
    );
    graphics.endFill();

    graphics.lineStyle(1, 0x7e7e7e);
    graphics.moveTo(play_area.x + CONSTANTS.PLAY_AREA_PADDING * 2, CONSTANTS.PLAY_AREA_PADDING);
    graphics.lineTo(
        play_area.x + CONSTANTS.PLAY_AREA_PADDING * 2,
        CONSTANTS.PLAY_AREA_PADDING * 3 + droppable_largest_radius * 2
    );
    graphics.lineTo(
        play_area.x + CONSTANTS.PLAY_AREA_PADDING * 4 + droppable_largest_radius * 2,
        CONSTANTS.PLAY_AREA_PADDING * 3 + droppable_largest_radius * 2
    );
    graphics.lineTo(
        play_area.x + CONSTANTS.PLAY_AREA_PADDING * 4 + droppable_largest_radius * 2,
        CONSTANTS.PLAY_AREA_PADDING
    );
    graphics.closePath();
    graphics.endFill();

    const text = new PIXI.Text("NEXT", {
        fontFamily: "Arial",
        fontSize: 10,
        fontWeight: "lighter",
        align: "center",
        fontStyle: "normal",
        fill: 0x7e7e7e,
    });
    text.x = play_area.x + CONSTANTS.PLAY_AREA_PADDING * 6 + droppable_largest_radius;
    text.y = CONSTANTS.PLAY_AREA_PADDING * 4 + droppable_largest_radius * 2;

    ctx.stage.addChild(graphics);
    ctx.stage.addChild(text);
}

function draw_drop_line(ctx: PIXI.Application, ball: TickBall) {
    const play_area = wasm.get_play_area();
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0x7e7e7e);
    graphics.moveTo(
        ball.point.x + CONSTANTS.PLAY_AREA_PADDING,
        ball.point.y + wasm.get_radius(ball.ball_type) + CONSTANTS.PLAY_AREA_PADDING
    );
    graphics.lineTo(
        ball.point.x + CONSTANTS.PLAY_AREA_PADDING,
        play_area.y + CONSTANTS.PLAY_AREA_PADDING
    );
    graphics.endFill();
    ctx.stage.addChild(graphics);
}

function draw_ball(ctx: PIXI.Application, ball: TickBall) {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(wasm.get_color(ball.ball_type).to_rgb_u32());
    graphics.drawCircle(
        ball.point.x + CONSTANTS.PLAY_AREA_PADDING,
        ball.point.y + CONSTANTS.PLAY_AREA_PADDING,
        wasm.get_radius(ball.ball_type)
    );
    graphics.endFill();
    graphics.lineStyle(1, 0x000000);
    graphics.moveTo(
        ball.point.x + CONSTANTS.PLAY_AREA_PADDING,
        ball.point.y + CONSTANTS.PLAY_AREA_PADDING
    );
    graphics.lineTo(
        ball.point.x + CONSTANTS.PLAY_AREA_PADDING + ball.center_line.x,
        ball.point.y + CONSTANTS.PLAY_AREA_PADDING + ball.center_line.y
    );
    graphics.endFill();
    ctx.stage.addChild(graphics);
}

function set_drop_range(ball: TickBall) {
    const play_area = wasm.get_play_area();
    range_input_elm.min = String(wasm.get_radius(ball.ball_type));
    range_input_elm.max = String(play_area.x - wasm.get_radius(ball.ball_type));
    range_input_elm.value = String(ball.point.x);
}

function draw_drop_queue(ctx: PIXI.Application, queues: TickBall[]) {
    const play_area = wasm.get_play_area();
    const droppable_largest_radius = wasm.get_droppable_large_ball_radius();
    const first_ball = queues[0];
    set_drop_range(first_ball);
    draw_drop_line(ctx, first_ball);
    draw_ball(ctx, first_ball);

    const second_ball = queues[1];
    second_ball.point.x = CONSTANTS.PLAY_AREA_PADDING * 2 + play_area.x + droppable_largest_radius;
    second_ball.point.y = CONSTANTS.PLAY_AREA_PADDING * 1 + droppable_largest_radius;
    draw_ball(ctx, second_ball);
}

function draw_balls(ctx: PIXI.Application) {
    const tmp = tick_data;
    const balls = tmp.balls;
    const drop_queue = tmp.drop_queue;
    const tick_score = tmp.score;
    draw_drop_queue(ctx, drop_queue);
    balls.forEach((ball: TickBall) => {
        draw_ball(ctx, ball);
    });
    score = tick_score;
}

function draw(ctx: PIXI.Application) {
    ctx.stage.removeChildren();
    draw_balls(ctx);
    draw_border(ctx);

    score_elm.textContent = String(score);
}
