import { BallType, MIN_VELOCITY, PLAY_AREA_MIN_X, WALL_COEFFICIENT_OF_RESTITUTION, get_next_ball_type } from "./constants";

export class Ball {
    private _point: Vector2;
    private _velocity: Vector2;
    private _acceleration: Vector2;
    private _ball_type: BallType;
    private _is_upgraded: boolean;

    constructor(ball_type: BallType) {
        this._point = { x: 0, y: 0 };
        this._velocity = { x: 0, y: 0 };
        this._acceleration = { x: 0, y: 0 };
        this._ball_type = ball_type;
        this._is_upgraded = false;
    }

    get_point(): Vector2 {
        return this._point;
    }

    get_velocity(): Vector2 {
        return this._velocity;
    }

    get_radius(): number {
        return this._ball_type.radius;
    }
    get_color(): string {
        return this._ball_type.color;
    }
    get_mass(): number {
        return this._ball_type.mass;
    }
    is_same_ball_type(other: Ball): boolean {
        return this._ball_type === other._ball_type;
    }
    get_score(): number {
        return this._ball_type.score;
    }

    is_upgraded(): boolean {
        return this._is_upgraded;
    }

    upgrade_ball_type() {
        this._ball_type = get_next_ball_type(this._ball_type);
        this._is_upgraded = true;
    }

    set_acceleration(acceleration: Vector2) {
        this._acceleration = acceleration;
    }

    set_velocity(velocity: Vector2) {
        this._velocity = velocity;
    }

    set_point(point: Vector2, max_x: number, max_y: number) {
        this._point = point;
        if (this._point.x + this.get_radius() > max_x) {
            this._point.x = max_x - this.get_radius();
        }
        if (this._point.x - this.get_radius() < PLAY_AREA_MIN_X) {
            this._point.x = this.get_radius() + PLAY_AREA_MIN_X;
        }
        if (this._point.y + this.get_radius() > max_y) {
            this._point.y = max_y - this.get_radius();
        }
        if (this._point.y - this.get_radius() < 0) {
            this._point.y = this.get_radius();
        }
    }

    move(max_x: number, max_y: number) {
        this._is_upgraded = false;
        this._point.x += this._velocity.x;
        this._point.y += this._velocity.y;
        if (this._point.x + this.get_radius() > max_x) {
            this._point.x = max_x - this.get_radius();
            const new_velocity = this._velocity.x * -1 * WALL_COEFFICIENT_OF_RESTITUTION;
            this._velocity.x = Math.abs(new_velocity) > MIN_VELOCITY ? new_velocity : 0;
        }
        if (this._point.x - this.get_radius() < PLAY_AREA_MIN_X) {
            this._point.x = this.get_radius() + PLAY_AREA_MIN_X;
            const new_velocity = this._velocity.x * -1 * WALL_COEFFICIENT_OF_RESTITUTION;
            this._velocity.x = Math.abs(new_velocity) > MIN_VELOCITY ? new_velocity : 0;
        }
        if (this._point.y + this.get_radius() > max_y) {
            this._point.y = max_y - this.get_radius();
            const new_velocity = this._velocity.y * -1 * WALL_COEFFICIENT_OF_RESTITUTION;
            this._velocity.y = Math.abs(new_velocity) > MIN_VELOCITY ? new_velocity : 0;
        }
        this._velocity.x += this._acceleration.x;
        this._velocity.y += this._acceleration.y;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = this.get_color();
        ctx.arc(this._point.x, this._point.y, this.get_radius(), 0, 2 * Math.PI);
        ctx.fill();
    }
}
