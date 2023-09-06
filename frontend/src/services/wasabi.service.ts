import { Axios } from 'axios/axios';
import { DBStores, addData, getData, removeData } from './indexDB.service';

const currentFetchingPaths: Array<string> = [];

const getWasabiPresignedUrlServer = async (data: { path: string }) => {
  const { path } = data;
  try {
    currentFetchingPaths.push(path);
    const pathInfo = await Axios.get('/files', {
      params: { keyPath: path },
    });
    return pathInfo;
  } catch (error) {
    return null;
  } finally {
    currentFetchingPaths.splice(currentFetchingPaths.indexOf(path), 1);
  }
};

const getAlreadyFetchedPath = async (path: string) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getPresignedImageUrl(path)), 300);
  });
};

export const getPresignedImageUrl = async (path: string, caching = true) => {
  // HELLO
  if (!path) return '';

  const data: any = await getData(DBStores.FILES, path);

  const currentTs = Math.floor(Date.now() / 1000);

  if (data && currentTs <= data.expiresIn && caching) {
    return data.url;
  }

  const isExpired = data && currentTs > data.expiresIn;
  if (isExpired) {
    await removeData(DBStores.FILES, path);
  }

  const isAlreadyFetching = currentFetchingPaths.includes(path);

  if (!isAlreadyFetching) {
    const response: any = await getWasabiPresignedUrlServer({ path });

    if (response && response.data) {
      const { url, expiresIn: expire } = response.data;

      /* Before 5 Minutes */
      const expInSeconds = Math.floor(Date.now() / 1000) - 5 * 60;
      const expiresIn = expInSeconds + expire;

      const fileInfo = { path, url, expiresIn };

      if (caching) {
        await addData(DBStores.FILES, fileInfo);
      }

      return fileInfo.url;
    }

    return '';
  }

  return getAlreadyFetchedPath(path);
};
