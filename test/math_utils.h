#ifndef MATH_UTILS_H
#define MATH_UTILS_H

#include <vector>

namespace MathUtils {

/**
 * @class Matrix
 * @brief A C++ class providing specific functionality
 * @details This class was automatically documented by the C++ comment generator.
 */
class Matrix {
private:
    std::vector<std::vector<double>> data;
    size_t rows;
    size_t cols;

public:
    Matrix(size_t rows, size_t cols);
    Matrix(const std::vector<std::vector<double>>& values);
    
    double& operator()(size_t row, size_t col);
    const double& operator()(size_t row, size_t col) const;
    
    Matrix operator+(const Matrix& other) const;
    Matrix operator-(const Matrix& other) const;
    Matrix operator*(const Matrix& other) const;
    
/**
 * @brief Gets a value from the object
 * @return The requested value
 */
    size_t getRows() const { return rows; }
/**
 * @brief Gets a value from the object
 * @return The requested value
 */
    size_t getCols() const { return cols; }
    
/**
 * @brief print function
 * @details This function was automatically documented.
 */
    void print() const;
/**
 * @brief transpose function
 * @details This function was automatically documented.
 * @return Description of return value
 */
    Matrix transpose() const;
/**
 * @brief determinant function
 * @details This function was automatically documented.
 * @return Description of return value
 */
    double determinant() const;
};

/**
 * @brief factorial function
 * @details This function was automatically documented.
 * @param n Parameter description
 * @return Description of return value
 */
double factorial(int n);
/**
 * @brief isPrime function
 * @details This function was automatically documented.
 * @param n Parameter description
 * @return Description of return value
 */
bool isPrime(int n);
/**
 * @brief gcd function
 * @details This function was automatically documented.
 * @param a Parameter description
 * @param b Parameter description
 * @return Description of return value
 */
int gcd(int a, int b);
/**
 * @brief lcm function
 * @details This function was automatically documented.
 * @param a Parameter description
 * @param b Parameter description
 * @return Description of return value
 */
int lcm(int a, int b);

template<typename T>
/**
 * @brief max function
 * @details This function was automatically documented.
 * @param a Parameter description
 * @param b Parameter description
 * @return Description of return value
 */
T max(T a, T b) {
    return (a > b) ? a : b;
}

template<typename T>
/**
 * @brief min function
 * @details This function was automatically documented.
 * @param a Parameter description
 * @param b Parameter description
 * @return Description of return value
 */
T min(T a, T b) {
    return (a < b) ? a : b;
}

}

#endif // MATH_UTILS_H