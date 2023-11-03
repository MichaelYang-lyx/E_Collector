// <reference types="vite/client" />


declare module '*.css' {
  const css: { [key: string]: string };
  export default css;
}
declare module '*.json';
declare module '*.png';
declare module 'react-markup';

declare interface Window {
  ethereum: any;
}

