import { BallType } from "wasm-lib";

interface Vector2 {
    x: number;
    y: number;
}

interface TickBall {
    point: Vector2;
    center_line: Vector2;
    ball_type: string;
}
