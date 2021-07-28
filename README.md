# Qwilt-NX

## Generation

* New app - `nx workspace-generator app <NAME>`
* New lib - `nx workspace-generator lib <NAME>`

## NX Development

### Generator

#### Adding a generator

* `nx g workspace-schematic app`

#### Debugging

  * Make sure everything is committed
  * Modify the generator
  * Run `git add tools/generators && git checkout -- . && git clean -df && nx workspace-generator app bla`

