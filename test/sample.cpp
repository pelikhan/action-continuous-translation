#include <iostream>
#include <vector>
#include <string>

/**
 * @class Calculator
 * @brief A C++ class providing specific functionality
 * @details This class was automatically documented by the C++ comment generator.
 */
class Calculator {
private:
    double lastResult;

public:
    Calculator() : lastResult(0.0) {}

/**
 * @brief Adds two values together
 * @param a First value to add
 * @param b Second value to add
 * @return The sum of the two values
 */
    double add(double a, double b) {
        lastResult = a + b;
        return lastResult;
    }

/**
 * @brief subtract function
 * @details This function was automatically documented.
 * @param a Parameter description
 * @param b Parameter description
 * @return Description of return value
 */
    double subtract(double a, double b) {
        lastResult = a - b;
        return lastResult;
    }

/**
 * @brief multiply function
 * @details This function was automatically documented.
 * @param a Parameter description
 * @param b Parameter description
 * @return Description of return value
 */
    double multiply(double a, double b) {
        lastResult = a * b;
        return lastResult;
    }

/**
 * @brief divide function
 * @details This function was automatically documented.
 * @param a Parameter description
 * @param b Parameter description
 * @return Description of return value
 */
    double divide(double a, double b) {
        if (b == 0) {
            throw std::invalid_argument("Division by zero");
        }
        lastResult = a / b;
        return lastResult;
    }

/**
 * @brief Gets a value from the object
 * @return The requested value
 */
    double getLastResult() const {
        return lastResult;
    }

/**
 * @brief Sets a value in the object
 * @param value The value to set
 */
    void reset() {
        lastResult = 0.0;
    }
};

/**
 * @brief fibonacci function
 * @details This function was automatically documented.
 * @param n Parameter description
 * @return Description of return value
 */
int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

std::vector<int> findPrimes(int limit) {
    std::vector<int> primes;
    std::vector<bool> isPrime(limit + 1, true);
    isPrime[0] = isPrime[1] = false;

    for (int i = 2; i * i <= limit; i++) {
        if (isPrime[i]) {
            for (int j = i * i; j <= limit; j += i) {
                isPrime[j] = false;
            }
        }
    }

    for (int i = 2; i <= limit; i++) {
        if (isPrime[i]) {
            primes.push_back(i);
        }
    }

    return primes;
}

/**
 * @brief Main entry point of the program
 * @return int Exit status of the program
 */
int main() {
    Calculator calc;
    
    std::cout << "Calculator Test:" << std::endl;
    std::cout << "5 + 3 = " << calc.add(5, 3) << std::endl;
    std::cout << "10 - 4 = " << calc.subtract(10, 4) << std::endl;
    std::cout << "7 * 6 = " << calc.multiply(7, 6) << std::endl;
    std::cout << "15 / 3 = " << calc.divide(15, 3) << std::endl;
    
    std::cout << "\nFibonacci Test:" << std::endl;
    for (int i = 0; i < 10; i++) {
        std::cout << "F(" << i << ") = " << fibonacci(i) << std::endl;
    }
    
    std::cout << "\nPrime Numbers up to 20:" << std::endl;
    auto primes = findPrimes(20);
    for (int prime : primes) {
        std::cout << prime << " ";
    }
    std::cout << std::endl;
    
    return 0;
}