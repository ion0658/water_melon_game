export const FPS = 60;
const G_ACCEL = 10;
export const COEFFICIENT_OF_RESTITUTION = 0.8;

export const FRAME_TIME_MSEC = 1000 / FPS;

export const FRAME_PER_ACCEL = G_ACCEL / FPS;

export const BallTypes = {
    CHERRY: { radius: 10, color: "#FF0000", mass: 1, score: 10 },
    STRAWBERRY: { radius: 20, color: "#FF00FF", mass: 2, score: 20 },
    GRAPE: { radius: 30, color: "#7E00FF", mass: 3, score: 30 },
    ORANGE: { radius: 40, color: "#FF9E00", mass: 4, score: 40 },
    PERSIMMON: { radius: 50, color: "#FF7E00", mass: 5, score: 50 },
    APPLE: { radius: 60, color: "#7E0000", mass: 6, score: 60 },
    PEAR: { radius: 70, color: "#7E7E00", mass: 7, score: 70 },
    PINEAPPLE: { radius: 80, color: "#FFFF00", mass: 8, score: 80 },
    MELON: { radius: 90, color: "#7EFF00", mass: 9, score: 90 },
    WATERMELON: { radius: 100, color: "#00FF00", mass: 10, score: 100 },
} as const;

export type BallType = (typeof BallTypes)[keyof typeof BallTypes];

export const DROPPABLE_BALL_TYPES = [BallTypes.CHERRY, BallTypes.STRAWBERRY, BallTypes.GRAPE, BallTypes.ORANGE, BallTypes.PERSIMMON] as const;
export const DROPPABLE_LARGEST_BALL = DROPPABLE_BALL_TYPES[DROPPABLE_BALL_TYPES.length - 1];
export const LARGEST_BALL = BallTypes.WATERMELON;

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
