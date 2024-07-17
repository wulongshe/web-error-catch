import yargs from 'yargs';

export async function command() {
  return yargs.options({
    port: {
      alias: 'p',
      type: 'number',
      default: 8080,
      description: 'server port',
    },
  }).argv;
}
