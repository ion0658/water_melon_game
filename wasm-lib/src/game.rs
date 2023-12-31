use crate::{
    ball::Ball,
    collision::{calc_collision_move_distance, calc_collision_velocity, is_collide},
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
#[derive(Debug, Clone)]
pub struct Game {
    fps: u64,
    is_ready_to_drop: bool,
    score: u64,
    balls: Vec<Ball>,
    drop_queue: [Ball; 2],
    rng: ThreadRng,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TickData {
    balls: Vec<Ball>,
    drop_queue: [Ball; 2],
    score: u64,
}

#[wasm_bindgen]
impl Game {
    pub fn new(fps: u64) -> Self {
        let mut rng = rand::thread_rng();
        Self {
            fps,
            is_ready_to_drop: true,
            score: 0,
            balls: vec![],
            drop_queue: [
                Ball::new(rng.sample(rand::distributions::Standard)),
                Ball::new(rng.sample(rand::distributions::Standard)),
            ],
            rng,
        }
    }

    fn is_droppable(&self) -> bool {
        self.is_ready_to_drop
    }

    pub fn drop(&mut self, padding: f64) {
        if !self.is_droppable() {
            return;
        }
        self.is_ready_to_drop = false;
        let mut first = self.drop_queue[0];
        let mut second = self.drop_queue[1];
        let new_ball = Ball::new(self.rng.sample(rand::distributions::Standard));
        second.set_point(&first.get_point(), &PLAY_AREA);
        first.set_point(
            &Vector2::new(
                first.get_point().x + ACCEL.x / self.fps as f64,
                ACCEL.y / self.fps as f64 + DROP_AREA_HEIGHT - first.get_radius() + padding,
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

    fn tick_impl(&mut self) -> TickData {
        let mut i = 0;
        while i < self.balls.len() {
            let mut ball = self.balls[i];
            ball.next(&PLAY_AREA, *ACCEL_SIZE / self.fps as f64);

            if !self.is_droppable()
                && i == self.balls.len() - 1
                && ball.get_point().y - ball.get_radius() > DROP_AREA_HEIGHT + 10.0
            {
                self.is_ready_to_drop = true;
            }

            let mut j = i + 1;
            while j < self.balls.len() {
                let mut other = self.balls[j];
                if is_collide(&ball, &other) {
                    if !self.is_droppable() && j == self.balls.len() - 1 {
                        self.is_ready_to_drop = true;
                    }
                    if ball.is_same_type(&other) {
                        ball.revolute();
                        self.score += ball.get_score();
                        ball.set_point(
                            &Vector2::get_intermediate_point(
                                &ball.get_point(),
                                &other.get_point(),
                                0.5,
                            ),
                            &PLAY_AREA,
                        );
                        ball.set_velocity(
                            &Vector2::get_intermediate_point(
                                &ball.get_velocity(),
                                &other.get_velocity(),
                                0.5,
                            ),
                            *ACCEL_SIZE / self.fps as f64,
                        );
                        self.balls.remove(j);
                        j = i;
                    } else {
                        let (d1, d2) = calc_collision_move_distance(&ball, &other);
                        let (v1, v2) = calc_collision_velocity(&ball, &other);
                        ball.set_point(&Vector2::add(&ball.get_point(), &d1), &PLAY_AREA);
                        other.set_point(&Vector2::add(&other.get_point(), &d2), &PLAY_AREA);
                        ball.set_velocity(&v1, *ACCEL_SIZE / self.fps as f64);
                        other.set_velocity(&v2, *ACCEL_SIZE / self.fps as f64);
                        if ball.is_upgraded() {
                            let add_vel1 =
                                Vector2::multiply(&d1.create_horizontal_unit_vector(), *ACCEL_SIZE);
                            let add_vel2 =
                                Vector2::multiply(&d2.create_horizontal_unit_vector(), *ACCEL_SIZE);
                            ball.set_velocity(
                                &Vector2::add(&ball.get_velocity(), &add_vel1),
                                *ACCEL_SIZE / self.fps as f64,
                            );
                            other.set_velocity(
                                &Vector2::add(&other.get_velocity(), &add_vel2),
                                *ACCEL_SIZE / self.fps as f64,
                            );
                        }

                        self.balls[j] = other;
                    }
                }
                j += 1;
            }
            self.balls[i] = ball;
            i += 1;
        }
        TickData {
            balls: self.balls.clone(),
            drop_queue: self.drop_queue,
            score: self.score,
        }
    }

    #[cfg(target_arch = "wasm32")]
    pub fn tick(&mut self) -> Result<JsValue, JsValue> {
        let tick_data = self.tick_impl();
        Ok(serde_wasm_bindgen::to_value(&tick_data)?)
    }
}

#[cfg(not(target_arch = "wasm32"))]
impl Game {
    pub fn tick(&mut self) -> TickData {
        self.tick_impl()
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
