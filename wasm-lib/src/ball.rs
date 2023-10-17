use crate::{
    ball_type::BallType,
    constants::{PLAY_AREA, WALL_COEFFICIENT_OF_RESTITUTION},
    vector2::Vector2,
};
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct Ball {
    point: Vector2,
    velocity: Vector2,
    acceleration: Vector2,
    ball_type: BallType,
    upgraded: bool,
}

impl Ball {
    pub fn new(ball_type: BallType) -> Self {
        let mut me = Self {
            point: Vector2::new(ball_type.get_radius(), 0.0),
            velocity: Vector2::new(0.0, 0.0),
            acceleration: Vector2::new(0.0, 0.0),
            ball_type,
            upgraded: false,
        };
        me.set_point(&me.get_point(), &PLAY_AREA);
        me
    }

    pub fn set_point(&mut self, point: &Vector2, max: &Vector2) {
        self.point = *point;
        if self.point.x < self.get_radius() {
            self.point.x = self.get_radius();
        } else if self.point.x > max.x - self.get_radius() {
            self.point.x = max.x - self.get_radius();
        }

        if self.point.y < self.get_radius() {
            self.point.y = self.get_radius();
        } else if self.point.y > max.y - self.get_radius() {
            self.point.y = max.y - self.get_radius();
        }
    }

    pub fn set_velocity(&mut self, velocity: &Vector2, min: f64) {
        self.velocity = *velocity;
        if self.velocity.x.abs() < min {
            self.velocity.x = 0.0;
        }
        if self.velocity.y.abs() < min {
            self.velocity.y = 0.0;
        }
    }

    pub fn set_acceleration(&mut self, acceleration: &Vector2) {
        self.acceleration = *acceleration;
    }

    pub fn get_point(&self) -> Vector2 {
        self.point
    }

    pub fn get_velocity(&self) -> Vector2 {
        self.velocity
    }

    pub fn get_acceleration(&self) -> Vector2 {
        self.acceleration
    }

    pub fn get_radius(&self) -> f64 {
        self.ball_type.get_radius()
    }

    pub fn get_color(&self) -> String {
        self.ball_type.get_color().into()
    }

    pub fn get_mass(&self) -> f64 {
        self.ball_type.get_mass()
    }

    pub fn get_score(&self) -> u64 {
        self.ball_type.get_score()
    }

    pub fn revolute(&mut self) {
        self.ball_type = self.ball_type.get_next_type();
        self.upgraded = true;
    }

    pub fn is_same_type(&self, ball: &Ball) -> bool {
        self.ball_type == ball.ball_type
    }

    pub fn is_upgraded(&self) -> bool {
        self.upgraded
    }

    pub fn next(&mut self, max: &Vector2, v_min: f64) {
        self.upgraded = false;
        let new_point = Vector2::add(&self.get_point(), &self.get_velocity());
        if new_point.x < self.get_radius() || new_point.x > max.x - self.get_radius() {
            self.set_velocity(
                &Vector2::new(
                    -self.get_velocity().x * WALL_COEFFICIENT_OF_RESTITUTION,
                    self.get_velocity().y,
                ),
                v_min,
            );
        }

        if new_point.y < self.get_radius() || new_point.y > max.y - self.get_radius() {
            self.set_velocity(
                &Vector2::new(
                    self.get_velocity().x,
                    -self.get_velocity().y * WALL_COEFFICIENT_OF_RESTITUTION,
                ),
                v_min,
            );
        }
        self.set_point(&new_point, max);
        self.set_velocity(
            &Vector2::add(&self.get_velocity(), &self.get_acceleration()),
            v_min,
        );
    }
}

#[wasm_bindgen]
pub fn get_radius(ball_type: &str) -> f64 {
    let ball_type = BallType::from(ball_type);
    ball_type.get_radius()
}

#[wasm_bindgen]
pub fn get_color(ball_type: &str) -> String {
    let ball_type = BallType::from(ball_type);
    ball_type.get_color().into()
}

#[wasm_bindgen]
pub fn get_score(ball_type: &str) -> u64 {
    let ball_type = BallType::from(ball_type);
    ball_type.get_score()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn set_point() {
        let mut ball = Ball::new(BallType::CHERRY);
        let point = Vector2::new(10.0, 10.0);
        let max = Vector2::new(100.0, 100.0);
        ball.set_point(&point, &max);
        assert_eq!(ball.get_point(), point);
        let point = Vector2::new(0.0, 0.0);
        ball.set_point(&point, &max);
        assert_eq!(
            ball.get_point(),
            Vector2::new(ball.get_radius(), ball.get_radius())
        );
        let point = Vector2::new(100.0, 100.0);
        ball.set_point(&point, &max);
        assert_eq!(
            ball.get_point(),
            Vector2::new(max.x - ball.get_radius(), max.y - ball.get_radius())
        );
    }

    #[test]
    fn set_velocity() {
        let mut ball = Ball::new(BallType::CHERRY);
        let velocity = Vector2::new(10.0, 10.0);
        let min = 1.0;
        ball.set_velocity(&velocity, min);
        assert_eq!(ball.get_velocity(), velocity);
        let velocity = Vector2::new(min - 0.1, min - 0.1);
        ball.set_velocity(&velocity, min);
        assert_eq!(ball.get_velocity(), Vector2::new(0.0, 0.0));
    }

    #[test]
    fn set_acceleration() {
        let mut ball = Ball::new(BallType::CHERRY);
        let acceleration = Vector2::new(10.0, 10.0);
        ball.set_acceleration(&acceleration);
        assert_eq!(ball.get_acceleration(), acceleration);
    }

    #[test]
    fn revolute() {
        let mut ball = Ball::new(BallType::CHERRY);
        assert!(ball.is_same_type(&Ball::new(BallType::CHERRY)));
        ball.revolute();
        assert!(ball.is_same_type(&Ball::new(BallType::STRAWBERRY)));
        ball.revolute();
        assert!(ball.is_same_type(&Ball::new(BallType::GRAPE)));
        ball.revolute();
        assert!(ball.is_same_type(&Ball::new(BallType::ORANGE)));
        ball.revolute();
        assert!(ball.is_same_type(&Ball::new(BallType::PERSIMMON)));
        ball.revolute();
        assert!(ball.is_same_type(&Ball::new(BallType::APPLE)));
        ball.revolute();
        assert!(ball.is_same_type(&Ball::new(BallType::PEAR)));
        ball.revolute();
        assert!(ball.is_same_type(&Ball::new(BallType::PEACH)));
        ball.revolute();
        assert!(ball.is_same_type(&Ball::new(BallType::PINEAPPLE)));
        ball.revolute();
        assert!(ball.is_same_type(&Ball::new(BallType::MELON)));
        ball.revolute();
        assert!(ball.is_same_type(&Ball::new(BallType::WATERMELON)));
        ball.revolute();
        assert!(ball.is_same_type(&Ball::new(BallType::CHERRY)));
    }
}
