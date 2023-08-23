/* eslint-disable @typescript-eslint/naming-convention */
import { paths } from "@constants/paths";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
// import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import { sdk } from "@/services/sdk.service";
export default function _AppBar() {
  const navigate = useNavigate();

  /**
   * The handleLogout function navigates to the login page.
   */
  const handleLogout = () => {
    navigate(paths.login);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            textTransform={"capitalize"}
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            <Link style={{ textDecoration: "none", color: "white" }} to={"/"}>
              {"home"}
            </Link>
          </Typography>

          <Button onClick={() => sdk.auth.logout(handleLogout)} color="inherit">
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
