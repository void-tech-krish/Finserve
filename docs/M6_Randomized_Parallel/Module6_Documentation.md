# Module 6 — Randomized and Parallel Algorithms

## 1. Module Overview
This module explores the utility of randomized logic and parallel computation in a financial context. By utilizing random choices and multiple CPU cores, FinServe can process continuous transaction streams, rank datasets dynamically, and handle aggregation workloads that would take considerably longer in sequential environments.

## 2. CO6 Mapping
This module fulfills Course Outcome 6 (CO6), addressing algorithms that incorporate randomness for performance optimization and those designed to operate across parallel processing units.

## 3. Randomized QuickSort
- **Theory & Working**: A variation of standard QuickSort where the pivot is selected randomly rather than using a fixed position (like the first or last element). This prevents the worst-case scenario (O(n²)) on already sorted data.
- **Complexity**: Expected O(n log n), worst O(n²).
- **FinServe Use Case**: Sorting transaction amounts and risk scores dynamically without susceptibility to pathological input patterns.

## 4. Miller-Rabin Primality Test
- **Theory & Working**: A probabilistic primality test based on modular exponentiation and witness testing. By testing random or deterministic bases, we can efficiently establish if a large number is composite or a "probable prime".
- **Complexity**: O(k log³ n) where k is the number of rounds.
- **FinServe Use Case**: Fundamental in cryptographic and security verification processes in financial infrastructure, enabling fast validation of large primes.

## 5. Reservoir Sampling
- **Theory & Working**: Algorithm R selects `k` random samples from an unknown-length stream in a single pass. The first `k` elements fill the reservoir, and every subsequent element `i` replaces a random element with probability `k/i`.
- **Complexity**: O(n) time, O(k) space.
- **FinServe Use Case**: Real-time auditing and fraud sampling over continuous and unbounded transaction streams.

## 6. Blelloch Scan
- **Theory & Working**: An efficient parallel prefix scan algorithm consisting of an upsweep (reduction) phase to calculate partial sums, and a downsweep phase to distribute these sums and form the prefix.
- **Complexity**: O(n) work, O(log n) span.
- **FinServe Use Case**: High-speed computation of cumulative transaction statistics and account balances over time.

## 7. Parallel Reduce
- **Theory & Working**: Divides an input array into discrete chunks distributed among a pool of worker threads. The workers calculate partial sums, which are then combined to form the total result.
- **Complexity**: Parallel time O(n/p + p) where p is the number of threads.
- **FinServe Use Case**: Rapidly aggregating large datasets (e.g., total daily transaction values, aggregate fraud loss).

## 8. Brent's Theorem
- **Theory & Working**: Provides bounds on parallel execution time. If total work is `W` and the critical path span is `S`, then execution time with `P` processors `T_p` is bounded theoretically by `T_p <= (W - S)/P + S`.
- **FinServe Use Case**: Theoretical scheduling analysis to predict how fast transaction tasks can be processed with current parallel processing resources.

## 9. Complexity Table

| Algorithm            | Main Complexity                                                |
| -------------------- | -------------------------------------------------------------- |
| Randomized QuickSort | Expected O(n log n), worst O(n²)                               |
| Miller-Rabin         | Depends on number of rounds / modular exponentiation           |
| Reservoir Sampling   | O(n) time, O(k) space                                          |
| Blelloch Scan        | O(n) work, O(log n) span                                       |
| Parallel Reduce      | O(n/p + p) style parallel time depending on implementation     |
| Brent's Theorem      | T_p bounded using W and S                                      |

## 10. Viva Questions and Answers
**Q: Why use a random pivot in QuickSort?**
A: To avoid worst-case O(n²) time complexity when sorting nearly-sorted or reversed data.
**Q: How does Reservoir Sampling work for streams of unknown size?**
A: By keeping a reservoir of size k, and replacing elements dynamically with a probability of `k/i` where `i` is the current element index.
**Q: What is a Carmichael number?**
A: A composite number that passes Fermat's primality test for all bases, which Miller-Rabin correctly identifies as composite.
**Q: What is the span in parallel computing?**
A: The length of the longest path (critical path) of dependencies in the computation graph.
**Q: What does Blelloch Scan compute?**
A: It computes the prefix sum of an array in parallel in O(log n) span.

## 11. Limitations
- Miller-Rabin is probabilistic (though deterministic for 64-bit numbers if specific bases are used).
- Parallel Reduce scales poorly if the array size is small compared to thread management overhead.
- Blelloch Scan requires padding non-power-of-two arrays, potentially doubling memory usage internally.

## 12. Conclusion
Module 6 demonstrates how FinServe handles scale and unpredictability through modern, high-performance randomized and parallel techniques.
