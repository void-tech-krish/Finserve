# Module 5 – NP-Completeness and Approximation

## 1. Module Overview
This module explores computational complexity, highlighting problems that are "NP-complete".
- **P**: Problems solvable in polynomial time.
- **NP**: Problems whose solutions can be verified in polynomial time.
- **NP-Hard**: Problems at least as hard as the hardest problems in NP.
- **NP-Complete**: Problems that are both in NP and NP-Hard.

In FinServe, understanding these concepts ensures we do not attempt to write an optimal polynomial-time algorithm for inherently intractable financial tasks, such as optimal subset selection with complex constraints.

## 2. SAT / 3-SAT
- **Boolean Variables**: True/False values (`x`).
- **Literals**: Variables or their negations (`x` or `!x`).
- **Clauses**: A disjunction (OR) of literals.
- **3-SAT**: Determining if a set of clauses (with 3 literals each) can all be true simultaneously.
- **Implementation**: Brute force `O(2^n * m)`.
- **Financial Rule Example**: A transaction is approved if combinations of verifications hold (e.g. `(trustedDevice OR verifiedUser OR manualOverride)`).

## 3. 3-SAT → CLIQUE
- **Reduction Concept**: Transforming an instance of one problem to another in polynomial time.
- **Graph Construction**: Every literal in every clause becomes a vertex (`3m` vertices). Edges connect non-contradictory literals from different clauses.
- **Target Clique**: `k = number of clauses`. If a clique of size `k` exists, the formula is satisfiable, since it selects one valid, mutually consistent literal from each clause.

## 4. CLIQUE → INDEPENDENT SET
- **Complement Graph**: A graph where edges exist exactly where they DO NOT exist in the original graph.
- **Relationship**: An Independent Set in graph `G` corresponds identically to a Clique in the complement graph `G'`.

## 5. INDEPENDENT SET → VERTEX COVER
- **Relationship**: For a graph `G` with `V` vertices, a subset `S` is an Independent Set if and only if `V - S` is a Vertex Cover.
- **Example**: In a financial network, if `S` are completely independent systems (no direct link), the remaining systems `V - S` must touch every dependency (edge).

## 6. Vertex Cover 2-Approximation
- **Approximation**: Since finding the optimal Vertex Cover is NP-complete, we use a 2-approximation which guarantees a cover no larger than twice the optimal size.
- **Approach**: Repeatedly pick an uncovered edge, add BOTH endpoints to the cover, and remove incident edges.
- **Guarantee**: Since the optimal cover must pick at least one vertex for each disjoint edge we select, picking both vertices yields a size `<= 2 * OPT`.

## 7. Complexity Table

| Algorithm                      | Type            | Complexity                       | FinServe Use           |
| ------------------------------ | --------------- | -------------------------------- | ---------------------- |
| 3-SAT                          | NP-Complete     | O(2^n * m)                       | Financial rules        |
| 3-SAT → CLIQUE                 | Reduction       | Polynomial (O(m^2))              | Constraint analysis    |
| CLIQUE → Independent Set       | Reduction       | Polynomial (O(V^2))              | Conflict analysis      |
| Independent Set → Vertex Cover | Reduction       | Polynomial (O(V))                | Dependency analysis    |
| Vertex Cover                   | 2-Approximation | Polynomial (O(V + E))            | Financial dependencies |

## 8. Testing Results
- Over 15 tests covering small inputs, empty structures, single elements.
- **Satisfiable/Unsatisfiable**: Verified with `ThreeSAT` solver.
- **Reduction**: 3-SAT reduced perfectly to CLIQUE.
- **Approximation**: Guaranteed `Approximation Size <= 2 * OPT` verified by comparing to brute-force exact optimum for small graphs.
- **Cross-validation**: `3-SAT SAT <=> Target CLIQUE exists` passed accurately.
- **Final Pass Percentage**: 100%

## 9. Viva Questions
**Q: What is P?**
A: Problems that can be solved in polynomial time.
**Q: What is NP?**
A: Problems whose solutions can be verified in polynomial time.
**Q: What is NP-complete?**
A: The hardest problems in NP; if one is solved in polynomial time, all of NP is solved in polynomial time.
**Q: What is 3-SAT?**
A: Satisfiability of boolean expressions where each clause has exactly 3 literals.
**Q: What is a polynomial reduction?**
A: An algorithm that transforms instances of one problem to instances of another in polynomial time.
**Q: How is CLIQUE related to Independent Set?**
A: A clique in G is an independent set in the complement graph G'.
**Q: Does the 2-approximation always find the optimal cover?**
A: No, it finds a valid cover that is at worst twice the size of the optimal cover.
