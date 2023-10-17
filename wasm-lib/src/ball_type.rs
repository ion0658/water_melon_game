use rand::{distributions::Standard, prelude::Distribution};
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[repr(i32)]
pub enum BallType {
    CHERRY,
    STRAWBERRY,
    GRAPE,
    ORANGE,
    PERSIMMON,
    APPLE,
    PEAR,
    PEACH,
    PINEAPPLE,
    MELON,
    WATERMELON,
}

impl BallType {
    pub const fn get_largest_type() -> BallType {
        BallType::WATERMELON
    }

    pub const fn get_droppable_last_type() -> BallType {
        BallType::PERSIMMON
    }

    pub const fn get_radius(&self) -> f64 {
        match self {
            BallType::CHERRY => 10f64,
            BallType::STRAWBERRY => 20f64,
            BallType::GRAPE => 30f64,
            BallType::ORANGE => 40f64,
            BallType::PERSIMMON => 50f64,
            BallType::APPLE => 60f64,
            BallType::PEAR => 70f64,
            BallType::PEACH => 80f64,
            BallType::PINEAPPLE => 90f64,
            BallType::MELON => 100f64,
            BallType::WATERMELON => 110f64,
        }
    }

    pub const fn get_color(&self) -> &str {
        match self {
            BallType::CHERRY => "#FF0000",
            BallType::STRAWBERRY => "#FF00FF",
            BallType::GRAPE => "#7E00FF",
            BallType::ORANGE => "#FF9E00",
            BallType::PERSIMMON => "#FF7E00",
            BallType::APPLE => "#7E0000",
            BallType::PEAR => "#7E7E00",
            BallType::PEACH => "#FF7EFF",
            BallType::PINEAPPLE => "#FFFF00",
            BallType::MELON => "#7EFF00",
            BallType::WATERMELON => "#00FF00",
        }
    }

    pub const fn get_mass(&self) -> f64 {
        match self {
            BallType::CHERRY => 1f64,
            BallType::STRAWBERRY => 1f64,
            BallType::GRAPE => 1f64,
            BallType::ORANGE => 1f64,
            BallType::PERSIMMON => 1f64,
            BallType::APPLE => 2f64,
            BallType::PEAR => 2f64,
            BallType::PEACH => 2f64,
            BallType::PINEAPPLE => 2f64,
            BallType::MELON => 2f64,
            BallType::WATERMELON => 2f64,
        }
    }

    pub const fn get_score(&self) -> u64 {
        match self {
            BallType::CHERRY => 1024,
            BallType::STRAWBERRY => 1,
            BallType::GRAPE => 2,
            BallType::ORANGE => 4,
            BallType::PERSIMMON => 8,
            BallType::APPLE => 16,
            BallType::PEAR => 32,
            BallType::PEACH => 64,
            BallType::PINEAPPLE => 128,
            BallType::MELON => 256,
            BallType::WATERMELON => 512,
        }
    }

    pub const fn get_next_type(&self) -> BallType {
        match self {
            BallType::CHERRY => BallType::STRAWBERRY,
            BallType::STRAWBERRY => BallType::GRAPE,
            BallType::GRAPE => BallType::ORANGE,
            BallType::ORANGE => BallType::PERSIMMON,
            BallType::PERSIMMON => BallType::APPLE,
            BallType::APPLE => BallType::PEAR,
            BallType::PEAR => BallType::PEACH,
            BallType::PEACH => BallType::PINEAPPLE,
            BallType::PINEAPPLE => BallType::MELON,
            BallType::MELON => BallType::WATERMELON,
            BallType::WATERMELON => BallType::CHERRY,
        }
    }
}

impl From<&str> for BallType {
    fn from(s: &str) -> Self {
        match s {
            "CHERRY" => BallType::CHERRY,
            "STRAWBERRY" => BallType::STRAWBERRY,
            "GRAPE" => BallType::GRAPE,
            "ORANGE" => BallType::ORANGE,
            "PERSIMMON" => BallType::PERSIMMON,
            "APPLE" => BallType::APPLE,
            "PEAR" => BallType::PEAR,
            "PEACH" => BallType::PEACH,
            "PINEAPPLE" => BallType::PINEAPPLE,
            "MELON" => BallType::MELON,
            "WATERMELON" => BallType::WATERMELON,
            _ => {
                unreachable!();
            }
        }
    }
}

impl Distribution<BallType> for Standard {
    fn sample<R: rand::Rng + ?Sized>(&self, rng: &mut R) -> BallType {
        match rng.gen_range(0..5) {
            0 => BallType::CHERRY,
            1 => BallType::STRAWBERRY,
            2 => BallType::GRAPE,
            3 => BallType::ORANGE,
            4 => BallType::PERSIMMON,
            _ => {
                unreachable!();
            }
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn from_str() {
        assert_eq!(BallType::from("CHERRY"), BallType::CHERRY);
        assert_eq!(BallType::from("STRAWBERRY"), BallType::STRAWBERRY);
        assert_eq!(BallType::from("GRAPE"), BallType::GRAPE);
        assert_eq!(BallType::from("ORANGE"), BallType::ORANGE);
        assert_eq!(BallType::from("PERSIMMON"), BallType::PERSIMMON);
        assert_eq!(BallType::from("APPLE"), BallType::APPLE);
        assert_eq!(BallType::from("PEAR"), BallType::PEAR);
        assert_eq!(BallType::from("PEACH"), BallType::PEACH);
        assert_eq!(BallType::from("PINEAPPLE"), BallType::PINEAPPLE);
        assert_eq!(BallType::from("MELON"), BallType::MELON);
        assert_eq!(BallType::from("WATERMELON"), BallType::WATERMELON);
    }

    #[test]
    #[should_panic]
    fn from_str_panic() {
        let _ = BallType::from("INVALID");
    }
}
