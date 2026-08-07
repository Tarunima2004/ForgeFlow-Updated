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

  issues.forEach((issue) => {
    issueMap.set(issue.id, {
      ...issue,
      children: [],
      hasChildren: false,
      childCount: 0,
      depth: 0,
      expanded: true,
    });
  });
issues.forEach(issue => {

});
  issueMap.forEach((issue) => {
    if (issue.parent_issue_id) {
      const parent = issueMap.get(issue.parent_issue_id);
      if (parent) {
        issue.depth = parent.depth + 1;
        parent.children.push(issue);
      } else {
        rootIssues.push(issue);
      }
    } else {
      rootIssues.push(issue);
    }
  });

  function updateMetadata(node) {
    node.hasChildren = node.children.length > 0;
    node.children.forEach(updateMetadata);
    node.childCount = node.children.length;
  }

  rootIssues.forEach(updateMetadata);
  return rootIssues;
}
