import yargs from 'yargs';

export async function command() {
  return yargs.options({
    port: {
      alias: 'p',
      type: 'number',
      default: 8000,
      description: 'server port',
    },
    method: {
      alias: 'm',
      type: 'string',
      default: 'get',
      description: 'request method',
    },
    url: {
      alias: 'u',
      type: 'string',
      required: false,
      description: 'report url',
    },
  }).argv;
}
