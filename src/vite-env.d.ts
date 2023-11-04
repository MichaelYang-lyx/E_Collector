// <reference types="vite/client" />


declare module '*.css' {
  const css: { [key: string]: string };
  export default css;
}
declare module '*.json';
declare module '*.png';
declare module 'react-markup';

interface Window {
  ethereum: any;
}

