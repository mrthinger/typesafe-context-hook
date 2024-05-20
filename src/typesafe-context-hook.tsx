import React, {
  createContext,
  useContext,
  type FC,
  type ReactNode,
} from "react";

type ProviderProps<TArgs> = {
  children?: ReactNode;
} & TArgs;

type Result<TValue, TName extends string, TArgs> = {
  [K in `use${TName}` | `${TName}Provider`]: K extends `use${TName}`
    ? () => TValue
    : K extends `${TName}Provider`
    ? FC<ProviderProps<TArgs>>
    : never;
};

function typesafeContextHook<
  TName extends string,
  TValue,
  TArgs extends object
>(name: TName, hook: (args: TArgs) => TValue): Result<TValue, TName, TArgs> {
  const Context = createContext<TValue | null>(null);

  const Provider: FC<ProviderProps<TArgs>> = ({ children, ...args }) => {
    const value = hook(args as TArgs);
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  function useNamedCustomHook(): TValue {
    const value = useContext(Context);

    if (value === null) {
      throw new Error(`use${name} must be used within a ${name}Provider`);
    }

    return value;
  }

  return {
    [`use${name}`]: useNamedCustomHook,
    [`${name}Provider`]: Provider,
  } as Result<TValue, TName, TArgs>;
}

export default typesafeContextHook;
