## Storage
If you need to work with the local storage you can install `storage-tool` package.

## [Docs](https://www.npmjs.com/package/storage-tool)

## Example of ussage
### Create your class
```js
import InitialStorage from 'storage-tool';

export default class Storage extends InitialStorage {
  static TOKEN_NAME = 'userToken';

  static REFRESH_TOKEN_NAME = 'userRefreshToken';

  static get token() {
    return this.getItem(this.TOKEN_NAME);
  }

  static set token(value) {
    this.setItem(this.TOKEN_NAME, value);
  }

  static get refreshToken() {
    return this.getItem(this.REFRESH_TOKEN_NAME);
  }

  static set refreshToken(value) {
    this.setItem(this.REFRESH_TOKEN_NAME, value);
  }
}

```
### Use where you need
```js
import Storage from './Storage';

const token = Storage.token; // To get value
Storage.token = 'some value'; // To set value
```