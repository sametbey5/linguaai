// Fix: Remove missing 'vite/client' reference and define process.env type for API_KEY usage.
declare var process: {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  }
}
