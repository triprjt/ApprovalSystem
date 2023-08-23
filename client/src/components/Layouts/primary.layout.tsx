import { _AppBar } from "@components";
import { Container } from "@mui/material";
import { Login } from "@pages/auth";

import { sdk } from "@/services/sdk.service";
type IPrimaryLayout = {
  children: React.ReactNode;
};
export default function PrimaryLayout(prop: IPrimaryLayout): JSX.Element {
  const isAuth = sdk.auth.isAuth();

  if (!isAuth) return <Login />;

  return (
    <Container>
      <_AppBar />
      {prop.children}
    </Container>
  );
}
