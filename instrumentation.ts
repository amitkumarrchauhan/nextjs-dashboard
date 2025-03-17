export async function register() {
  // await import('package-with-side-effect');
  const { EurekaClient } = await import('./eureka.client');
  // console.log('NextJS server started, now registering with Eureka ...');

  console.log('EurekaClient ==> ', EurekaClient);
  // setTimeout(() => {
  EurekaClient.initAndStart();
  // }, 1000);
}
