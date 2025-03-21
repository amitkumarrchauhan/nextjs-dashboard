export async function register() {
  console.log('process.env.NEXT_RUNTIME ==> ', process.env.NEXT_RUNTIME);

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // await import('package-with-side-effect');
    const { EurekaClient } = await import('./eureka.client');
    // console.log('NextJS server started, now registering with Eureka ...');

    console.log('EurekaClient ==> ', EurekaClient);
    // setTimeout(() => {
    const port = process.env.PORT || process.env.APP_PORT || 3000;
    const appName = process.env.APP_NAME || 'dashboard-ui';

    EurekaClient.initAndStart({
      port: parseInt(port + '', 10),
      appName,
    });
    // }, 1000);
  }
}
