#!/bin/sh
uglifyjs --comments --mangle --compress --output dist/eventjs.min.js src/callbacklist.js src/eventdispatcher.js src/eventqueue.js src/mixins/mixinfilter.js
uglifyjs --comments --mangle --compress --output dist/eventjs.cd.min.js src/callbacklist.js src/eventdispatcher.js
uglifyjs --comments --mangle --compress --output dist/eventjs.cdq.min.js src/callbacklist.js src/eventdispatcher.js src/eventqueue.js
perl tools/minifymore.pl dist/eventjs.min.js
perl tools/minifymore.pl dist/eventjs.cd.min.js
perl tools/minifymore.pl dist/eventjs.cdq.min.js
