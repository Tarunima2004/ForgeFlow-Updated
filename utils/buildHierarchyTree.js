/**
 * Converts a flat list of issues into a hierarchical tree.
 *
 * Hierarchy:
 * Epic
 *   └── Story
 *         ├── Task
 *         ├── Bug
 *         └── Improvement
 */
export function buildHierarchyTree(issues = []) {
  const issueMap = new Map();
  const rootIssues = [];

  // Pass 1: Create normalized nodes
  issues.forEach((issue) => {
    issueMap.set(issue.id, {
      ...issue,

      // Frontend-only properties
      children: [],
      hasChildren: false,
      childCount: 0,
      depth: 0,
      expanded: true,
    });
  });

  // Pass 2: Build the hierarchy
  issueMap.forEach((issue) => {
    if (issue.parent_issue_id) {
      const parent = issueMap.get(issue.parent_issue_id);

      if (parent) {
        issue.depth = parent.depth + 1;
        parent.children.push(issue);
      } else {
        // Parent not found, treat as root
        rootIssues.push(issue);
      }
    } else {
      rootIssues.push(issue);
    }
  });

  // Pass 3: Calculate child counts recursively
  function updateMetadata(node) {
    node.hasChildren = node.children.length > 0;

    node.children.forEach(updateMetadata);

    node.childCount = node.children.length;
  }

  rootIssues.forEach(updateMetadata);

  return rootIssues;
}