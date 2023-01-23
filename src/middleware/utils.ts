import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { GetServerSidePropsContext } from 'next';
import Router from 'next/router';

const SECRET_KEY = process.env.JWT_KEY ?? 'FAMILYTREE';

/*
 * @params {jwtToken} extracted from cookies
 * @return {object} object of extracted token
 */
export async function verifyToken(jwtToken: string) {
  try {
    return jwt.verify(jwtToken, SECRET_KEY);
  } catch (e) {
    console.log(e);
    return null;
  }
}

/*
 * @params {request} extracted from request response
 * @return {object} object of parse jwt cookie decode object
 */
export function getAppCookies(req: GetServerSidePropsContext['req']) {
  const parsedItems: { [key: string]: string } = {};
  if (req.headers.cookie) {
    const cookiesItems = req.headers.cookie.split('; ');
    cookiesItems.forEach((cookies) => {
      const parsedItem = cookies.split('=');
      parsedItems[parsedItem[0]] = decodeURI(parsedItem[1]);
    });
  }
  return parsedItems;
}

/*
 * @params {request} extracted from request response, {setLocalhost} your localhost address
 * @return {object} objects of protocol, host and origin
 */
export function getAbsoluteUrl(req: GetServerSidePropsContext['req']) {
  let protocol = 'https:';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const host: any = req
    ? req.headers['x-forwarded-host'] || req.headers['host']
    : window.location.host;
  if (host.indexOf('localhost') > -1) {
    protocol = 'http:';
  }
  return {
    protocol: protocol,
    host: host,
    origin: protocol + '//' + host,
    url: req,
  };
}

/*
 * @params {none} set action for logout and remove cookie
 * @return {function} router function to redirect
 */
export function setLogout() {
  Cookies.remove('token');
  Router.push('/');
}
