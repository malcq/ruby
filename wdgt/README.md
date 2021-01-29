# 3BACK

3BACK is the first AI-driven app-as-a-service feedback solution that let's brands directly connect customers & PM

## Branch info
This is the embedded widget repository.

## Structure
- `frontend` - angular application for iframe (legacy).
- `new_frontend` - react application for iframe (actual).
- `script` - additional script for embedding application inside iframe. Build with pure typescript, scss and webpack for bundling.

## React application technology stack:
- React 16.12.x
- Create-react-app 3.3.x
- Typescript 3.7.x
- axios 0.19.x
- styled-components 4.3.x
- Redux 4.0.x
- Redux-thunk 2.3.x

## Install
1) Install frontend dependencies:
```bash
cd frontend
npm i
```
2) Install script dependencies:
```bash
cd script
npm i
```

## Development
1) Run frontend on `localhost:3000`:
```bash
cd new_frontend
npm start
```
2) Run script with test page on `localhost:8080`
```bash
cd script
npm start
```
3) Open `localhost:8080` and update code

## Deployment
1) Build frontend application and serve via your server.
(`npm run build`)
2) Build embedding script and serve it via server
(`npm run build`)

## Adding to the 3rd party website
1) Obtain login hashcode from server and put it on your 3rd party site like that:
```html
  <script>
    window['tbwidgetConfig'] = {
      hashcode: 'secret_code'
    }
  </script>
```

2) Add script to the 3rd party website below config with hashcode:
```html
<script src="https://url/to/script/bundle.js"></script>
```

## Caveats
1) If hashcode is not provided, application will throw an error.
2) 3rd party site must be served via `https` to achieve audio recording and file upload on chrome.
3) Script and frontend applications should be served from `https` too.