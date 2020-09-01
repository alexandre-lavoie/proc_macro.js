import { proc_macro, TokenStream } from "../src";

function jsParser(tokenStream: TokenStream): TokenStream {
    return tokenStream;
}

const js = proc_macro(jsParser);

test("Should be able to perform assignment.", () => {
    eval(js`let x = 1; expect(x).toBe(1);`);
});

test("Should be able to perform addition.", () => {
    eval(js`let x = 1 + 1; expect(x).toBe(2);`);
});

// Not certain this is the desired results, whould imply that proc_macros are hygenic.
test("Proc_macro in a different scope.", () => {
    let x = 1;

    eval(js`let x = 2;`);

    expect(x).toBe(1);
});

test("Should be able to access proc_macro's content..", () => {
    let x = eval(js`let x = 2; x`);

    expect(x).toBe(2);
});
