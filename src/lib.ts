import { createCadlLibrary, paramMessage } from "@cadl-lang/compiler";

export const libDef = {
  name: "cadl2Py",
  diagnostics: {
  }
} as const;
const lib = createCadlLibrary(libDef);
export const { reportDiagnostic } = lib;

export type FunctionLibrary = typeof lib;