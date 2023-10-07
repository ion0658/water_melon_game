export const FPS = 60;
const G_ACCEL = 10;
export const COEFFICIENT_OF_RESTITUTION = 0.5;
export const WALL_COEFFICIENT_OF_RESTITUTION = 0;
export const FRAME_TIME_MSEC = 1000 / FPS;
export const FRAME_PER_ACCEL = G_ACCEL / FPS;
export const PLAY_AREA_PADDING = 10;
export const MIN_VELOCITY = FRAME_PER_ACCEL * 2;

export const BallTypes = {
    CHERRY: { radius: 10, color: "#FF0000", mass: 1, score: 1024 },
    STRAWBERRY: { radius: 20, color: "#FF00FF", mass: 2, score: 1 },
    GRAPE: { radius: 30, color: "#7E00FF", mass: 3, score: 2 },
    ORANGE: { radius: 40, color: "#FF9E00", mass: 4, score: 4 },
    PERSIMMON: { radius: 50, color: "#FF7E00", mass: 5, score: 8 },
    APPLE: { radius: 60, color: "#7E0000", mass: 6, score: 16 },
    PEAR: { radius: 70, color: "#7E7E00", mass: 7, score: 32 },
    PEACH: { radius: 80, color: "#FF7EFF", mass: 8, score: 64 },
    PINEAPPLE: { radius: 90, color: "#FFFF00", mass: 9, score: 128 },
    MELON: { radius: 100, color: "#7EFF00", mass: 10, score: 256 },
    WATERMELON: { radius: 110, color: "#00FF00", mass: 11, score: 512 },
} as const;

export type BallType = (typeof BallTypes)[keyof typeof BallTypes];

export const DROPPABLE_BALL_TYPES = [BallTypes.CHERRY, BallTypes.STRAWBERRY, BallTypes.GRAPE, BallTypes.ORANGE, BallTypes.PERSIMMON] as const;
export const DROPPABLE_LARGEST_BALL = DROPPABLE_BALL_TYPES[DROPPABLE_BALL_TYPES.length - 1];
export const LARGEST_BALL = BallTypes.WATERMELON;

const PLAY_AREA_WIDTH = LARGEST_BALL.radius * 3;
export const PLAY_AREA_HEIGHT = LARGEST_BALL.radius * 3;
export const DROP_AREA_HEIGHT = DROPPABLE_LARGEST_BALL.radius * 2 + PLAY_AREA_PADDING;
export const PLAY_AREA_MIN_X = PLAY_AREA_PADDING;
export const PLAY_AREA_MAX_X = PLAY_AREA_PADDING * 2 + PLAY_AREA_WIDTH;

export function get_next_ball_type(current: BallType): BallType {
    switch (current) {
        case BallTypes.CHERRY:
            return BallTypes.STRAWBERRY;
        case BallTypes.STRAWBERRY:
            return BallTypes.GRAPE;
        case BallTypes.GRAPE:
            return BallTypes.ORANGE;
        case BallTypes.ORANGE:
            return BallTypes.PERSIMMON;
        case BallTypes.PERSIMMON:
            return BallTypes.APPLE;
        case BallTypes.APPLE:
            return BallTypes.PEAR;
        case BallTypes.PEAR:
            return BallTypes.PEACH;
        case BallTypes.PEACH:
            return BallTypes.PINEAPPLE;
        case BallTypes.PINEAPPLE:
            return BallTypes.MELON;
        case BallTypes.MELON:
            return BallTypes.WATERMELON;
        case BallTypes.WATERMELON:
            return BallTypes.CHERRY;
    }
    return BallTypes.CHERRY;
}
