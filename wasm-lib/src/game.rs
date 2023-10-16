use crate::{
    ball::Ball,
    collision::{calc_collision_velocity, is_collid},
    constants::{
        ACCEL, ACCEL_SIZE, BOX_AREA_HEIGHT, DROP_AREA_HEIGHT, LARGEST_DROPPABLE_BALL_RADIUS,
        PLAY_AREA,
    },
    vector2::Vector2,
};
use rand::prelude::*;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct Game {
    fps: u64,
    balls: Vec<Ball>,
    drop_queue: [Ball; 2],
}

#[wasm_bindgen]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TickData {
    balls: Vec<Ball>,
    drop_queue: [Ball; 2],
}

#[wasm_bindgen]
impl Game {
    pub fn new(fps: u64) -> Self {
        let mut rng = rand::thread_rng();
        Self {
            fps,
            balls: vec![],
            drop_queue: [
                Ball::new(rng.sample(rand::distributions::Standard)),
                Ball::new(rng.sample(rand::distributions::Standard)),
            ],
        }
    }

    pub fn drop(&mut self, padding: f64) {
        let mut rng = rand::thread_rng();
        let mut first = self.drop_queue[0];
        let mut second = self.drop_queue[1];
        let new_ball = Ball::new(rng.sample(rand::distributions::Standard));
        second.set_point(&first.get_point(), &PLAY_AREA);
        first.set_point(
            &Vector2::add(
                &first.get_point(),
                &Vector2::new(
                    ACCEL.x / self.fps as f64,
                    DROP_AREA_HEIGHT - (first.get_radius() * 2f64)
                        + (ACCEL.y / self.fps as f64)
                        + padding,
                ),
            ),
            &PLAY_AREA,
        );
        first.set_acceleration(&Vector2::multiply(&ACCEL, 1.0 / self.fps as f64));

        self.balls.push(first);
        self.drop_queue[0] = second;
        self.drop_queue[1] = new_ball;
    }

    pub fn set_drop_x(&mut self, x: f64) {
        let mut first = self.drop_queue[0];
        first.set_point(&Vector2::new(x, first.get_point().y), &PLAY_AREA);
        self.drop_queue[0] = first;
    }

    pub fn is_game_over(&self) -> bool {
        self.balls
            .iter()
            .any(|ball| ball.get_point().y + ball.get_radius() < PLAY_AREA.y - BOX_AREA_HEIGHT)
    }

    pub fn tick(&mut self) -> Result<JsValue, JsValue> {
        let mut i = 0;
        while i < self.balls.len() {
            let mut ball = self.balls[i];
            ball.next(&PLAY_AREA, *ACCEL_SIZE / self.fps as f64);
            let mut j = i + 1;
            while j < self.balls.len() {
                let mut other = self.balls[j];
                if is_collid(&ball, &other) {
                    if ball.is_same_type(&other) {
                        ball.revolute();
                        ball.set_velocity(
                            &Vector2::multiply(
                                &Vector2::add(&ball.get_velocity(), &other.get_velocity()),
                                0.5f64,
                            ),
                            *ACCEL_SIZE / self.fps as f64,
                        );
                        self.balls.remove(j);
                    } else {
                        let col_res = calc_collision_velocity(&ball, &other);
                        ball.set_velocity(&col_res.v1, *ACCEL_SIZE / self.fps as f64);
                        other.set_velocity(&col_res.v2, *ACCEL_SIZE / self.fps as f64);
                        self.balls[j] = other;
                    }
                }
                j += 1;
            }
            self.balls[i] = ball;
            i += 1;
        }
        let tick_data = TickData {
            balls: self.balls.clone(),
            drop_queue: self.drop_queue,
        };
        Ok(serde_wasm_bindgen::to_value(&tick_data)?)
    }
}

#[wasm_bindgen]
pub fn reset(fps: u64) -> Game {
    Game::new(fps)
}

#[wasm_bindgen]
pub fn get_play_area() -> Vector2 {
    PLAY_AREA
}

#[wasm_bindgen]
pub fn get_droppable_large_ball_radius() -> f64 {
    LARGEST_DROPPABLE_BALL_RADIUS
}

#[wasm_bindgen]
pub fn get_drop_area_height() -> f64 {
    DROP_AREA_HEIGHT
}
