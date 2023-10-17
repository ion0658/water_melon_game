// import { expect, test } from "vitest";
// import { Ball } from "../ball";
// import { BallTypes, PLAY_AREA_MIN_X } from "../constants";

// test.each(Object.values(BallTypes))("radius", (ball_type) => {
//     const ball = new Ball(ball_type);
//     expect(ball.get_radius()).toBe(ball_type.radius);
// });

// test.each(Object.values(BallTypes))("color", (ball_type) => {
//     const ball = new Ball(ball_type);
//     expect(ball.get_color()).toBe(ball_type.color);
// });

// test.each(Object.values(BallTypes))("mass", (ball_type) => {
//     const ball = new Ball(ball_type);
//     expect(ball.get_mass()).toBe(ball_type.mass);
// });

// test.each(Object.values(BallTypes))("score", (ball_type) => {
//     const ball = new Ball(ball_type);
//     expect(ball.get_score()).toBe(ball_type.score);
// });

// test.each(Object.values(BallTypes))("is_same_ball_type", (ball_type) => {
//     const ball = new Ball(ball_type);
//     expect(ball.is_same_ball_type(new Ball(ball_type))).toBe(true);
// });

// test.each(Object.values(BallTypes))("is_upgraded", (ball_type) => {
//     const ball = new Ball(ball_type);
//     expect(ball.is_upgraded()).toBe(false);
// });

// test.each(Object.values(BallTypes))("upgrade_ball_type", (ball_type) => {
//     const ball = new Ball(ball_type);
//     ball.upgrade_ball_type();
//     expect(ball.is_same_ball_type(new Ball(ball_type))).toBe(false);
//     expect(ball.is_upgraded()).toBe(true);
// });

// test.each(Object.values(BallTypes))("set_acceleration", (ball_type) => {
//     const ball = new Ball(ball_type);
//     expect(ball.set_acceleration({ x: 1, y: 1 })).toBeUndefined();
// });

// test.each(Object.values(BallTypes))("point", (ball_type) => {
//     const ball = new Ball(ball_type);
//     const r = ball.get_radius();

//     ball.set_point({ x: 0, y: 0 }, 1000, 1000);
//     expect(ball.get_point()).toEqual({ x: 0 + r + PLAY_AREA_MIN_X, y: 0 + r });

//     ball.set_point({ x: 1000, y: 1000 }, 1000, 1000);
//     expect(ball.get_point()).toEqual({ x: 1000 - r, y: 1000 - r });

//     ball.set_point({ x: r - 1, y: r - 1 }, 1000, 1000);
//     expect(ball.get_point()).toEqual({ x: r + PLAY_AREA_MIN_X, y: r });

//     ball.set_point({ x: 1000 - r + 1, y: 1000 - r + 1 }, 1000, 1000);
//     expect(ball.get_point()).toEqual({ x: 1000 - r, y: 1000 - r });

//     ball.set_point({ x: r, y: r }, 1000, 1000);
//     expect(ball.get_point()).toEqual({ x: r + PLAY_AREA_MIN_X, y: r });

//     ball.set_point({ x: 1000 - r, y: 1000 - r }, 1000, 1000);
//     expect(ball.get_point()).toEqual({ x: 1000 - r, y: 1000 - r });

//     ball.set_point({ x: r + 1, y: r + 1 }, 1000, 1000);
//     expect(ball.get_point()).toEqual({ x: r + PLAY_AREA_MIN_X, y: r + 1 });
// });

// test.each(Object.values(BallTypes))("velocity", (ball_type) => {
//     const ball = new Ball(ball_type);
//     ball.set_velocity({ x: 1, y: 1 });
//     expect(ball.get_velocity()).toEqual({ x: 1, y: 1 });
// });

// test.each(Object.values(BallTypes))("move", (ball_type) => {
//     const ball = new Ball(ball_type);
//     const r = ball.get_radius();
//     const velocity = { x: 1, y: 1 };
//     const acceleration = { x: 1, y: 1 };
//     ball.set_acceleration(acceleration);

//     ball.set_velocity(velocity);
//     ball.set_point({ x: 0, y: 0 }, 1000, 1000);
//     ball.move(1000, 1000);
//     expect(ball.get_point()).toEqual({ x: 0 + r + PLAY_AREA_MIN_X + velocity.x, y: 0 + r + velocity.y });
//     expect(ball.get_velocity()).toEqual({ x: velocity.x + acceleration.x, y: velocity.y + acceleration.y });

//     ball.set_velocity(velocity);
//     ball.set_point({ x: 1000, y: 1000 }, 1000, 1000);
//     ball.move(1000, 1000);
//     expect(ball.get_point()).toEqual({ x: 1000 - r, y: 1000 - r });
//     expect(ball.get_velocity()).toEqual({ x: acceleration.x, y: acceleration.y });

//     ball.set_velocity({ x: -1, y: 0 });
//     ball.set_point({ x: 0, y: 0 }, 1000, 1000);
//     ball.move(1000, 1000);
//     expect(ball.get_point()).toEqual({ x: 0 + r + PLAY_AREA_MIN_X, y: r });
// });
