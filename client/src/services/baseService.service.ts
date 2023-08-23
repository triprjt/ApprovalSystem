/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import apiUrl from "@constants/api";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export class IBaseService {
  private axiosInstance: AxiosInstance;
  private tokenAddress = "_token";
  private path: string;

  constructor(path: string) {
    this.axiosInstance = axios.create({
      baseURL: apiUrl,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
    this.path = path;

    // Add request and response interceptors
    this.axiosInstance.interceptors.request.use(this.handleRequest);
    this.axiosInstance.interceptors.response.use(this.handleResponse);
  }

  /**
   * The handleRequest function adds an Authorization header to the Axios request config if a token is
   * available.
   * @param {AxiosRequestConfig} config - The `config` parameter is an object that contains the Axios
   * request configuration, such as the request URL, method, headers, and data.
   * @returns the updated AxiosRequestConfig object with the Authorization header added.
   */
  private handleRequest(config: AxiosRequestConfig): AxiosRequestConfig {
    const value = localStorage.getItem("_token");
    const token = JSON.parse(value || "{}");
    if (!token?.token) return config;
    config.headers = {
      Authorization: "Token " + token.token,
      ...config.headers,
    };
    return config;
  }

  /**
   * The function "handleResponse" returns the AxiosResponse object.
   * @param {AxiosResponse} response - The `response` parameter is of type `AxiosResponse`, which is a
   * generic type provided by the Axios library. It represents the response received from an HTTP
   * request made using Axios.
   * @returns the AxiosResponse object.
   */
  private handleResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }

  /**
   * The function "handleResponseError" returns a rejected promise with the given error.
   * @param {any} error - The error parameter is of type "any", which means it can be any type of error
   * object.
   * @returns a Promise that is rejected with the provided error.
   */

  /**
   * The function is an asynchronous method that makes a GET request to a specified URL and returns the
   * response data.
   * @param {string} url - The `url` parameter is a string that represents the URL of the API endpoint
   * you want to make a GET request to. It specifies the location where the request should be sent.
   * @param {AxiosRequestConfig} [config] - The `config` parameter is an optional object that allows you
   * to customize the request configuration. It can include properties such as headers, query parameters,
   * request timeout, authentication credentials, and more.
   * @returns a Promise that resolves to a value of type T.
   */
  protected async get<T>(config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(this.path, config);
    return response.data;
  }
  protected async custom<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance(path, config);
    return response.data;
  }

  // Public method for making POST requests
  protected async post<T>(data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response = await this.axiosInstance.post<T>(this.path, data, {
      ...config,
      method: "post",
    });
    return response;
  }
  protected async put<T>(data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response = await this.axiosInstance.put<AxiosResponse<T>>(this.path, data, config);
    return response.data;
  }
  protected getToken() {
    const value = localStorage.getItem(this.tokenAddress);
    const parsedValue = JSON.parse(value || "{}");

    return parsedValue;
  }
  protected setToken(token: string) {
    return localStorage.setItem(this.tokenAddress, token);
  }
}
