use std::fs::File;

pub enum Status {
    Active,
    Inactive,
    Pending,
}

pub trait Processable {
    fn process(&self) -> Result<String, &'static str>;
}

pub struct SimpleStruct {
    pub id: u32,
    name: String,
}

impl SimpleStruct {
    pub fn new(id: u32, name: String) -> Self {
        Self { id, name }
    }

    pub unsafe fn unsafe_operation(&mut self, ptr: *const u8) -> usize {
        std::ptr::read(ptr) as usize
    }
}

impl Processable for SimpleStruct {
    fn process(&self) -> Result<String, &'static str> {
        if self.name.is_empty() {
            Err("Name cannot be empty")
        } else {
            Ok(format!("Processing {}", self.name))
        }
    }
}

pub mod utils {
    pub fn helper_function(input: &str) -> String {
        input.to_uppercase()
    }
}

pub const MAX_SIZE: usize = 1024;

pub type ResultType<T> = Result<T, Box<dyn std::error::Error>>;

#[derive(Debug, Clone)]
pub struct GenericStruct<T> {
    data: T,
}

impl<T> GenericStruct<T> {
    pub fn new(data: T) -> Self {
        Self { data }
    }

    pub fn get_data(&self) -> &T {
        &self.data
    }
}