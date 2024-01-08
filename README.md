# typesafe-context-hook

A react-typescript utility for creating typesafe React context hooks.

## Installation
```bash
pnpm i typesafe-context-hook
```

```bash
npm i typesafe-context-hook
```

```bash
yarn i typesafe-context-hook
```

## Usage

```tsx
import typesafeContextHook from 'typesafe-context-hook';
import { useState } from 'react';

export const { useName, NameProvider, withName } = typesafeContextHook('Name', () => {
  const [name, setName] = useState('John Doe');
  return { name, setName };
});
```

```tsx
// In another file
import { useName, NameProvider } from './name-context.tsx';

function App() {
  return (
    <NameProvider>
      <AnotherComponent />
    </NameProvider>
  );
}

function AnotherComponent() {
  const { name, setName } = useName();
  // Now you can use name and setName in this component
}
```


