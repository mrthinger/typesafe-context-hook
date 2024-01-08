import React, { createContext, useContext, type FC, type ReactNode } from "react";

type ProviderProps = {
  children?: ReactNode;
};

type Result<TValue, TName extends string> = {
  [K in `use${TName}` | `${TName}Provider` | `with${TName}`]: K extends `use${TName}`
    ? () => TValue
    : K extends `${TName}Provider`
    ? FC<ProviderProps>
    : K extends `with${TName}`
    ? <TProps extends object>(WrappedComponent: React.ComponentType<TProps>) => (props: TProps) => JSX.Element
    : never;
};

function typesafeContextHook<TName extends string, TValue = any>(name: TName, hook: () => TValue): Result<TValue, TName> {
  const Context = createContext<TValue | null>(null);

  const Provider: FC<ProviderProps> = ({ children }) => {
    const value = hook();
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  function useNamedCustomHook(): TValue {
    const value = useContext(Context);

    if (value === null) {
      throw new Error(`use${name} must be used within a ${name}Provider`);
    }

    return value;
  }

  function withHook<TProps extends object>(
    WrappedComponent: React.ComponentType<TProps>,
  ) {
    return function WrappedWithHook(props: TProps) {
      return (
        <Provider>
          <WrappedComponent {...props} />
        </Provider>
      );
    };
  }

  return {
    [`use${name}`]: useNamedCustomHook,
    [`${name}Provider`]: Provider,
    [`with${name}`]: withHook,
  } as Result<TValue, TName>;
}

export default typesafeContextHook;
