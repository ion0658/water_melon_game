export const FPS = 500;
export let Y_G_ACCEL = 2;
export let X_G_ACCEL = 0;
export let ACCEL_SIZE = Math.sqrt(Y_G_ACCEL * Y_G_ACCEL + X_G_ACCEL * X_G_ACCEL);
export let COEFFICIENT_OF_RESTITUTION = 0;
export let WALL_COEFFICIENT_OF_RESTITUTION = 0;
export const FRAME_TIME_MSEC = 1000 / FPS;
export let Y_FRAME_PER_ACCEL = Y_G_ACCEL / FPS;
export let X_FRAME_PER_ACCEL = X_G_ACCEL / FPS;
let FRAME_PER_ACCEL = ACCEL_SIZE / FPS;
export const PLAY_AREA_PADDING = 10;
export let MIN_VELOCITY = FRAME_PER_ACCEL * 2;

export const BallTypes = {
    CHERRY: { radius: 10, color: "#FF0000", mass: 1, score: 1024 },
    STRAWBERRY: { radius: 20, color: "#FF00FF", mass: 1, score: 1 },
    GRAPE: { radius: 30, color: "#7E00FF", mass: 1, score: 2 },
    ORANGE: { radius: 40, color: "#FF9E00", mass: 1, score: 4 },
    PERSIMMON: { radius: 50, color: "#FF7E00", mass: 1, score: 8 },
    APPLE: { radius: 60, color: "#7E0000", mass: 2, score: 16 },
    PEAR: { radius: 70, color: "#7E7E00", mass: 2, score: 32 },
    PEACH: { radius: 80, color: "#FF7EFF", mass: 2, score: 64 },
    PINEAPPLE: { radius: 90, color: "#FFFF00", mass: 2, score: 128 },
    MELON: { radius: 100, color: "#7EFF00", mass: 2, score: 256 },
    WATERMELON: { radius: 110, color: "#00FF00", mass: 2, score: 512 },
};

export type BallType = (typeof BallTypes)[keyof typeof BallTypes];

export const DROPPABLE_BALL_TYPES = [BallTypes.CHERRY, BallTypes.STRAWBERRY, BallTypes.GRAPE, BallTypes.ORANGE, BallTypes.PERSIMMON] as const;
export const DROPPABLE_LARGEST_BALL = DROPPABLE_BALL_TYPES[DROPPABLE_BALL_TYPES.length - 1];
export const LARGEST_BALL = BallTypes.WATERMELON;

const PLAY_AREA_WIDTH = LARGEST_BALL.radius * 3;
export const PLAY_AREA_HEIGHT = LARGEST_BALL.radius * 4;
export const DROP_AREA_HEIGHT = DROPPABLE_LARGEST_BALL.radius * 2 + PLAY_AREA_PADDING;
export const PLAY_AREA_MIN_X = PLAY_AREA_PADDING;
export const PLAY_AREA_MAX_X = PLAY_AREA_PADDING * 2 + PLAY_AREA_WIDTH;

export function get_next_ball_type(current: BallType): BallType {
    switch (current) {
        case BallTypes.CHERRY:
            return BallTypes.STRAWBERRY;
        case BallTypes.STRAWBERRY:
            return BallTypes.GRAPE;
        case BallTypes.GRAPE:
            return BallTypes.ORANGE;
        case BallTypes.ORANGE:
            return BallTypes.PERSIMMON;
        case BallTypes.PERSIMMON:
            return BallTypes.APPLE;
        case BallTypes.APPLE:
            return BallTypes.PEAR;
        case BallTypes.PEAR:
            return BallTypes.PEACH;
        case BallTypes.PEACH:
            return BallTypes.PINEAPPLE;
        case BallTypes.PINEAPPLE:
            return BallTypes.MELON;
        case BallTypes.MELON:
            return BallTypes.WATERMELON;
        case BallTypes.WATERMELON:
            return BallTypes.CHERRY;
    }
    return BallTypes.CHERRY;
}

