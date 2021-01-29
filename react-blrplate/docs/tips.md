# Useful tips
## New page
- Create foler for the new page in the `src/pages` folder. Maybe you will need to create subdirrectories for subroutes. It will make files more readable.

- Import this page to the `src/routes/index.js` file and add it to the `routes` array with required properties. Maybe you will need to create subdirrectories for subroutes or add this page to or add this page to existing subroute file. It will make files more readable.

- If you need to create some components just for this page you need to create `components` folder in the page dirrectory. If you have some very large component with some subcomponents which is using only for this compoennt you can create folder just for this component like this:
```
--pageFolder
  --components
    --componentName
      index.js – component file
      --components
        subcomponent.js - subcomponent file
```

## New global component
If you need to create UI component for all app you need to create a file in the `src/ui/components` folder. Or folder like in was before, only in this dirrectory instead of `pageFolder`.