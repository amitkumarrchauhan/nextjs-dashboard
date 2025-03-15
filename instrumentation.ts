import { EurekaClient } from './eureka.client';

export async function register() {
  // await import('package-with-side-effect');
  console.log('NextJS server started, now registering with Eureka ...');

  EurekaClient.initAndStart();
}
