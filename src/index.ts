import {
    createDecoratorDefinition,
    DecoratorContext,
    InterfaceType,
    NamespaceType,
    OperationType,
    Program,
    getIntrinsicModelName,
    Type,
    ModelType,
    navigateProgram,
  } from "@cadl-lang/compiler";
  
  import "./lib.js";
  import path from "path";
  import { writeFile, mkdir } from "fs/promises";
  
  
  const functionKey = Symbol();
  
  export async function $onEmit(p: Program) {
    if (!p.compilerOptions.outputPath) return;
  
    const e = createFunctionsEmitter(p, p.compilerOptions.outputPath);
    await e.emit();
  }

  function createFunctionsEmitter(program: Program, basePath: string) {
    const apiPath = path.join(basePath, "");
    navigateProgram(program, {
        model(m) {
          if (m.namespace?.name === "Cadl") {
          }
          else{
            var script="class "+m.name +"{"+"\n";
            m.properties.forEach(function (value) {
                script+=value.name + ": "+getIntrinsicModelName(program,value.type)+"\n";
                console.log(getIntrinsicModelName(program,value.type))
            });
            script+="}"
            writeFile(path.join(apiPath, m.name+".python"), script);          
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

