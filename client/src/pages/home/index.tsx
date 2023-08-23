import { PrimaryLayout } from "@components";
import { paths } from "@constants/paths";
import { Button } from "@mui/material";
import { NavigateFunction, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate: NavigateFunction = useNavigate();

  return (
    <PrimaryLayout>
      <Button onClick={() => navigate(paths.create_proposal)}>create proposal</Button>
      <Button onClick={() => navigate(paths.pending_approval)}>pending approval</Button>
    </PrimaryLayout>
  );
}
