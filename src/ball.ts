import { BallType, MIN_VELOCITY, PLAY_AREA_MIN_X, WALL_COEFFICIENT_OF_RESTITUTION, get_next_ball_type } from "./constants";

export class Ball {
    point: Vector2;
    velocity: Vector2;
    acceleration: Vector2;
    ball_type: BallType;

    constructor(ball_type: BallType) {
        this.point = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };
        this.ball_type = ball_type;
    }

    get_radius(): number {
        return this.ball_type.radius;
    }
    get_color(): string {
        return this.ball_type.color;
    }
    get_mass(): number {
        return this.ball_type.mass;
    }
    is_same_ball_type(other: Ball): boolean {
        return this.ball_type === other.ball_type;
    }
    get_score(): number {
        return this.ball_type.score;
    }

    upgrade_ball_type() {
        this.ball_type = get_next_ball_type(this.ball_type);
    }

    set_acceleration(acceleration: Vector2) {
        this.acceleration = acceleration;
    }

    set_velocity(velocity: Vector2) {
        this.velocity = velocity;
    }

    set_point(point: Vector2, max_x: number, max_y: number) {
        this.point = point;
        if (this.point.x + this.get_radius() > max_x) {
            this.point.x = max_x - this.get_radius();
        }
        if (this.point.x - this.get_radius() < PLAY_AREA_MIN_X) {
            this.point.x = this.get_radius() + PLAY_AREA_MIN_X;
        }
        if (this.point.y + this.get_radius() > max_y) {
            this.point.y = max_y - this.get_radius();
        }
        if (this.point.y - this.get_radius() < 0) {
            this.point.y = this.get_radius();
        }
    }

    move(max_x: number, max_y: number) {
        this.point.x += this.velocity.x;
        this.point.y += this.velocity.y;
        if (this.point.x + this.get_radius() > max_x) {
            this.point.x = max_x - this.get_radius();
            const new_velocity = this.velocity.x * -1 * WALL_COEFFICIENT_OF_RESTITUTION;
            this.velocity.x = Math.abs(new_velocity) > MIN_VELOCITY ? new_velocity : 0;
        }
        if (this.point.x - this.get_radius() < PLAY_AREA_MIN_X) {
            this.point.x = this.get_radius() + PLAY_AREA_MIN_X;
            const new_velocity = this.velocity.x * -1 * WALL_COEFFICIENT_OF_RESTITUTION;
            this.velocity.x = Math.abs(new_velocity) > MIN_VELOCITY ? new_velocity : 0;
        }
        if (this.point.y + this.get_radius() > max_y) {
            this.point.y = max_y - this.get_radius();
            const new_velocity = this.velocity.y * -1 * WALL_COEFFICIENT_OF_RESTITUTION;
            this.velocity.y = Math.abs(new_velocity) > MIN_VELOCITY ? new_velocity : 0;
        }
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = this.get_color();
        ctx.arc(this.point.x, this.point.y, this.get_radius(), 0, 2 * Math.PI);
        ctx.fill();
    }
}
