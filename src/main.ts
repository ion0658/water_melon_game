import "./style.css";
import { DROPPABLE_BALL_TYPES, FRAME_PER_ACCEL, FRAME_TIME_MSEC, DROPPABLE_LARGEST_BALL, LARGEST_BALL } from "./constants";
import { Ball } from "./ball";
import { calc_collision } from "./collision";

const canvas = document.getElementById("main_canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

let balls: Ball[] = [];

let drop_queue: Ball[] = [];

function main_loop() {
    const start = Date.now();

    clear_canvas();
    draw();

    const delta = Date.now() - start;
    setTimeout(main_loop, Math.max(0, FRAME_TIME_MSEC - delta));
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
    const input_elm = document.getElementById("drop_point")! as HTMLInputElement;
    first_ball.set_point({ x: parseInt(input_elm.value), y: DROPPABLE_LARGEST_BALL.radius * 4 }, canvas.width, canvas.height);
    second_ball.set_point({ x: DROPPABLE_LARGEST_BALL.radius + 10, y: DROPPABLE_LARGEST_BALL.radius + 10 }, canvas.width, canvas.height);
}

function set_range_input() {
    const range_input = document.getElementById("drop_point") as HTMLInputElement;
    const first_ball = drop_queue[0]!;
    range_input.max = String(canvas.width - first_ball.get_radius());
    range_input.min = String(first_ball.get_radius());
    const output_elm = document.getElementById("drop_point_value")!;
    output_elm.textContent = range_input.value;
}

document.addEventListener("DOMContentLoaded", () => {
    canvas.width = LARGEST_BALL.radius * 4;
    canvas.height = LARGEST_BALL.radius * 4 + DROPPABLE_LARGEST_BALL.radius * 5;
    init_drop_queue();
    set_range_input();
    set_drop_balls_position();
    main_loop();
});

document.getElementById("drop_button")?.addEventListener("click", () => {
    const first_ball = drop_queue.shift()!;
    const new_ball_type = DROPPABLE_BALL_TYPES[Math.floor(Math.random() * DROPPABLE_BALL_TYPES.length)];
    const new_ball = new Ball(new_ball_type);
    first_ball.set_acceleration({ x: 0, y: FRAME_PER_ACCEL });
    drop_queue.push(new_ball);
    balls.push(first_ball);
    set_range_input();
    set_drop_balls_position();
});

document.getElementById("drop_point")?.addEventListener("input", (e) => {
    const input = e.target as HTMLInputElement;
    const output_elm = document.getElementById("drop_point_value")!;
    output_elm.textContent = input.value;
    const first_ball = drop_queue[0]!;
    first_ball.set_point({ x: parseInt(input.value), y: first_ball.point.y }, canvas.width, canvas.height);
});

function clear_canvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw_border() {
    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    ctx.moveTo(0, DROPPABLE_LARGEST_BALL.radius * 5);
    ctx.lineTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(canvas.width, DROPPABLE_LARGEST_BALL.radius * 5);
    ctx.stroke();
}

function draw_drop_line() {
    const first_ball = drop_queue[0]!;
    ctx.beginPath();
    ctx.strokeStyle = "#222222";
    ctx.moveTo(first_ball.point.x, first_ball.point.y + first_ball.get_radius());
    ctx.lineTo(first_ball.point.x, canvas.height);
    ctx.stroke();
}

function draw_drop_queue() {
    drop_queue.forEach((ball) => {
        ball.draw(ctx);
    });
    draw_drop_line();
}

function draw_balls() {
    for (let idx = 0, other_idx = 0; idx < balls.length; other_idx = other_idx < balls.length - 1 ? other_idx + 1 : 0, idx = other_idx === 0 ? idx + 1 : idx) {
        if (idx === other_idx) {
            continue;
        }
        const ball = balls[idx];
        const other = balls[other_idx];
        if (calc_collision(ball, other, canvas.width, canvas.height)) {
            console.log("need upgrade");
            ball.upgrade_ball_type();
            balls.splice(other_idx, 1);
        }
    }

    balls.forEach((ball) => {
        ball.move(canvas.width, canvas.height);
        ball.draw(ctx);
    });
}

function draw() {
    draw_drop_queue();
    draw_balls();
    draw_border();
}
