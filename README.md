# Event Emitter

## Examples

### Bus

```javascript
import { EventEmitter } from 'event-emitter';

const emitter = new EventEmitter();

emitter.listen('user.created', () => {
    
});

emitter.emit('user.created');
```

### Mixin

```javascript
import { EventEmitter } from 'event-emitter';

export default class Connection {
    // your methods...
}

EventEmitter.mixin(Connection);
```

```javascript
import Connection from './connection';

const connection = new Connection();

connection.listen('disconnected', () => {
    console.log('Connection lost...');
});

connection.emit('disconnected');
```

