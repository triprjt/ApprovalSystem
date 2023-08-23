import { apiPaths } from "@constants/api";
import { IILogin, ILoginResponse } from "@MyTypes/login.type";
import axios from "axios";

import { IBaseService } from "./baseService.service";

export class IAuthService extends IBaseService {
  public static instance: IAuthService | null = null;
  constructor() {
    super(apiPaths.sign_in);
  }
  /**
   * The login function sends a POST request with login credentials and sets the token if successful.
   * @param {IILogin} prop - The parameter `prop` is of type `IILogin`, which is an interface
   * representing the login properties. It likely contains information such as the username and
   * password needed for authentication.
   * @returns The login function returns a boolean value. It returns true if a token is successfully
   * obtained from the response data and set using the setToken method. It returns false if no token is
   * found in the response data.
   */
  public async login(prop: IILogin) {
    try {
      const response = await super.post<ILoginResponse>(prop);
      const token = response.data;
      if (!token.token) return false;
      this?.setToken(JSON.stringify(token));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  public isAuth() {
    const token = this.getToken();
    return !!token?.token;
  }
  public getAuth() {
    const token = this.getToken();
    return token;
  }
  public logout(callback: () => void) {
    localStorage.clear();
    return callback();
  }
  public _login(prop: IILogin) {
    axios
      .post(`http://localhost:8000/api/v1/api-token-auth/`, prop)
      .then((response) => {
        // Handle the successful response
        console.log("Authentication successful");
        console.log("Token:", response.data);
      })
      .catch((error) => {
        // Handle errors
        console.log("Authentication error:", error);
      });
  }
}
