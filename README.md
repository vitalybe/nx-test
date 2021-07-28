# Qwilt-NX

## Generation

* New app - `nx workspace-generator app <NAME> --addE2e=<false|true>`
  * Add e2e to project without - `nx workspace-generator addE2e --appName=<name>`
* New lib - `nx workspace-generator lib <NAME>`

## NX Development

### Generator

#### Adding a generator

* `nx g workspace-schematic app`

#### Debugging

  * Make sure everything is committed
  * Modify the generator
  * Run `git add tools/generators && git checkout -- . && git clean -df && nx workspace-generator app bla`

