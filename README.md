# proc_macro.js

**proc_macro.js** is a JavaScript/TypeScript implementation of [Rust](https://www.rust-lang.org/) procedural macros 🔥. The goal of this project is to combine the ideas from [syn](https://github.com/dtolnay/syn), [quote](https://github.com/dtolnay/quote), [proc_macro](https://doc.rust-lang.org/proc_macro/), and [proc_macro2](https://docs.rs/proc-macro2/1.0.19/proc_macro2/) in one comprehensive parsing package. 

Unlike [sweet.js](https://www.sweetjs.org/), the goal is to write hygenic/unhygenic macros that require only vanilla JavaScript. This comes with the caveat of JIT and [tagged templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals). 

You can find more information on the [package website](https://proc-macro-js.herokuapp.com/).

**Please note that this project is still in development. Feel free to report any bugs on GitHub!**

## Installing

```
npm install --save proc_macro
```

## Sample using ES6

Parsing bee number system 🐝 where the number of `e` in `bee...` gives the number value. For example `be b bee beeee` = `1024`.

```typescript
import { Expression, TokenStream, End, Ident, proc_macro, quote } from "proc_macro";

// Defining Bee parsing object by extending Expression.
class Bee extends Expression {
    count: string;

    constructor(count: string) {
        super();
        this.count = count;
    }

    // Must define the parse static method!
    public static parse(ts: TokenStream): Bee {
        let count = "";

        // Check if we reached end.
        while(!ts.peek`${End}`) {
            // If not, get next Ident.
            let [bee] = ts.parse`${Ident}`;

            // Check if the ident is bee.
            if(!/^[Bb]e*$/.test(bee.value)) 
                throw ts.error("Passed text is not bee.");

            // Check if bee fits in the number system.
            if(bee.value.length > 10) 
                throw ts.error("Bee should be smaller than 11 letters.");

            count += bee.value.length - 1;
        }

        return new Bee(count);
    }

    public toJavaScript(): string {
        // Quote tagged template makes tokenizing easier!
        return quote`${this.count.toString()}`;
    }
}

// Tempalte function to pass to proc_macro.
const beeParser = (tokenStream: TokenStream): string => {
    let bee = Bee.parse(tokenStream);
    return bee.toJavaScript();
}

// Converts the parser to tagged template.
const bee = proc_macro(beeParser);

// Parse and eval...
let b = eval(bee`be b bee beeee`);

// Should give `1024`!
console.log(b);
```

## TODO

### Proc_Macro
- [x] Core Token Stream/Token Tree.
- [x] Proc_macro like defintion of macros.
- [ ] Accurate spanning of tokens.
- [~] Accurate error report and debugging.

### Syn
- [X] Parsing for TokenStream.

### Quote
- [~] Effective conversion between string code to tokens.
