# Module 1 - String Algorithms

## 1. Module Objective
The objective of this module is to implement various string searching and pattern matching algorithms to analyze financial data in the **FinServe – Intelligent Banking Analytics Platform**. String algorithms are essential for efficiently extracting information, identifying patterns, and detecting anomalies within large volumes of textual banking data.

## 2. Why String Algorithms are needed in FinServe
FinServe handles vast amounts of textual data including:
- Customer and account information
- Financial transactions
- Payment records
- Fraud indicators
- Security events
- Transaction descriptions
- Financial codes

Traditional string matching methods (like nested loops) are computationally expensive for large datasets. Using advanced string algorithms allows FinServe to:
- Quickly search for specific transaction IDs or payment codes.
- Identify repeated patterns in transaction descriptions (e.g., repeated failures).
- Efficiently search for financial/payment/security codes.
- Detect multiple suspicious/fraud-related keywords simultaneously to prevent fraudulent activities.

## 3. KMP (Knuth-Morris-Pratt)
- **Idea**: KMP improves on naive string matching by utilizing information from previous character comparisons. It pre-computes an array called LPS (Longest Prefix Suffix) that indicates the longest proper prefix which is also a suffix. When a mismatch occurs, the LPS array tells the algorithm where to resume matching, avoiding unnecessary backtracking in the text.
- **Time Complexity**: O(N + M), where N is the length of the text and M is the length of the pattern.
- **Space Complexity**: O(M) for the LPS array.
- **Banking Use Case**: Users searching for a specific transaction ID, payment code, reference number, or keyword inside transaction descriptions.

## 4. Z-Function
- **Idea**: The Z-algorithm computes an array where each element `Z[i]` represents the length of the longest substring starting from index `i` which is also a prefix of the string. By concatenating the pattern, a special character (like `$`), and the text (`Pattern$Text`), we can find the pattern in the text wherever the Z-value equals the length of the pattern.
- **Time Complexity**: O(N + M)
- **Space Complexity**: O(N + M) for the concatenated string and Z-array.
- **Banking Use Case**: Analyzing transaction descriptions and identifying repeated prefixes/patterns, such as repeated error messages ("Payment failed...").

## 5. Rabin-Karp
- **Idea**: Rabin-Karp uses a rolling hash function to compute hash values of the pattern and each substring of the text of the same length. It slides a window over the text, updating the hash in O(1) time. If the hash of the window matches the hash of the pattern, it performs a character-by-character comparison to confirm the match (avoiding hash collisions).
- **Time Complexity**: Average and Best case O(N + M). Worst case O(N * M) (very rare, happens when many hash collisions occur).
- **Space Complexity**: O(1)
- **Banking Use Case**: Searching financial/payment/security codes efficiently inside large transaction text.

## 6. Aho-Corasick
- **Idea**: Aho-Corasick is an extension of the Trie data structure. It constructs a state machine (Trie) from a set of keywords and adds "failure links" that provide fast transitions between states when a character mismatch occurs. This allows the algorithm to search for multiple patterns simultaneously in a single pass over the text.
- **Time Complexity**: O(N + M + Z), where N is the length of the text, M is the total length of all keywords, and Z is the number of matches found.
- **Space Complexity**: O(M * K), where M is the total length of keywords and K is the alphabet size.
- **Banking Use Case**: Detecting multiple suspicious/fraud-related keywords simultaneously in transaction descriptions.

## 7. Comparison Table
| Algorithm      | Best for...                                      | Time Complexity | Space Complexity |
|----------------|--------------------------------------------------|-----------------|------------------|
| KMP            | Single pattern search, avoiding backtracking     | O(N + M)        | O(M)             |
| Z-Function     | Finding prefix matches and repeated patterns     | O(N + M)        | O(N + M)         |
| Rabin-Karp     | Multiple pattern lengths using rolling hashes    | O(N + M) avg    | O(1)             |
| Aho-Corasick   | Searching MULTIPLE patterns simultaneously       | O(N + M + Z)    | O(M * K)         |

## 8. Test Results
All algorithms were thoroughly tested with various cases, including:
- Pattern found / not found
- Multiple occurrences
- Empty patterns/inputs
- Hash collision safety (Rabin-Karp)
- Overlapping patterns (Aho-Corasick)
- Multiple patterns matched (Aho-Corasick)

Tests executed via `AlgorithmTests.java` resulted in 100% success across all cases.

## 9. How M1 integrates with FinServe
The algorithms are integrated via the `StringAnalyticsService` class. This component exposes simple methods:
1. `searchTransactionCode` (uses KMP)
2. `analyzeDescriptionPattern` (uses Z-Function)
3. `searchFinancialCode` (uses Rabin-Karp)
4. `detectFraudPatterns` (uses Aho-Corasick)

This service allows the larger application to perform advanced string analysis without worrying about the underlying algorithmic complexity. The interactive `Demo.java` program provides a clean console interface to execute these features on real banking data scenarios.
