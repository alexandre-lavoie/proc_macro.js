# proc_macro.js

Proc_macro.js is a JavaScript/TypeScript implementation of [Rust-lang](https://www.rust-lang.org/) procedural macros. The goal of this project is to combine the ideas from [syn](https://github.com/dtolnay/syn), [quote](https://github.com/dtolnay/quote), [proc_macro](https://doc.rust-lang.org/proc_macro/), and [proc_macro2](https://docs.rs/proc-macro2/1.0.19/proc_macro2/) in one comprehensive parsing package. Unlike [sweet.js](https://www.sweetjs.org/), the goal is to write hygenic/unhygenic macros that require only vanilla JavaScript. This comes with the caveat of JIT and [tagged templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

## Sample using ES6

Trivial tokenization and parsing of JavaScript in JavaScript.

```typescript
import { proc_macro, TokenStream } from 'proc_macro';

function jsParser(tokenStream: TokenStream): TokenStream {
    return tokenStream;
}

const js = proc_macro(jsParser);

js`let x = 1 + 1; console.log(x);`;
```

## TODO

### Proc_Macro
- [x] Core Token Stream/Token Tree.
- [x] Proc_macro like defintion of macros.
- [ ] Accurate spanning of tokens.
- [ ] Accurate error report and debugging.

### Syn
- [ ] Parsing stream for parsing objects.

### Quote
- [ ] Effective conversion between string code to tokens.
