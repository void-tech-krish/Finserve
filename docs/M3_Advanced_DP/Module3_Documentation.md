# Module 3 – Advanced Dynamic Programming

## 1. Module Objective
Dynamic Programming (DP) is essential in FinServe for solving complex financial analytics problems that exhibit overlapping subproblems and optimal substructure. By storing the results of expensive subproblems, FinServe can achieve significant performance improvements, enabling real-time error correction, optimal resource allocation, and optimized analytical pipelines.

## 2. Levenshtein Distance
- **Problem**: Finding the minimum number of single-character edits (insertions, deletions, substitutions) required to change one string into another.
- **DP Idea**: Build a 2D array where `dp[i][j]` represents the minimum edit distance between the first `i` characters of the source and the first `j` characters of the target.
- **Recurrence**: 
  `dp[i][j] = min(dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + cost)`
  where `cost` is 0 if characters match, else 1.
- **Base Cases**: `dp[i][0] = i`, `dp[0][j] = j`.
- **Time Complexity**: O(M * N)
- **Space Complexity**: O(M * N)
- **FinServe Use Case**: Correcting transaction-description typing errors (e.g., "paymant" to "payment").

## 3. Damerau-Levenshtein
- **Problem**: An extension of Levenshtein distance that also allows the transposition of two adjacent characters as a single edit operation.
- **Transposition Concept**: Humans frequently swap adjacent letters while typing (e.g., "recieve"). Damerau-Levenshtein handles this natively with a cost of 1 instead of counting it as an insertion and a deletion.
- **DP Approach**: Adds an extra condition to the Levenshtein recurrence to check if the last two characters of both strings match in reverse order.
- **Complexity**: Time O(M * N), Space O(M * N)
- **FinServe Use Case**: Correcting adjacent-character typing mistakes in user-entered payment references.

## 4. Weighted Edit Distance
- **Why operations have different costs**: Not all errors are equal. Inserting a missing character might be a minor typo (cost 1), while substituting a character in a critical financial reference code might imply a more severe misentry (cost 2).
- **Recurrence**: Similar to Levenshtein, but uses distinct `insertionCost`, `deletionCost`, and `substitutionCost` variables.
- **Complexity**: Time O(M * N), Space O(M * N)
- **FinServe Use Case**: Calculating penalty costs for different types of financial data entry errors where substitutions might be more strictly penalized.

## 5. Bitmask DP
- **What a bitmask represents**: An integer where each bit represents the availability or assignment status of a resource (e.g., if bit 2 is `1`, resource 2 is assigned).
- **State Definition**: `dp[mask]` represents the minimum cost to assign `popcount(mask)` operations using the resources indicated by `mask`.
- **Transition**: `dp[mask | (1 << j)] = min(dp[mask | (1 << j)], dp[mask] + cost[i][j])`
- **Complexity**: Time O(N * 2^N), Space O(2^N)
- **FinServe Assignment Example**: Assigning combinations of financial operations (Fraud Review, Account Validation, etc.) to specific analysts while minimizing total processing cost. Bitmask DP is highly appropriate here because `N` is small (e.g., N <= 20), making brute force O(N!) computationally impossible, but O(N * 2^N) highly efficient.

## 6. Matrix-Chain Multiplication
- **Matrix multiplication cost**: Multiplying an A x B matrix with a B x C matrix takes A * B * C scalar multiplications.
- **DP Recurrence**: `dp[i][j] = min(dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j])` for all `i <= k < j`.
- **Split Table**: Stores the optimal `k` for each `i, j` pair to reconstruct the parenthesization order.
- **Complexity**: Time O(N^3), Space O(N^2)
- **FinServe Use Case**: Optimizing the computational order of multiple cascaded financial analytical operations (e.g., Matrix multiplications in Deep Learning fraud models or Risk Analysis).

## 7. Comparison Table

| Algorithm | Main Problem | DP State | Time Complexity | Space Complexity | FinServe Use |
| --- | --- | --- | --- | --- | --- |
| Levenshtein | Edit distance (Ins, Del, Sub) | `dp[i][j]` | O(M * N) | O(M * N) | Typo correction |
| Damerau-Levenshtein | Edit distance + Transposition | `dp[i][j]` | O(M * N) | O(M * N) | Adjacency typo fix |
| Weighted Edit Distance | Configurable operation costs | `dp[i][j]` | O(M * N) | O(M * N) | Penalty computation |
| Bitmask DP | Optimal Resource Assignment | `dp[mask]` | O(N * 2^N) | O(2^N) | Analyst assignment |
| Matrix-Chain Multiplication | Optimal multiplication ordering | `dp[i][j]` | O(N^3) | O(N^2) | Optimizing analytics |

## 8. Test Results
All implementations were thoroughly tested via `AdvancedDPTests.java`.
- Levenshtein, Damerau-Levenshtein, and Weighted Edit Distance passed standard text tests, identical string checks, empty string bounds, and complex multi-edit scenarios.
- Bitmask DP accurately calculated minimum assignment costs for 2x2, 3x3, and 4x4 cost matrices.
- Matrix-Chain Multiplication matched textbook minimal cost outputs and produced valid optimal parenthesization strings. All tests successfully passed.
