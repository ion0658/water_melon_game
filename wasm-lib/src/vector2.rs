use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Serialize, Deserialize)]
pub struct Vector2 {
    pub x: f64,
    pub y: f64,
}

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

    pub fn get_intermediate_point(v1: &Vector2, v2: &Vector2, ratio: f64) -> Vector2 {
        Vector2::multiply(&Vector2::add(&v1, &v2), ratio)
    }

    pub fn get_size(&self) -> f64 {
        (self.x * self.x + self.y * self.y).sqrt()
    }

    pub fn create_vertical_unit_vector(&self) -> Vector2 {
        if self.x == 0.0 && self.y == 0.0 {
            Vector2::new(0.0, 0.0)
        } else {
            let scale = 1.0 / self.get_size();
            Vector2::multiply(&Vector2::new(-self.y, self.x), scale)
        }
    }

    pub fn create_horizontal_unit_vector(self) -> Vector2 {
        if self.x == 0.0 && self.y == 0.0 {
            Vector2::new(0.0, 0.0)
        } else {
            let scale = 1.0 / self.get_size();
            Vector2::multiply(&self, scale)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn vector_add() {
        let v1 = Vector2::new(1.0, 2.0);
        let v2 = Vector2::new(3.0, 4.0);
        let v3 = Vector2::add(&v1, &v2);
        assert_eq!(v3.x, 4.0);
        assert_eq!(v3.y, 6.0);
    }
    #[test]
    fn vector_sub() {
        let v1 = Vector2::new(1.0, 2.0);
        let v2 = Vector2::new(3.0, 4.0);
        let v3 = Vector2::sub(&v1, &v2);
        assert_eq!(v3.x, -2.0);
        assert_eq!(v3.y, -2.0);
    }

    #[test]
    fn vector_inner_product() {
        let v1 = Vector2::new(1.0, 2.0);
        let v2 = Vector2::new(3.0, 4.0);
        let v3 = Vector2::inner_product(&v1, &v2);
        assert_eq!(v3, 11.0);
    }

    #[test]
    fn vector_multiply() {
        let v1 = Vector2::new(1.0, 2.0);
        let v2 = Vector2::multiply(&v1, 3.0);
        assert_eq!(v2.x, 3.0);
        assert_eq!(v2.y, 6.0);
    }

    #[test]
    fn vector_get_intermediate_point() {
        let v1 = Vector2::new(1.0, 2.0);
        let v2 = Vector2::new(3.0, 4.0);
        let v3 = Vector2::get_intermediate_point(&v1, &v2, 0.5);
        assert_eq!(v3.x, 2.0);
        assert_eq!(v3.y, 3.0);
    }

    #[test]
    fn vector_get_size() {
        let v1 = Vector2::new(3.0, 4.0);
        let v2 = v1.get_size();
        assert_eq!(v2, 5.0);
    }

    #[test]
    fn vector_create_vertical_unit_vector() {
        let v1 = Vector2::new(3.0, 4.0);
        let v2 = v1.create_vertical_unit_vector();
        let v3 = Vector2::multiply(&v1, 1.0 / v1.get_size());
        assert_eq!(v2.x, -v3.y);
        assert_eq!(v2.y, v3.x);
    }

    #[test]
    fn vector_create_horizontal_unit_vector() {
        let v1 = Vector2::new(3.0, 4.0);
        let v2 = v1.create_horizontal_unit_vector();
        let v3 = Vector2::multiply(&v1, 1.0 / v1.get_size());
        assert_eq!(v2.x, v3.x);
        assert_eq!(v2.y, v3.y);
    }

    #[test]
    fn vector_create_vertical_unit_vector_zero() {
        let v1 = Vector2::new(0.0, 0.0);
        let v2 = v1.create_vertical_unit_vector();
        assert_eq!(v2.x, 0.0);
        assert_eq!(v2.y, 0.0);
    }

    #[test]
    fn vector_create_horizontal_unit_vector_zero() {
        let v1 = Vector2::new(0.0, 0.0);
        let v2 = v1.create_horizontal_unit_vector();
        assert_eq!(v2.x, 0.0);
        assert_eq!(v2.y, 0.0);
    }
}