if (import.meta.env.DEV) {
    function update_constants(): void {
        ACCEL_SIZE = Math.sqrt(Y_G_ACCEL * Y_G_ACCEL + X_G_ACCEL * X_G_ACCEL);
        FRAME_PER_ACCEL = ACCEL_SIZE / FPS;
        Y_FRAME_PER_ACCEL = Y_G_ACCEL / FPS;
        X_FRAME_PER_ACCEL = X_G_ACCEL / FPS;
        MIN_VELOCITY = FRAME_PER_ACCEL * 2;
    }

    document.addEventListener("DOMContentLoaded", () => {
        console.log("DOMContentLoaded");
        update_constants();
        const body = document.getElementsByTagName("body")[0];
        const div_elm = document.createElement("div");
        add_g_setting(div_elm);
        add_coefficient_of_restitution_setting(div_elm);
        add_ball_type_settings(div_elm);
        body?.appendChild(div_elm);
    });

    function add_g_setting(parent: HTMLElement): void {
        // X
        {
            const div_elm = document.createElement("div");
            const label_elm = document.createElement("label");
            const input_elm = document.createElement("input");
            const output_elm = document.createElement("output");

            label_elm.textContent = "a_x";
            input_elm.type = "range";
            input_elm.min = String(-20);
            input_elm.max = String(20);
            input_elm.value = String(X_G_ACCEL);
            input_elm.step = "0.1";
            input_elm.addEventListener("input", () => {
                X_G_ACCEL = Number(input_elm.value);
                output_elm.textContent = String(X_G_ACCEL);
                update_constants();
            });
            output_elm.textContent = String(X_G_ACCEL);

            div_elm.appendChild(label_elm);
            div_elm.appendChild(input_elm);
            div_elm.appendChild(output_elm);
            parent.appendChild(div_elm);
        }
        // Y
        {
            const div_elm = document.createElement("div");
            const label_elm = document.createElement("label");
            const input_elm = document.createElement("input");
            const output_elm = document.createElement("output");

            label_elm.textContent = "a_y";
            input_elm.type = "range";
            input_elm.min = String(1);
            input_elm.max = String(PLAY_AREA_HEIGHT);
            input_elm.value = String(Y_G_ACCEL);
            input_elm.step = "0.1";
            input_elm.addEventListener("input", () => {
                Y_G_ACCEL = Number(input_elm.value);
                output_elm.textContent = String(Y_G_ACCEL);
                update_constants();
            });
            output_elm.textContent = String(Y_G_ACCEL);

            div_elm.appendChild(label_elm);
            div_elm.appendChild(input_elm);
            div_elm.appendChild(output_elm);
            parent.appendChild(div_elm);
        }
    }

    function add_coefficient_of_restitution_setting(parent: HTMLElement): void {
        // Ball
        {
            const div_elm = document.createElement("div");
            const label_elm = document.createElement("label");
            const input_elm = document.createElement("input");
            const output_elm = document.createElement("output");

            label_elm.textContent = "e_ball";
            input_elm.type = "range";
            input_elm.min = "0";
            input_elm.max = "1";
            input_elm.value = String(COEFFICIENT_OF_RESTITUTION);
            input_elm.step = "0.01";
            input_elm.addEventListener("input", () => {
                COEFFICIENT_OF_RESTITUTION = Number(input_elm.value);
                output_elm.textContent = String(COEFFICIENT_OF_RESTITUTION);
            });
            output_elm.textContent = String(COEFFICIENT_OF_RESTITUTION);

            div_elm.appendChild(label_elm);
            div_elm.appendChild(input_elm);
            div_elm.appendChild(output_elm);
            parent.appendChild(div_elm);
        }
        // Wall
        {
            const div_elm = document.createElement("div");
            const label_elm = document.createElement("label");
            const input_elm = document.createElement("input");
            const output_elm = document.createElement("output");

            label_elm.textContent = "e_wall";
            input_elm.type = "range";
            input_elm.min = "0";
            input_elm.max = "1";
            input_elm.value = String(WALL_COEFFICIENT_OF_RESTITUTION);
            input_elm.step = "0.01";
            input_elm.addEventListener("input", () => {
                WALL_COEFFICIENT_OF_RESTITUTION = Number(input_elm.value);
                output_elm.textContent = String(WALL_COEFFICIENT_OF_RESTITUTION);
            });
            output_elm.textContent = String(WALL_COEFFICIENT_OF_RESTITUTION);

            div_elm.appendChild(label_elm);
            div_elm.appendChild(input_elm);
            div_elm.appendChild(output_elm);
            parent.appendChild(div_elm);
        }
    }

    function add_ball_type_settings(parent: HTMLElement) {
        for (const ball_type of Object.values(BallTypes)) {
            const div_elm = document.createElement("div");
            const type_label_elm = document.createElement("label");
            type_label_elm.textContent = Object.keys(BallTypes).find((key) => BallTypes[key as keyof typeof BallTypes] === ball_type)!;

            div_elm.appendChild(type_label_elm);
            {
                const inner_div_elm = document.createElement("div");
                const label_elm = document.createElement("label");
                const input_elm = document.createElement("input");
                const output_elm = document.createElement("output");

                label_elm.textContent = "mass";
                input_elm.type = "range";
                input_elm.min = "1";
                input_elm.max = "100";
                input_elm.value = String(ball_type.mass);
                input_elm.step = "0.1";
                output_elm.textContent = String(ball_type.mass);
                input_elm.addEventListener("input", () => {
                    ball_type.mass = Number(input_elm.value);
                    output_elm.textContent = String(ball_type.mass);
                });

                inner_div_elm.appendChild(label_elm);
                inner_div_elm.appendChild(input_elm);
                inner_div_elm.appendChild(output_elm);
                div_elm.appendChild(inner_div_elm);
            }

            parent.appendChild(div_elm);
        }
    }
}
