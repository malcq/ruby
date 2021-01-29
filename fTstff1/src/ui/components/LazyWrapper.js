import React, { memo, Suspense } from 'react';

export default (Component) => memo(
  () => (
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  )
);
