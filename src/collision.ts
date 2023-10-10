import { Ball } from "./ball";
import { ACCEL_SIZE, COEFFICIENT_OF_RESTITUTION } from "./constants";

export function calc_collision(ball: Ball, other: Ball, canvas_width: number, canvas_height: number): boolean {
    // 2点間の距離を求める
    const distance_x = ball.get_point().x - other.get_point().x;
    const distance_y = ball.get_point().y - other.get_point().y;
    const distance = Math.sqrt(Math.pow(distance_x, 2) + Math.pow(distance_y, 2));

    // 2つのボールの半径の和を求める
    const radius_sum = ball.get_radius() + other.get_radius();
    // 2点間の距離が半径の和より小さい場合は衝突している
    if (distance > radius_sum) {
        return false;
    }

    // 重なっている場合は、重なっている分だけボールを移動させる
    const move_distance = radius_sum - distance;
    const move_distance_x = move_distance * (distance_x / distance);
    const move_distance_y = move_distance * (distance_y / distance);

    ball.set_point({ x: ball.get_point().x + move_distance_x / 2, y: ball.get_point().y + move_distance_y / 2 }, canvas_width, canvas_height);
    other.set_point({ x: other.get_point().x - move_distance_x / 2, y: other.get_point().y - move_distance_y / 2 }, canvas_width, canvas_height);

    if (ball.is_upgraded()) {
        const push_velocity = create_horizontal_vector(ball.get_point(), other.get_point(), ACCEL_SIZE);
        other.set_velocity({ x: other.get_velocity().x + push_velocity.x, y: other.get_velocity().y + push_velocity.y });
    }

    // 2次元の衝突後の速度を求める
    const { result_velocity1, result_velocity2 } = calc_collision_velocity(ball, other);
    ball.set_velocity(result_velocity1);
    other.set_velocity(result_velocity2);
    return true;
}

function calc_collision_velocity(ball: Ball, other: Ball): { result_velocity1: Vector2; result_velocity2: Vector2 } {
    const vh1 = calc_horizontal_velocity(ball.get_point(), other.get_point(), ball.get_velocity());
    const vv1 = calc_vertical_velocity(vh1, ball.get_velocity());

    const vh2 = calc_horizontal_velocity(other.get_point(), ball.get_point(), other.get_velocity());
    const vv2 = calc_vertical_velocity(vh2, other.get_velocity());

    const new_vh1 = calc_collision_formula(ball.get_mass(), vh1, COEFFICIENT_OF_RESTITUTION, other.get_mass(), vh2);
    const new_vh2 = calc_collision_formula(other.get_mass(), vh2, COEFFICIENT_OF_RESTITUTION, ball.get_mass(), vh1);

    return { result_velocity1: { x: new_vh1.x + vv1.x, y: new_vh1.y + vv1.y }, result_velocity2: { x: new_vh2.x + vv2.x, y: new_vh2.y + vv2.y } };
}

/// 衝突の公式
function calc_collision_formula(mass: number, velocity: Vector2, bounce: number, col_mass: number, col_velocity: Vector2): Vector2 {
    return {
        x: ((mass - bounce * col_mass) * velocity.x + (1 + bounce) * col_mass * col_velocity.x) / (mass + col_mass),
        y: ((mass - bounce * col_mass) * velocity.y + (1 + bounce) * col_mass * col_velocity.y) / (mass + col_mass),
    };
}

/// 内積の計算
function calc_inner_product(vec: Vector2, UnitVector: Vector2): Vector2 {
    const scalar = vec.x * UnitVector.x + vec.y * UnitVector.y;
    return { x: UnitVector.x * scalar, y: UnitVector.y * scalar };
}

function create_horizontal_vector(pos: Vector2, colPos: Vector2, size: number = 1): Vector2 {
    let dirVector: Vector2 = { x: colPos.x - pos.x, y: colPos.y - pos.y }; // 方向ベクトル

    // 当たった時の軸方向を求める
    if (dirVector.x == 0 && dirVector.y == 0) {
        return { x: 0, y: 0 };
    }

    // 単位ベクトルへ変換
    if (dirVector.x === 0) {
        dirVector.y = dirVector.y > 0 ? size : -size;
    } else if (dirVector.y === 0) {
        dirVector.x = dirVector.x > 0 ? size : -size;
    } else {
        const unitVector = size / Math.sqrt(dirVector.x * dirVector.x + dirVector.y * dirVector.y);
        dirVector.x *= unitVector;
        dirVector.y *= unitVector;
    }
    return dirVector;
}

/// 当たった物の軸に水平な方向ベクトルの計算
function calc_horizontal_velocity(pos: Vector2, colPos: Vector2, myVel: Vector2): Vector2 {
    return calc_inner_product(myVel, create_horizontal_vector(pos, colPos));
}

/// 引数に対して垂直な単位ベクトルの作成
function create_vertical_vector(vector: Vector2): Vector2 {
    if (vector.x === 0 && vector.y === 0) {
        return { x: 0, y: 0 };
    }

    let verticalVector: Vector2 = { x: 0, y: 0 };
    verticalVector.y = Math.sqrt(1 / ((vector.y / vector.x) * (vector.y / vector.x) + 1));
    verticalVector.x = vector.x === 0 ? (vector.y > 0 ? 1 : -1) : -(vector.y * verticalVector.y) / vector.x;
    return verticalVector;
}

/// 与えられたベクトル(axis)に対しての垂直ベクトルを求める
function calc_vertical_velocity(axis: Vector2, myVec: Vector2): Vector2 {
    return calc_inner_product(myVec, create_vertical_vector(axis));
}
