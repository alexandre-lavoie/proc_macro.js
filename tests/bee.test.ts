import { Expression, TokenStream, End, Ident, proc_macro, quote } from "../src";

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
            if(!/^[Bb]e*$/.test(bee.value)) throw ts.error("Passed text is not bee.");

            // Check if bee fits in the number system.
            if(bee.value.length > 10) throw ts.error("Bee should be smaller than 11 letters.");

            count += bee.value.length - 1;
        }

        return new Bee(count);
    }

    public toJavaScript(): string {
        // Quote tagged template makes tokenizing easier!
        return quote`${this.count.toString()}`;
    }
}

// Simple function to pass to proc_macro.
const beeParser = (tokenStream: TokenStream): string => {
    let bee = Bee.parse(tokenStream);
    return bee.toJavaScript();
}

// Converts the parser to tagged template.
const bee = proc_macro(beeParser);

test("Bee basic test.", () => {
    let x = eval(bee`be b bee beeee`);

    expect(x).toBe(1024);
});

test("Bee too long.", () => {
    try {
        bee`beeeeeeeeee`;

        expect(true).toBeFalsy();
    } catch(_) {
        expect(true).toBeTruthy();
    }
});