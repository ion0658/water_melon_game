use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct ColorCode {
    r: u8,
    g: u8,
    b: u8,
    a: u8,
}

#[wasm_bindgen]
impl ColorCode {
    pub fn new(r: u8, g: u8, b: u8, a: u8) -> Self {
        Self { r, g, b, a }
    }

    pub fn to_rgba_hex_string(&self) -> String {
        format!("{:02X}{:02X}{:02X}{:02X}", self.r, self.g, self.b, self.a)
    }

    pub fn to_rgba_u32(&self) -> u32 {
        ((self.r as u32) << 24) | ((self.g as u32) << 16) | ((self.b as u32) << 8) | (self.a as u32)
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_to_rgba_hex_string() {
        let color_code = ColorCode::new(0x12, 0x34, 0x56, 0x78);
        assert_eq!(color_code.to_rgba_hex_string(), "12345678");
    }

    #[test]
    fn test_to_rgba_u32() {
        let color_code = ColorCode::new(0x12, 0x34, 0x56, 0x78);
        assert_eq!(color_code.to_rgba_u32(), 0x12345678);
    }
}
