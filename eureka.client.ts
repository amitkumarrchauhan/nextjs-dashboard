// import Eureka from 'eureka-js-client';
import { Eureka } from 'eureka-js-client';

// Or, if you're not using a transpiler:
// const Eureka = require('eureka-js-client').Eureka;

// example configuration
const client: Eureka = new Eureka({
  // application instance information
  instance: {
    app: 'nextjsDashboard',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',

    port: {
      $: 3000,
      '@enabled': true,
    },
    vipAddress: 'nextjsDashboard',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    // eureka server host / port
    host: '127.0.0.1',
    port: 8761,
  },
});

const EurekaClient = {
  initAndStart: (config = {}) => {
    try {
      console.log('Initializing Eureka Client ...');
      // create eureka cleint and register with eureka server
      console.log('Initialization Eureka Client completed.\n');
      console.log('Starting Eureka Client ...');
      client.start();
      console.log('Eureka Client Started successfully.\n');
    } catch (error) {
      console.log('Error occurred !!!', error);
    }
  },
  start: () => {
    client.start();
  },
  stop: () => {
    client.stop();
  },
  getInstancesByAppId: (appId: string) => {
    const instances = client.getInstancesByAppId(appId);

    if (instances.length === 1) {
      return instances[0];
    }

    throw new Error(`No instance found for ${appId}`);
  },
  getInstancesByVipAddress: (vipAddress: string) => {
    const instances = client.getInstancesByVipAddress(vipAddress);

    return instances;
  },
};

export { EurekaClient };
