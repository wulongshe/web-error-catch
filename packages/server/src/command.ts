import yargs from 'yargs';

export async function command() {
  return yargs.options({
    port: {
      alias: 'p',
      type: 'number',
      default: 6000,
      description: 'server port',
    },
  }).argv;
}
