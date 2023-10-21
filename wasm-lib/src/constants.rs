use crate::{ball_type::BallType, vector2::Vector2};
use once_cell::sync::Lazy;

pub const COEFFICIENT_OF_RESTITUTION: f64 = 0f64;
pub const WALL_COEFFICIENT_OF_RESTITUTION: f64 = 0f64;

const ACCEL_X: f64 = 0f64;
const ACCEL_Y: f64 = 2f64;
pub const ACCEL: Vector2 = Vector2 {
    x: ACCEL_X,
    y: ACCEL_Y,
};
pub static ACCEL_SIZE: Lazy<f64> = Lazy::new(|| (ACCEL_X * ACCEL_X + ACCEL_Y * ACCEL_Y).sqrt());

const LARGEST_BALL_RADIUS: f64 = BallType::get_largest_type().get_radius();
pub const LARGEST_DROPPABLE_BALL_RADIUS: f64 = BallType::get_droppable_last_type().get_radius();

pub const DROP_AREA_HEIGHT: f64 = LARGEST_DROPPABLE_BALL_RADIUS * 4f64 + 10.0;
const BOX_AREA_WIDTH: f64 = BallType::MELON.get_radius() * 4f64;
pub const BOX_AREA_HEIGHT: f64 = LARGEST_BALL_RADIUS * 4f64;
pub const PLAY_AREA: Vector2 = Vector2 {
    x: BOX_AREA_WIDTH,
    y: BOX_AREA_HEIGHT + DROP_AREA_HEIGHT,
};
