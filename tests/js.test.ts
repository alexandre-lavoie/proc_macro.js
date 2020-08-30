import TokenStream from "../src/token_stream";
import proc_macro from "../src";

function jsParser(tokenStream: TokenStream): TokenStream {
    return tokenStream;
}

const js = proc_macro(jsParser);

test("Assert assignment.", () => {
    js`let x = 1; expect(x).toBe(1);`;
});

test("Assert addition.", () => {
    js`let x = 1 + 1; expect(x).toBe(2);`;
});

// Not certain this is the desired results, whould imply that proc_macros are hygenic.
test("Proc_macro in a different scope.", () => {
    let x = 1;

    js`let x = 2;`;

    expect(x).toBe(1);
});

test("Accessing proc_macro should be possible.", () => {
    let x = js`let x = 2; x`;

    expect(x).toBe(2);
});
