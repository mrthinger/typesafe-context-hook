import React, {
  createContext,
  useContext,
  type FC,
  type ReactNode,
} from "react";

type ProviderProps<TArgs extends any[]> = {
  children?: ReactNode;
  args?: TArgs;
};

type Result<TValue, TName extends string, TArgs extends any[]> = {
  [K in
    | `use${TName}`
    | `${TName}Provider`
    | `with${TName}`]: K extends `use${TName}`
    ? () => TValue
    : K extends `${TName}Provider`
    ? FC<ProviderProps<TArgs>>
    : K extends `with${TName}`
    ? <TProps extends object>(
        WrappedComponent: React.ComponentType<TProps>
      ) => (props: TProps) => JSX.Element
    : never;
};

function typesafeContextHook<
  TName extends string,
  TValue = any,
  TArgs extends any[] = []
>(name: TName, hook: (...args: TArgs) => TValue): Result<TValue, TName, TArgs> {
  const Context = createContext<TValue | null>(null);

  const Provider: FC<ProviderProps<TArgs>> = ({
    children,
    args = [] as unknown as TArgs,
  }) => {
    const value = hook(...args);
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
    WrappedComponent: React.ComponentType<TProps>
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
  } as Result<TValue, TName, TArgs>;
}

export default typesafeContextHook;
