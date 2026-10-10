# Module 4 – Network Flow

## 1. Module Overview
Network flow algorithms calculate the maximum rate at which a substance can flow through a network with capacity constraints. In the **FinServe – Intelligent Banking Analytics Platform**, financial transactions, data packets, and operational limits can be modeled as networks. Network flow helps optimize the volume of transactions processed across different banking nodes (banks, gateways, processing centers) without exceeding system capacities.

## 2. Ford-Fulkerson
- **Problem**: Finding the maximum possible flow from a source to a sink.
- **Algorithm Idea**: Repeatedly finding an augmenting path in the residual graph and pushing flow along that path until no more paths exist.
- **Residual Graph**: A representation of remaining capacities in the network. Pushing flow adds reverse residual capacity to allow the algorithm to "undo" suboptimal paths.
- **FinServe Use Case**: Calculating the maximum overall transaction throughput of a financial network.
- **Time Complexity**: O(E * max_flow)
- **Space Complexity**: O(V^2) when using an adjacency matrix.

## 3. Edmonds-Karp
- **Difference from Ford-Fulkerson**: Edmonds-Karp specifically dictates that Breadth-First Search (BFS) is used to find augmenting paths, ensuring the shortest path in terms of number of edges is always augmented first.
- **FinServe Use Case**: Ensuring optimal transactional capacity calculations over larger networks where standard DFS might take too long to converge.
- **Time Complexity**: O(V * E^2)
- **Space Complexity**: O(V^2)

## 4. Dinic's Algorithm
- **Algorithm Idea**: A more advanced max-flow algorithm that uses a **Level Graph** (built using BFS) and finds **Blocking Flows** (using DFS with a current-edge optimization array).
- **FinServe Use Case**: Extremely efficient capacity analysis for high-volume, massive-scale financial transaction networks.
- **Time Complexity**: O(V^2 * E)
- **Space Complexity**: O(V + E) (Using adjacency lists)

## 5. Bipartite Matching
- **Definition**: Finding the maximum number of edges in a bipartite graph such that no two edges share an endpoint.
- **Algorithm**: Standard DFS-based augmenting path approach to match left nodes with right nodes efficiently.
- **FinServe Use Case**: Optimally assigning financial analysts to available fraud cases.
- **Complexity**: O(V * E)

## 6. Min-Cut
- **Definition**: The minimum capacity of a set of edges that, if removed, disconnects the source from the sink.
- **Max-flow/Min-cut Theorem**: The maximum flow in a network is exactly equal to the capacity of the minimum cut.
- **Algorithm**: After computing max-flow, perform a DFS/BFS from the source on the residual graph to find all reachable nodes. Edges spanning from reachable to non-reachable nodes are the cut edges.
- **FinServe Use Case**: Identifying critical financial transaction channels whose failure would completely sever transactions between two banking entities.

## 7. Algorithm Comparison

| Algorithm          | Main Idea                      | Typical Complexity              | FinServe Use                |
| ------------------ | ------------------------------ | ------------------------------- | --------------------------- |
| Ford-Fulkerson     | Augmenting paths               | O(E * max_flow)                 | Transaction flow            |
| Edmonds-Karp       | BFS augmenting paths           | O(V * E^2)                      | Financial network capacity  |
| Dinic              | Level graph + blocking flow    | O(V^2 * E)                      | Larger transaction networks |
| Bipartite Matching | Augmenting paths               | O(V * E)                        | Analyst-case assignment     |
| Min-Cut            | Max-flow residual reachability | Based on max-flow algorithm     | Critical channels           |

## 8. Testing Results
- **Number of tests**: Over 25 distinct assertions across 5 core algorithms.
- **Cross-validation**: Successfully validated that Ford-Fulkerson, Edmonds-Karp, and Dinic's algorithms all produce identically correct max-flow values for standardized graphs. Validated that Maximum Flow equals Minimum Cut Capacity.
- **Final pass percentage**: 100%

## 9. Viva Questions
**Q: What is a flow network?**
A: A directed graph where each edge has a capacity, used to model flow from a source to a sink.
**Q: What is residual capacity?**
A: The remaining capacity on a given edge, including virtual "reverse" edges representing the ability to undo flow.
**Q: What is the max-flow/min-cut theorem?**
A: It states that the maximum amount of flow passing from the source to the sink is equal to the minimum capacity that, when removed, disconnects them.
