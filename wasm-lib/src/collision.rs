use crate::{ball::Ball, constants::COEFFICIENT_OF_RESTITUTION, vector2::Vector2};

pub fn is_collide(ball1: &Ball, ball2: &Ball) -> bool {
    let distance = Vector2::sub(&ball1.get_point(), &ball2.get_point());
    let distance_squared = Vector2::inner_product(&distance, &distance);
    let radius_sum = ball1.get_radius() + ball2.get_radius();
    distance_squared <= radius_sum * radius_sum
}

pub fn calc_collision_move_distance(ball1: &Ball, ball2: &Ball) -> (Vector2, Vector2) {
    let distance_vector = Vector2::sub(&ball1.get_point(), &ball2.get_point());
    let distance = distance_vector.get_size();
    let radius_sum = ball1.get_radius() + ball2.get_radius();
    let move_distance = radius_sum - distance;

    let d1 = Vector2::multiply(
        &distance_vector.create_horizontal_unit_vector(),
        move_distance * 0.5,
    );
    let d2 = Vector2::multiply(
        &distance_vector.create_horizontal_unit_vector(),
        -move_distance * 0.5,
    );
    (d1, d2)
}

pub fn calc_collision_velocity(ball1: &Ball, ball2: &Ball) -> (Vector2, Vector2) {
    let vh1_unit =
        Vector2::sub(&ball1.get_point(), &ball2.get_point()).create_horizontal_unit_vector();

    let vh1 = Vector2::multiply(
        &vh1_unit,
        Vector2::inner_product(&vh1_unit, &ball1.get_velocity()),
    );
    let vv1_unit = vh1_unit.create_vertical_unit_vector();
    let vv1 = Vector2::multiply(
        &vv1_unit,
        Vector2::inner_product(&vv1_unit, &ball1.get_velocity()),
    );

    let vh2_unit =
        Vector2::sub(&ball2.get_point(), &ball1.get_point()).create_horizontal_unit_vector();
    let vh2 = Vector2::multiply(
        &vh2_unit,
        Vector2::inner_product(&vh2_unit, &ball2.get_velocity()),
    );
    let vv2_unit = vh2_unit.create_vertical_unit_vector();
    let vv2 = Vector2::multiply(
        &vv2_unit,
        Vector2::inner_product(&vv2_unit, &ball2.get_velocity()),
    );

    let new_v1 = calc_collision_formula(
        ball1.get_mass(),
        &vh1,
        COEFFICIENT_OF_RESTITUTION,
        ball2.get_mass(),
        &vh2,
    );
    let new_v2 = calc_collision_formula(
        ball2.get_mass(),
        &vh2,
        COEFFICIENT_OF_RESTITUTION,
        ball1.get_mass(),
        &vh1,
    );

    (Vector2::add(&new_v1, &vv1), Vector2::add(&new_v2, &vv2))
}

fn calc_collision_formula(
    mass: f64,
    velocity: &Vector2,
    bounce: f64,
    col_mass: f64,
    col_velocity: &Vector2,
) -> Vector2 {
    Vector2::new(
        ((mass - bounce * col_mass) * velocity.x + (1.0 + bounce) * col_mass * col_velocity.x)
            / (mass + col_mass),
        ((mass - bounce * col_mass) * velocity.y + (1.0 + bounce) * col_mass * col_velocity.y)
            / (mass + col_mass),
    )
}
