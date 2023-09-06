// =================== import packages ==================
import { useState } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
// ======================================================
import { Axios } from 'axios/axios';
import { apiResponseType } from 'pages/types';

export const useAxiosGet = (): [
  (
    url: string,
    config?: AxiosRequestConfig<object>,
    baseUrl?: boolean
  ) => Promise<{ data?: any; error?: any }>,
  { isLoading: boolean; isError: boolean; isSuccess: boolean }
] => {
  // ================= State ====================
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getRequest = async (
    url: string,
    config: AxiosRequestConfig<object> = {},
    baseUrl = true
  ) => {
    try {
      setIsSuccess(false);
      setIsLoading(true);

      let response: AxiosResponse<any, any>;
      if (baseUrl) {
        response = await Axios.get(url, { ...config });
      } else {
        response = await axios(url, { ...config });
      }

      setIsLoading(false);
      setIsSuccess(true);
      return { data: response.data };
    } catch (error: any) {
      const typedError = error as apiResponseType;
      setIsError(true);
      setIsLoading(false);
      return {
        error: typedError?.message || error?.message || error,
        data: typedError?.data,
      };
    }
  };

  return [getRequest, { isLoading, isError, isSuccess }];
};

export const useAxiosPost = (): [
  (
    url: string,
    data: object,
    config?: AxiosRequestConfig<object>
  ) => Promise<{ data?: any; error?: any }>,
  { isLoading: boolean; isError: boolean; isSuccess: boolean }
] => {
  // ================= State ====================
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const postRequest = async (
    url: string,
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    try {
      setIsSuccess(false);
      setIsLoading(true);
      setIsError(false);
      const response = await Axios.post(url, data, { ...config });
      setIsLoading(false);
      setIsSuccess(true);
      return { data: response.data };
    } catch (error: any) {
      const typedError = error as apiResponseType;
      setIsError(true);
      setIsLoading(false);
      return {
        error: typedError?.message || error?.message || error,
        data: typedError?.data,
      };
    }
  };

  return [postRequest, { isLoading, isError, isSuccess }];
};

export const useAxiosPut = (): [
  (
    url: string,
    data: object,
    config?: AxiosRequestConfig<object>
  ) => Promise<{ data?: any; error?: any }>,
  { isLoading: boolean; isError: boolean; isSuccess: boolean }
] => {
  // ================= State ====================
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const putRequest = async (
    url: string,
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    try {
      setIsSuccess(false);
      setIsLoading(true);
      setIsError(false);
      const response = await Axios.put(url, data, { ...config });
      setIsLoading(false);
      setIsSuccess(true);
      return { data: response.data };
    } catch (error: any) {
      const typedError = error as apiResponseType;
      setIsError(true);
      setIsLoading(false);
      return {
        error: typedError?.message || error?.message || error,
        data: typedError?.data,
      };
    }
  };

  return [putRequest, { isLoading, isError, isSuccess }];
};

export const useAxiosPatch = (): [
  (
    url: string,
    data: object,
    config?: AxiosRequestConfig<object>
  ) => Promise<{ data?: any; error?: any }>,
  { isLoading: boolean; isError: boolean; isSuccess: boolean }
] => {
  // ================= State ====================
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const putRequest = async (
    url: string,
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    try {
      setIsSuccess(false);
      setIsLoading(true);
      setIsError(false);

      const response = await Axios.patch(url, data, { ...config });

      setIsLoading(false);
      setIsSuccess(true);
      return { data: response.data };
    } catch (error: any) {
      const typedError = error as apiResponseType;
      setIsError(true);
      setIsLoading(false);
      return {
        error: typedError?.message || error?.message || error,
        data: typedError?.data,
      };
    }
  };

  return [putRequest, { isLoading, isError, isSuccess }];
};

// temp patch

export const useTempAxiosPatch = (): [
  (
    url: string,
    data: object,
    config?: AxiosRequestConfig<object>
  ) => Promise<{ data?: any; error?: any }>,
  { isLoading: boolean; isError: boolean; isSuccess: boolean }
] => {
  // ================= State ====================
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const putRequest = async (
    url: string,
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    try {
      setIsSuccess(false);
      setIsLoading(true);
      setIsError(false);
      const response = await Axios.patch(url, data, { ...config });
      setIsLoading(false);
      setIsSuccess(true);
      return { data: response.data };
    } catch (error: any) {
      const typedError = error as apiResponseType;
      setIsError(true);
      setIsLoading(false);
      return {
        error: typedError?.message || error?.message || error,
        data: typedError?.data,
      };
    }
  };

  return [putRequest, { isLoading, isError, isSuccess }];
};

export const useAxiosDelete = (): [
  (
    url: string,
    config?: AxiosRequestConfig<object>
  ) => Promise<{ data?: any; error?: any }>,
  { isLoading: boolean; isError: boolean; isSuccess: boolean }
] => {
  // ================= State ====================
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const deleteRequest = async (
    url: string,
    config: AxiosRequestConfig<object> = {}
  ) => {
    try {
      setIsSuccess(false);
      setIsLoading(true);
      setIsError(false);
      const response = await Axios.delete(url, { ...config });
      setIsLoading(false);
      setIsSuccess(true);
      return { data: response.data };
    } catch (error: any) {
      const typedError = error as apiResponseType;
      setIsError(true);
      setIsLoading(false);
      return {
        error: typedError?.message || error?.message || error,
        data: typedError?.data,
      };
    }
  };

  return [deleteRequest, { isLoading, isError, isSuccess }];
};
