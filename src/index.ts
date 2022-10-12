import {
  Program,
  getIntrinsicModelName,
  navigateProgram,
  Type,
} from "@cadl-lang/compiler";

import "./lib.js";
import path from "path";
import { writeFile } from "fs/promises";


const functionKey = Symbol();

export async function $onEmit(p: Program) {
  if (!p.compilerOptions.outputPath) return;

  const e = createFunctionsEmitter(p, p.compilerOptions.outputPath);
  await e.emit();
}
var globalStmt = "from dataclasses import dataclass\n@dataclass\n"
function createFunctionsEmitter(program: Program, basePath: string) {
  const apiPath = path.join(basePath, "");
  navigateProgram(program, {
    model(m) {
      if (m.namespace?.name === "Cadl") {
      }
      else {
        var script = '';
        if (m.baseModel) {
          var baseModelName = m.baseModel.name;
          script = "from " + baseModelName + " import " + baseModelName + "\n";
          script += globalStmt;
          script += "class " + m.name + "(" + baseModelName + "):\n";
        } else {
          script = globalStmt;
          script += "class " + m.name + ":" + "\n";
        }
        console.log(m.name)
        m.properties.forEach(function (property) {
          var type = property.type;
          var value;
          var additionalImports = '';
          if (type.kind == 'Enum') {
            value = writeEnumFile(type, apiPath);
            additionalImports = "from " + value + " import " + value + "\n";
          } else {
            value = getModelType(getIntrinsicModelName(program, type));
          }
          script += writeFields(property.name, value);
          if (additionalImports.length > 0) {
            additionalImports += script;
            script = additionalImports;
            additionalImports = '';
          }
        });
        writeFile(path.join(apiPath, m.name + ".py"), script);
      }
    }

  })

  return {
    emit,
  };

  async function emit() {
    console.log('TODO Async')
  }
}

function getModelType(name: String) {
  console.log(name)
  switch (name) {
    case "bytes":
      return "byte"
    case "int8":
    case "int16":
    case "int32":
    case "int64":
    case "safeint":
    case "uint8":
    case "uint16":
    case "uint32":
    case "uint64":
      return "int"
    case "string": return "str"
    case "boolean": return "bool"

  }
}

function writeEnumFile(type: Type, apiPath: string) {
  if (type.kind == 'Enum') {
    var script = "from enum import Enum \n";
    script += globalStmt;
    script += "class " + type.name + "(Enum):\n";
    type.members.forEach(function (val) {
      script += "\t" + val.name + " = '" + val.value + "'\n";
    });
    writeFile(path.join(apiPath, type.name + ".py"), script);
    return type.name;
  }
}

function writeFields(name: string, type: any) {
  return "\t" + name + " : " + type + "\n";
}
