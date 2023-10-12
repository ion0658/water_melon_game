import { expect, test } from "vitest";
import { BallTypes, LARGEST_BALL } from "../constants";
import { Ball } from "../ball";
import { calc_collision } from "../collision";

test.each(Object.values(BallTypes))("collision_different_x", (ball_type) => {
    const ball_1 = new Ball(ball_type);

    for (const other_type of Object.values(BallTypes)) {
        const ball_2 = new Ball(other_type);

        const base_point = { x: LARGEST_BALL.radius + 20, y: LARGEST_BALL.radius + 20 };

        ball_1.set_point(base_point, 1000, 1000);
        ball_2.set_point({ x: base_point.x + ball_1.get_radius() + ball_2.get_radius() + 1, y: base_point.y }, 1000, 1000);
        ball_1.set_velocity({ x: 1, y: 1 });
        ball_2.set_velocity({ x: 1, y: 1 });
        expect(calc_collision(ball_1, ball_2, 1000, 1000)).toBe(false);

        ball_1.set_point(base_point, 1000, 1000);
        ball_2.set_point({ x: base_point.x + ball_1.get_radius() + ball_2.get_radius(), y: base_point.y }, 1000, 1000);
        ball_1.set_velocity({ x: 1, y: -1 });
        ball_2.set_velocity({ x: 1, y: -1 });
        expect(calc_collision(ball_1, ball_2, 1000, 1000)).toBe(true);

        ball_1.set_point(base_point, 1000, 1000);
        ball_2.set_point({ x: base_point.x + ball_1.get_radius() + ball_2.get_radius() - 1, y: base_point.y }, 1000, 1000);
        ball_1.set_velocity({ x: -1, y: 1 });
        ball_2.set_velocity({ x: -1, y: 1 });
        expect(calc_collision(ball_1, ball_2, 1000, 1000)).toBe(true);
    }
});

test.each(Object.values(BallTypes))("collision_different_y", (ball_type) => {
    const ball_1 = new Ball(ball_type);
    for (const other_type of Object.values(BallTypes)) {
        const ball_2 = new Ball(other_type);

        const base_point = { x: LARGEST_BALL.radius + 20, y: LARGEST_BALL.radius + 20 };

        ball_1.set_point(base_point, 1000, 1000);
        ball_2.set_point({ x: base_point.x, y: base_point.x + ball_1.get_radius() + ball_2.get_radius() + 1 }, 1000, 1000);
        ball_1.set_velocity({ x: 1, y: 1 });
        ball_2.set_velocity({ x: 1, y: 1 });
        expect(calc_collision(ball_1, ball_2, 1000, 1000)).toBe(false);

        ball_1.set_point({ x: base_point.x, y: base_point.x + ball_1.get_radius() + ball_2.get_radius() }, 1000, 1000);
        ball_2.set_point(base_point, 1000, 1000);
        ball_1.set_velocity({ x: 1, y: -1 });
        ball_2.set_velocity({ x: 1, y: -1 });
        expect(calc_collision(ball_1, ball_2, 1000, 1000)).toBe(true);

        ball_1.set_point(base_point, 1000, 1000);
        ball_2.set_point({ x: base_point.x, y: base_point.x + ball_1.get_radius() + ball_2.get_radius() - 1 }, 1000, 1000);
        ball_1.set_velocity({ x: -1, y: 1 });
        ball_2.set_velocity({ x: -1, y: 1 });
        expect(calc_collision(ball_1, ball_2, 1000, 1000)).toBe(true);
    }
});

test.each(Object.values(BallTypes))("collision_different_xy", (ball_type) => {
    const ball_1 = new Ball(ball_type);
    for (const other_type of Object.values(BallTypes)) {
        const ball_2 = new Ball(other_type);

        const base_point = { x: LARGEST_BALL.radius + 20, y: LARGEST_BALL.radius + 20 };

        const distance = ball_1.get_radius() + ball_2.get_radius();
        const distance_x = distance / Math.sqrt(2);
        const distance_y = distance / Math.sqrt(2);

        ball_1.set_point(base_point, 1000, 1000);
        ball_2.set_point({ x: base_point.x + distance_x + 1, y: base_point.y + distance_y + 1 }, 1000, 1000);
        ball_1.set_velocity({ x: 1, y: 1 });
        ball_2.set_velocity({ x: 1, y: 1 });
        expect(calc_collision(ball_1, ball_2, 1000, 1000)).toBe(false);

        ball_1.set_point(base_point, 1000, 1000);
        ball_2.set_point({ x: base_point.x + distance_x - 1, y: base_point.y + distance_y - 1 }, 1000, 1000);
        ball_1.set_velocity({ x: -1, y: -1 });
        ball_2.set_velocity({ x: -1, y: -1 });
        expect(calc_collision(ball_1, ball_2, 1000, 1000)).toBe(true);
    }
});

