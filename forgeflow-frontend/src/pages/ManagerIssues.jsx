import { useParams } from "react-router-dom";
import IssueContainer from "./IssueContainer";

export default function ManagerIssues() {

  const { projectId } = useParams();

  return (
    <IssueContainer
      scope="manager"
      projectId={projectId}
    />
  );
}