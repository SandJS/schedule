/**
 * @author Adam Jaso <ajaso@pocketly.com>
 * @copyright 2015 Pocketly
 */

/*
 * NODE: /usr/bin/node is actually io.js
 * /usr/bin/node --es_staging /usr/bin/node-pm demo.js should demonstrate locking
 */

var server;
var cluster = require('cluster');
var lockdConfig = {tcp: '127.0.0.1:9999'};

if (cluster.worker && cluster.worker.id % 16 == 1) {
  server = require('lockd').listen(lockdConfig);
}

setTimeout(function() {
  new (require('sand'))({appPath: __dirname, log: '*'})
    .use(require('sand-lockd'), {all: lockdConfig})
    .use(require('..'), {all: {
      useSandLockd: true,
      allowFailedSchedule: false
    }})
    .start()
    .on('shutdown', function() {
      if (server) {
        server.destroy();
      }
    });
}, 0);
