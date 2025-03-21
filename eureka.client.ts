// import Eureka from 'eureka-js-client';
import { Eureka } from 'eureka-js-client';

// Or, if you're not using a transpiler:
// const Eureka = require('eureka-js-client').Eureka;
export type EurekaClientConfig = {
  port: number;
  appName: string;
};

let client: Eureka;

const EurekaClient = {
  initAndStart: (_config: EurekaClientConfig) => {
    try {
      console.log('Initializing Eureka Client ...', _config);
      const { port, appName } = _config;
      client = new Eureka({
        // application instance information
        instance: {
          instanceId: `${appName}:${port}`,
          app: appName,
          homePageUrl: `http://localhost:${port}`,
          hostName: 'localhost',
          ipAddr: '127.0.0.1',
          port: {
            $: port,
            '@enabled': true,
          },
          vipAddress: appName, /// this is checked by discovery server
          dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
          },
        },
        eureka: {
          // eureka server host / port
          host: 'localhost',
          port: 8761,
          servicePath: '/eureka/apps',
        },
      });
      // create eureka client and register with eureka server
      console.log('Initialization Eureka Client completed.\n');
      console.log('Starting Eureka Client ...');
      client.start((err, ...rest) => {
        if (err) {
          console.log(
            '\nEureka Client failed to register !!!\n --- \n',
            err.message,
            '\n --- \n',
            err.name,
            '\n --- \n',
            rest,
          );
          return;
        }

        console.log('Eureka Client registered successfully.');
      });
    } catch (error) {
      console.log('Error occurred !!!', error);
    }
  },

  start: () => {
    if (!client) {
      throw new Error('Eureka Client not initialized !!!');
    }

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
