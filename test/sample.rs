// Sample Rust code for testing comment generation
use std::collections::HashMap;

pub struct Calculator {
    memory: f64,
}

impl Calculator {
    pub fn new() -> Self {
        Calculator { memory: 0.0 }
    }

    pub fn add(&mut self, value: f64) -> f64 {
        self.memory += value;
        self.memory
    }

    pub fn subtract(&mut self, value: f64) -> f64 {
        self.memory -= value;
        self.memory
    }

    pub fn multiply(&mut self, value: f64) -> f64 {
        self.memory *= value;
        self.memory
    }

    pub fn divide(&mut self, value: f64) -> Result<f64, String> {
        if value == 0.0 {
            Err("Cannot divide by zero".to_string())
        } else {
            self.memory /= value;
            Ok(self.memory)
        }
    }

    pub fn clear(&mut self) {
        self.memory = 0.0;
    }

    pub fn get_memory(&self) -> f64 {
        self.memory
    }
}

pub fn fibonacci(n: u32) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

pub fn process_data(data: &[i32]) -> HashMap<i32, usize> {
    let mut frequency = HashMap::new();
    
    for &item in data {
        *frequency.entry(item).or_insert(0) += 1;
    }
    
    frequency
}

fn main() {
    let mut calc = Calculator::new();
    println!("Result: {}", calc.add(5.0));
    
    let numbers = vec![1, 2, 3, 2, 1, 3, 4];
    let freq = process_data(&numbers);
    println!("Frequency: {:?}", freq);
}