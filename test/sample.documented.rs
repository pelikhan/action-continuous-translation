/// A simple calculator that performs basic arithmetic operations and stores the result in memory.
/// 
/// The `Calculator` struct maintains a memory value that can be modified through various
/// arithmetic operations. All operations update the internal memory and return the new value.
/// 
/// # Examples
/// 
/// ```rust
/// let mut calc = Calculator::new();
/// assert_eq!(calc.add(5.0), 5.0);
/// assert_eq!(calc.multiply(2.0), 10.0);
/// assert_eq!(calc.get_memory(), 10.0);
/// ```
pub struct Calculator {
    /// The current value stored in the calculator's memory
    memory: f64,
}

impl Calculator {
    /// Creates a new calculator with memory initialized to 0.0.
    /// 
    /// # Examples
    /// 
    /// ```rust
    /// let calc = Calculator::new();
    /// assert_eq!(calc.get_memory(), 0.0);
    /// ```
    pub fn new() -> Self {
        Calculator { memory: 0.0 }
    }

    /// Adds a value to the current memory and returns the result.
    /// 
    /// # Arguments
    /// 
    /// * `value` - The value to add to the current memory
    /// 
    /// # Returns
    /// 
    /// The new memory value after addition
    /// 
    /// # Examples
    /// 
    /// ```rust
    /// let mut calc = Calculator::new();
    /// assert_eq!(calc.add(5.0), 5.0);
    /// assert_eq!(calc.add(3.0), 8.0);
    /// ```
    pub fn add(&mut self, value: f64) -> f64 {
        self.memory += value;
        self.memory
    }

    /// Subtracts a value from the current memory and returns the result.
    /// 
    /// # Arguments
    /// 
    /// * `value` - The value to subtract from the current memory
    /// 
    /// # Returns
    /// 
    /// The new memory value after subtraction
    /// 
    /// # Examples
    /// 
    /// ```rust
    /// let mut calc = Calculator::new();
    /// calc.add(10.0);
    /// assert_eq!(calc.subtract(3.0), 7.0);
    /// ```
    pub fn subtract(&mut self, value: f64) -> f64 {
        self.memory -= value;
        self.memory
    }

    /// Multiplies the current memory by a value and returns the result.
    /// 
    /// # Arguments
    /// 
    /// * `value` - The value to multiply the current memory by
    /// 
    /// # Returns
    /// 
    /// The new memory value after multiplication
    /// 
    /// # Examples
    /// 
    /// ```rust
    /// let mut calc = Calculator::new();
    /// calc.add(5.0);
    /// assert_eq!(calc.multiply(2.0), 10.0);
    /// ```
    pub fn multiply(&mut self, value: f64) -> f64 {
        self.memory *= value;
        self.memory
    }

    /// Divides the current memory by a value and returns the result.
    /// 
    /// # Arguments
    /// 
    /// * `value` - The value to divide the current memory by
    /// 
    /// # Returns
    /// 
    /// * `Ok(f64)` - The new memory value after division
    /// * `Err(String)` - An error message if division by zero is attempted
    /// 
    /// # Errors
    /// 
    /// Returns an error if `value` is 0.0, as division by zero is undefined.
    /// 
    /// # Examples
    /// 
    /// ```rust
    /// let mut calc = Calculator::new();
    /// calc.add(10.0);
    /// assert_eq!(calc.divide(2.0).unwrap(), 5.0);
    /// 
    /// // Division by zero returns an error
    /// assert!(calc.divide(0.0).is_err());
    /// ```
    pub fn divide(&mut self, value: f64) -> Result<f64, String> {
        if value == 0.0 {
            Err("Cannot divide by zero".to_string())
        } else {
            self.memory /= value;
            Ok(self.memory)
        }
    }

    /// Clears the calculator's memory, setting it to 0.0.
    /// 
    /// # Examples
    /// 
    /// ```rust
    /// let mut calc = Calculator::new();
    /// calc.add(42.0);
    /// calc.clear();
    /// assert_eq!(calc.get_memory(), 0.0);
    /// ```
    pub fn clear(&mut self) {
        self.memory = 0.0;
    }

    /// Returns the current value stored in the calculator's memory.
    /// 
    /// # Returns
    /// 
    /// The current memory value
    /// 
    /// # Examples
    /// 
    /// ```rust
    /// let mut calc = Calculator::new();
    /// calc.add(15.0);
    /// assert_eq!(calc.get_memory(), 15.0);
    /// ```
    pub fn get_memory(&self) -> f64 {
        self.memory
    }
}

/// Computes the nth Fibonacci number using recursion.
/// 
/// This function calculates Fibonacci numbers where F(0) = 0, F(1) = 1,
/// and F(n) = F(n-1) + F(n-2) for n > 1.
/// 
/// # Arguments
/// 
/// * `n` - The position in the Fibonacci sequence (0-based)
/// 
/// # Returns
/// 
/// The nth Fibonacci number
/// 
/// # Performance Note
/// 
/// This implementation uses naive recursion and has exponential time complexity.
/// For large values of `n`, consider using an iterative or memoized approach.
/// 
/// # Examples
/// 
/// ```rust
/// assert_eq!(fibonacci(0), 0);
/// assert_eq!(fibonacci(1), 1);
/// assert_eq!(fibonacci(5), 5);
/// assert_eq!(fibonacci(10), 55);
/// ```
pub fn fibonacci(n: u32) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

/// Processes a slice of integers and returns a frequency map.
/// 
/// This function counts the occurrence of each unique value in the input slice
/// and returns a HashMap where keys are the unique values and values are their frequencies.
/// 
/// # Arguments
/// 
/// * `data` - A slice of integers to process
/// 
/// # Returns
/// 
/// A HashMap where keys are the unique integers from the input and values are their frequencies
/// 
/// # Examples
/// 
/// ```rust
/// use std::collections::HashMap;
/// 
/// let numbers = vec![1, 2, 3, 2, 1, 3, 4];
/// let freq = process_data(&numbers);
/// 
/// assert_eq!(freq.get(&1), Some(&2));
/// assert_eq!(freq.get(&2), Some(&2));
/// assert_eq!(freq.get(&3), Some(&2));
/// assert_eq!(freq.get(&4), Some(&1));
/// ```
pub fn process_data(data: &[i32]) -> HashMap<i32, usize> {
    let mut frequency = HashMap::new();
    
    for &item in data {
        *frequency.entry(item).or_insert(0) += 1;
    }
    
    frequency
}

/// Entry point of the program demonstrating the calculator and data processing functionality.
/// 
/// This function creates a calculator instance, performs some operations,
/// and demonstrates the frequency counting functionality.
fn main() {
    let mut calc = Calculator::new();
    println!("Result: {}", calc.add(5.0));
    
    let numbers = vec![1, 2, 3, 2, 1, 3, 4];
    let freq = process_data(&numbers);
    println!("Frequency: {:?}", freq);
}