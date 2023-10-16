use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Serialize, Deserialize)]
#[repr(C)]
pub struct Vector2 {
    pub x: f64,
    pub y: f64,
}

#[wasm_bindgen]
impl Vector2 {
    pub fn new(x: f64, y: f64) -> Vector2 {
        Vector2 { x, y }
    }

    pub fn add(v1: &Vector2, v2: &Vector2) -> Vector2 {
        Vector2::new(v1.x + v2.x, v1.y + v2.y)
    }

    pub fn sub(v1: &Vector2, v2: &Vector2) -> Vector2 {
        Vector2::new(v1.x - v2.x, v1.y - v2.y)
    }

    pub fn inner_product(v1: &Vector2, v2: &Vector2) -> f64 {
        v1.x * v2.x + v1.y * v2.y
    }

    pub fn multiply(v: &Vector2, scale: f64) -> Vector2 {
        Vector2::new(v.x * scale, v.y * scale)
    }

    pub fn create_vertical_unit_vector(&self) -> Vector2 {
        if self.x == 0.0 && self.y == 0.0 {
            Vector2::new(0.0, 0.0)
        } else {
            let scale = 1.0 / (self.x * self.x + self.y * self.y).sqrt();
            Vector2::new(-self.y * scale, self.x * scale)
        }
    }

    pub fn create_horizontal_unit_vector(self) -> Vector2 {
        if self.x == 0.0 && self.y == 0.0 {
            Vector2::new(0.0, 0.0)
        } else {
            let scale = 1.0 / (self.x * self.x + self.y * self.y).sqrt();
            Vector2::new(self.x * scale, self.y * scale)
        }
    }
}
