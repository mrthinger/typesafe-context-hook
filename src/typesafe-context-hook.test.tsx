import React from "react";
import typesafeContextHook from "./typesafe-context-hook";

export const { useExampleContext, ExampleProvider } = typesafeContextHook(
  "Example",
  ({ exampleId }: { exampleId: string }) => {}
);

export const ExampleComponent = () => {
  return <ExampleProvider exampleId="123"></ExampleProvider>;
};
