# cadl2Py

A prototype emitter for Cadl models to Python class


## Usage

Add the following to your `cadl-project.yaml`:

```yaml
emitters:
  "cadl2Py": true
```
## How to run on local without npm install
1. Run 
``` npx tsc -p . ```
   
2.Run 
``` cadl compile sample/typescript.cadl ```

NOTE: Make sure you run npm install to install all dependency 