test.each(Object.values(BallTypes))("collision_upgraded_x", (ball_type) => {
    const ball_1 = new Ball(ball_type);
    ball_1.upgrade_ball_type();
    const ball_2 = new Ball(ball_type);
    const base_point = { x: LARGEST_BALL.radius + 20, y: LARGEST_BALL.radius + 20 };

    ball_1.set_point(base_point, 1000, 1000);
    ball_2.set_point({ x: base_point.x + ball_1.get_radius() + ball_2.get_radius() + 1, y: base_point.y }, 1000, 1000);
    ball_1.set_velocity({ x: 1, y: 1 });
    ball_2.set_velocity({ x: 1, y: 1 });
    expect(calc_collision(ball_1, ball_2, 1000, 1000)).toBe(false);

    ball_1.set_point(base_point, 1000, 1000);
    ball_2.set_point({ x: base_point.x + ball_1.get_radius() + ball_2.get_radius(), y: base_point.y }, 1000, 1000);
    ball_1.set_velocity({ x: 1, y: -1 });
    ball_2.set_velocity({ x: 1, y: -1 });
    expect(calc_collision(ball_1, ball_2, 1000, 1000)).toBe(true);

    ball_1.set_point(base_point, 1000, 1000);
    ball_2.set_point({ x: base_point.x + ball_1.get_radius() + ball_2.get_radius() - 1, y: base_point.y }, 1000, 1000);
    ball_1.set_velocity({ x: -1, y: 1 });
    ball_2.set_velocity({ x: -1, y: 1 });
    expect(calc_collision(ball_1, ball_2, 1000, 1000)).toBe(true);
});

test.each(Object.values(BallTypes))("collision_upgraded_y", (ball_type) => {
    const ball_1 = new Ball(ball_type);
    ball_1.upgrade_ball_type();
    const ball_2 = new Ball(ball_type);
    const base_point = { x: LARGEST_BALL.radius + 20, y: LARGEST_BALL.radius + 20 };

    ball_1.set_point(base_point, 1000, 1000);
    ball_2.set_point({ x: base_point.x, y: base_point.x + ball_1.get_radius() + ball_2.get_radius() + 1 }, 1000, 1000);
    ball_1.set_velocity({ x: 1, y: 1 });
    ball_2.set_velocity({ x: 1, y: 1 });
    expect(calc_collision(ball_1, ball_2, 1000, 1000)).toBe(false);

    ball_1.set_point(base_point, 1000, 1000);
    ball_2.set_point({ x: base_point.x, y: base_point.x + ball_1.get_radius() + ball_2.get_radius() }, 1000, 1000);
    ball_1.set_velocity({ x: 1, y: -1 });
    ball_2.set_velocity({ x: 1, y: -1 });
    expect(calc_collision(ball_1, ball_2, 1000, 1000)).toBe(true);

    ball_1.set_point(base_point, 1000, 1000);
    ball_2.set_point({ x: base_point.x, y: base_point.x + ball_1.get_radius() + ball_2.get_radius() - 1 }, 1000, 1000);
    ball_1.set_velocity({ x: -1, y: 1 });
    ball_2.set_velocity({ x: -1, y: 1 });
    expect(calc_collision(ball_1, ball_2, 1000, 1000)).toBe(true);
});

test.each(Object.values(BallTypes))("collision_same_point", (ball_type) => {
    const ball_1 = new Ball(ball_type);
    for (const other_type of Object.values(BallTypes)) {
        const ball_2 = new Ball(other_type);
        const base_point = { x: LARGEST_BALL.radius + 20, y: LARGEST_BALL.radius + 20 };

        ball_1.set_point(base_point, 1000, 1000);
        ball_2.set_point(base_point, 1000, 1000);
        ball_1.set_velocity({ x: 1, y: 1 });
        ball_2.set_velocity({ x: 1, y: 1 });
        expect(calc_collision(ball_1, ball_2, 1000, 1000)).toBe(true);
    }
});
