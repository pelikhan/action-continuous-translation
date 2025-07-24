#include <memory>
#include <string>
#include <vector>
#include <stdexcept>

template<typename T>
/**
 * @class SmartContainer
 * @brief A C++ class providing specific functionality
 * @details This class was automatically documented by the C++ comment generator.
 */
class SmartContainer {
private:
    std::vector<std::unique_ptr<T>> items;
    size_t capacity;
    
protected:
/**
 * @brief resize_internal function
 * @details This function was automatically documented.
 * @param new_size Parameter description
 */
    void resize_internal(size_t new_size) {
        if (new_size > capacity) {
            items.reserve(new_size);
            capacity = new_size;
        }
    }
    
public:
    SmartContainer(size_t initial_capacity = 10) 
        : capacity(initial_capacity) {
        items.reserve(capacity);
    }
    
    virtual ~SmartContainer() = default;
    
/**
 * @brief Adds two values together
 * @param a First value to add
 * @param b Second value to add
 * @return The sum of the two values
 */
    void add(std::unique_ptr<T> item) {
        if (items.size() >= capacity) {
            resize_internal(capacity * 2);
        }
        items.push_back(std::move(item));
    }
    
/**
 * @brief Gets a value from the object
 * @return The requested value
 */
    T* get(size_t index) const {
        if (index >= items.size()) {
            throw std::out_of_range("Index out of range");
        }
        return items[index].get();
    }
    
/**
 * @brief size function
 * @details This function was automatically documented.
 * @return Description of return value
 */
    size_t size() const { return items.size(); }
/**
 * @brief empty function
 * @details This function was automatically documented.
 * @return Description of return value
 */
    bool empty() const { return items.empty(); }
    
/**
 * @brief clear function
 * @details This function was automatically documented.
 */
    void clear() {
        items.clear();
    }
    
/**
 * @class Iterator
 * @brief A C++ class providing specific functionality
 * @details This class was automatically documented by the C++ comment generator.
 */
    class Iterator {
    private:
        typename std::vector<std::unique_ptr<T>>::const_iterator it;
        
    public:
        Iterator(typename std::vector<std::unique_ptr<T>>::const_iterator iter) : it(iter) {}
        
        T& operator*() const { return **it; }
        T* operator->() const { return (*it).get(); }
        
        Iterator& operator++() {
            ++it;
            return *this;
        }
        
        bool operator!=(const Iterator& other) const {
            return it != other.it;
        }
    };
    
/**
 * @brief begin function
 * @details This function was automatically documented.
 * @return Description of return value
 */
    Iterator begin() const {
        return Iterator(items.begin());
    }
    
/**
 * @brief end function
 * @details This function was automatically documented.
 * @return Description of return value
 */
    Iterator end() const {
        return Iterator(items.end());
    }
};

namespace Utils {
    
/**
 * @brief factorial function
 * @details This function was automatically documented.
 * @param n Parameter description
 * @return Description of return value
 */
    int factorial(int n) {
        if (n < 0) {
            throw std::invalid_argument("Factorial is not defined for negative numbers");
        }
        if (n == 0 || n == 1) {
            return 1;
        }
/**
 * @brief factorial function
 * @details This function was automatically documented.
 * @param 1 Parameter description
 * @return Description of return value
 */
        return n * factorial(n - 1);
    }
    
/**
 * @brief isPowerOfTwo function
 * @details This function was automatically documented.
 * @param n Parameter description
 * @return Description of return value
 */
    bool isPowerOfTwo(unsigned int n) {
        return n != 0 && (n & (n - 1)) == 0;
    }
    
}