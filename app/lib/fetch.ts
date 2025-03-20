const gatewayHost = 'http://localhost:9000';

const fetchData = async (...args: [RequestInfo, RequestInit?]) => {
  const [url, options] = args;
  const finalUrl = gatewayHost + url;
  
  console.log('fetching data from: ', finalUrl);

  return fetch(...[finalUrl, options]);  
};

export { fetchData };
