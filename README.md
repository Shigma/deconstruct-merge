# deconstruct-merge

First deconstruct, then merge.

## Examples

```js
const Mergeable = require('deconstruct-merge')
const config = new Mergeable({
  foo: 'flat',
  bar: 'array',
  baz: [
    'assign',
    'override',
  ],
})

config
  .merge({
    foo: 1,
    baz: [{ a: 1 }, { b: 2 }],
  })
  .merge({
    foo: [2],
    bar: [2],
  })
  .merge(undefined)
  .merge({
    bar: 3,
    baz: [{ a: 2, b: 3 }, { c: 4 }]
  })
  .value()

// output:
// { foo: [ 1, 2 ],
//   bar: [ [ 2 ], 3 ],
//   baz: [ { a: 2, b: 3 }, { c: 4 } ] }
```
