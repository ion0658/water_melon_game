import { Ball } from "./ball";
import { COEFFICIENT_OF_RESTITUTION } from "./constants";

export function calc_collision(ball: Ball, other: Ball, canvas_width: number, canvas_height: number): boolean {
    // 2点間の距離を求める
    const distance_x = ball.point.x - other.point.x;
    const distance_y = ball.point.y - other.point.y;
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

    ball.set_point({ x: ball.point.x + move_distance_x / 2, y: ball.point.y + move_distance_y / 2 }, canvas_width, canvas_height);
    other.set_point({ x: other.point.x - move_distance_x / 2, y: other.point.y - move_distance_y / 2 }, canvas_width, canvas_height);

    // 2次元の衝突後の速度を求める
    const { result_velocity1, result_velocity2 } = calc_collision_velocity(ball, other);
    ball.set_velocity(result_velocity1);
    other.set_velocity(result_velocity2);
    return true;
}

function calc_collision_velocity(ball: Ball, other: Ball): { result_velocity1: Vector2; result_velocity2: Vector2 } {
    const vh1 = calc_horizontal_velocity(ball.point, other.point, ball.velocity);
    const vv1 = calc_vertical_velocity(vh1, ball.velocity);
    const vh2 = calc_horizontal_velocity(other.point, ball.point, other.velocity);
    const vv2 = calc_vertical_velocity(vh2, other.velocity);
    const new_vh1 = calc_collision_formula(ball.get_mass(), vh1, COEFFICIENT_OF_RESTITUTION, other.get_mass(), vh2);
    const new_vh2 = calc_collision_formula(other.get_mass(), vh2, COEFFICIENT_OF_RESTITUTION, ball.get_mass(), vh1);

    const result_velocity1 = { x: new_vh1.x + vv1.x, y: new_vh1.y + vv1.y };
    const result_velocity2 = { x: new_vh2.x + vv2.x, y: new_vh2.y + vv2.y };
    return { result_velocity1, result_velocity2 };
}

/// 衝突の公式
function calc_collision_formula(mass: number, velocity: Vector2, bounce: number, col_mass: number, col_velocity: Vector2): Vector2 {
    let resultVelocity: Vector2 = { x: 0, y: 0 };
    resultVelocity.x = ((mass - bounce * col_mass) * velocity.x + (1 + bounce) * col_mass * col_velocity.x) / (mass + col_mass);
    resultVelocity.y = ((mass - bounce * col_mass) * velocity.y + (1 + bounce) * col_mass * col_velocity.y) / (mass + col_mass);

    return resultVelocity;
}

/// 内積の計算
function calc_inner_product(vec: Vector2, UnitVector: Vector2): Vector2 {
    const scalar = vec.x * UnitVector.x + vec.y * UnitVector.y;
    return { x: UnitVector.x * scalar, y: UnitVector.y * scalar };
}

/// 当たった物の軸に水平な方向ベクトルの計算
function calc_horizontal_velocity(pos: Vector2, colPos: Vector2, myVel: Vector2): Vector2 {
    let dirVector: Vector2 = { x: colPos.x - pos.x, y: colPos.y - pos.y }; // 方向ベクトル

    // 当たった時の軸方向を求める

    if (dirVector.x == 0 && dirVector.y == 0) {
        return { x: 0, y: 0 };
    }

    // 単位ベクトルへ変換
    if (dirVector.x === 0) {
        dirVector.y = 1;
    } else if (dirVector.y === 0) {
        dirVector.x = 1;
    } else {
        let unitVector = 1 / Math.sqrt(dirVector.x * dirVector.x + dirVector.y * dirVector.y);
        dirVector.x *= unitVector;
        dirVector.y *= unitVector;
    }
    // 当たった者同士の軸方向の内積の大きさのベクトルを求める
    return calc_inner_product(myVel, dirVector);
}

/// 引数に対して垂直な単位ベクトルの作成
function create_vertical_vector(vector: Vector2): Vector2 {
    if (vector.x == 0 && vector.y == 0) {
        return { x: 0, y: 0 };
    }
    let verticalVector: Vector2 = { x: 0, y: 0 };
    verticalVector.y = Math.sqrt(1 / ((vector.y / vector.x) * (vector.y / vector.x) + 1));
    verticalVector.x = vector.x === 0 ? 0 : -(vector.y * verticalVector.y) / vector.x;

    return verticalVector;
}

/// 与えられたベクトル(axis)に対しての垂直ベクトルを求める
function calc_vertical_velocity(axis: Vector2, myVec: Vector2): Vector2 {
    const unitVerticalAxis: Vector2 = create_vertical_vector(axis);
    return calc_inner_product(myVec, unitVerticalAxis);
}
