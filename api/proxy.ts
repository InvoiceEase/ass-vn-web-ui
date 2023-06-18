import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { parse } from 'url';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Split the request URL into its components
  const parsedUrl = parse(req.url!, true);
  // The first part of the path will be the base URL (protocol + domain + port) of the backend service
  const [_, encodedBackendURL, ...pathParts] = parsedUrl.pathname!.split('/');
  // Decode the backend URL
  const backendURL = decodeURIComponent(encodedBackendURL);
  // The rest of the path is the endpoint on the backend service
  const endpoint = pathParts.join('/');

  const config: AxiosRequestConfig = {
    url: `${backendURL}/${endpoint}`,
    method: req.method as any,
    headers: req.headers,
    params: req.query,
    data: req.body,
  };

  try {
    const backendResponse = await axios(config);
    res.status(backendResponse.status).json(backendResponse.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.log(axiosError.response.data);
      console.log(axiosError.response.status);
      console.log(axiosError.response.headers);
      res.status(axiosError.response.status).json(axiosError.response.data);
    } else if (axiosError.request) {
      console.log(axiosError.request);
      res.status(500).json({ error: 'Proxy fetch failed', requestError: axiosError.request });
    } else {
      console.log('Error', axiosError.message);
      res.status(500).json({ error: 'Proxy fetch failed', message: axiosError.message });
    }
  }
}
