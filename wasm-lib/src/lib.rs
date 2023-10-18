pub mod ball;
pub mod ball_type;
mod collision;
mod constants;
pub mod game;
mod utils;
pub mod vector2;

// Use `wee_alloc` as the global allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
