import { expect, it } from "vitest";
import { Ball } from "../ball";
import { BallTypes, PLAY_AREA_MIN_X } from "../constants";

it("point", () => {
    for (const ball_type of Object.values(BallTypes)) {
        const ball = new Ball(ball_type);
        const r = ball.get_radius();

        ball.set_point({ x: 0, y: 0 }, 1000, 1000);
        expect(ball.get_point()).toEqual({ x: 0 + r + PLAY_AREA_MIN_X, y: 0 + r });

        ball.set_point({ x: 1000, y: 1000 }, 1000, 1000);
        expect(ball.get_point()).toEqual({ x: 1000 - r, y: 1000 - r });

        ball.set_point({ x: r - 1, y: r - 1 }, 1000, 1000);
        expect(ball.get_point()).toEqual({ x: r + PLAY_AREA_MIN_X, y: r });

        ball.set_point({ x: 1000 - r + 1, y: 1000 - r + 1 }, 1000, 1000);
        expect(ball.get_point()).toEqual({ x: 1000 - r, y: 1000 - r });

        ball.set_point({ x: r, y: r }, 1000, 1000);
        expect(ball.get_point()).toEqual({ x: r + PLAY_AREA_MIN_X, y: r });

        ball.set_point({ x: 1000 - r, y: 1000 - r }, 1000, 1000);
        expect(ball.get_point()).toEqual({ x: 1000 - r, y: 1000 - r });

        ball.set_point({ x: r + 1, y: r + 1 }, 1000, 1000);
        expect(ball.get_point()).toEqual({ x: r + PLAY_AREA_MIN_X, y: r + 1 });
    }
});

it("upgrade_ball_type", () => {
    const cherry = new Ball(BallTypes.CHERRY);
    const strawberry = new Ball(BallTypes.STRAWBERRY);
    const grape = new Ball(BallTypes.GRAPE);
    const orange = new Ball(BallTypes.ORANGE);
    const persimmon = new Ball(BallTypes.PERSIMMON);
    const apple = new Ball(BallTypes.APPLE);
    const pear = new Ball(BallTypes.PEAR);
    const peach = new Ball(BallTypes.PEACH);
    const pineapple = new Ball(BallTypes.PINEAPPLE);
    const melon = new Ball(BallTypes.MELON);
    const watermelon = new Ball(BallTypes.WATERMELON);

    let ball = new Ball(BallTypes.CHERRY);

    ball.upgrade_ball_type();
    expect(ball.is_same_ball_type(strawberry)).toBe(true);
    expect(ball.is_upgraded()).toBe(true);
    ball.move(1, 2);
    expect(ball.is_upgraded()).toBe(false);

    ball.upgrade_ball_type();
    expect(ball.is_same_ball_type(grape)).toBe(true);
    expect(ball.is_upgraded()).toBe(true);
    ball.move(1, 2);
    expect(ball.is_upgraded()).toBe(false);

    ball.upgrade_ball_type();
    expect(ball.is_same_ball_type(orange)).toBe(true);
    expect(ball.is_upgraded()).toBe(true);
    ball.move(1, 2);
    expect(ball.is_upgraded()).toBe(false);

    ball.upgrade_ball_type();
    expect(ball.is_same_ball_type(persimmon)).toBe(true);
    expect(ball.is_upgraded()).toBe(true);
    ball.move(1, 2);
    expect(ball.is_upgraded()).toBe(false);

    ball.upgrade_ball_type();
    expect(ball.is_same_ball_type(apple)).toBe(true);
    expect(ball.is_upgraded()).toBe(true);
    ball.move(1, 2);
    expect(ball.is_upgraded()).toBe(false);

    ball.upgrade_ball_type();
    expect(ball.is_same_ball_type(pear)).toBe(true);
    expect(ball.is_upgraded()).toBe(true);
    ball.move(1, 2);
    expect(ball.is_upgraded()).toBe(false);

    ball.upgrade_ball_type();
    expect(ball.is_same_ball_type(peach)).toBe(true);
    expect(ball.is_upgraded()).toBe(true);
    ball.move(1, 2);
    expect(ball.is_upgraded()).toBe(false);

    ball.upgrade_ball_type();
    expect(ball.is_same_ball_type(pineapple)).toBe(true);
    expect(ball.is_upgraded()).toBe(true);
    ball.move(1, 2);
    expect(ball.is_upgraded()).toBe(false);

    ball.upgrade_ball_type();
    expect(ball.is_same_ball_type(melon)).toBe(true);
    expect(ball.is_upgraded()).toBe(true);
    ball.move(1, 2);
    expect(ball.is_upgraded()).toBe(false);

    ball.upgrade_ball_type();
    expect(ball.is_same_ball_type(watermelon)).toBe(true);
    expect(ball.is_upgraded()).toBe(true);
    ball.move(1, 2);
    expect(ball.is_upgraded()).toBe(false);

    ball.upgrade_ball_type();
    expect(ball.is_same_ball_type(cherry)).toBe(true);
    expect(ball.is_upgraded()).toBe(true);
    ball.move(1, 2);
    expect(ball.is_upgraded()).toBe(false);
});
