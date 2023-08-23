/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/anchor-is-valid */

import { paths } from "@constants/paths";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { sdk } from "@/services/sdk.service";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href={window.location.origin}>
        {window.location.hostname}
      </Link>{" "}
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function SignIn() {
  const loading = React.useRef<boolean>(false);
  const notify = () => toast("Login Successful!");

  /**
   * The handleSubmit function is an asynchronous function that handles form submission in a TypeScript
   * React application, extracting the password and username from the form data, making a login request
   * using an SDK, and navigating to the home page if the login is successful.
   * @param event - The event parameter is of type React.FormEvent<HTMLFormElement>. It represents the
   * form submission event triggered by the user.
   * @returns If the payload's password or username is empty, nothing is being returned. Otherwise, if
   * the response from the sdk.auth.login() function is truthy, the navigate("/") function is being
   * called.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loading.current = true;
    const data = new FormData(event.currentTarget);
    const payload = {
      password: data.get("password")?.toString() || "",
      username: data.get("email")?.toString() || "",
    };
    if (!payload.password || !payload.username) return;
    const response = await sdk.auth.login(payload);
    if (response) {
      notify();
      return (window.location.href = "/");
    }
  };

  return (
    <Grid item xs={12} sm={12} md={12} lg={6} xl={4}>
      <Container maxWidth={"xs"}>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              disabled={loading.current}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </Grid>
  );
}
