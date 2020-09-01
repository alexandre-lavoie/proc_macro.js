import { TokenStream, Literal, Punct, Ident, Group } from "../src";

test("Double quote string should be literal.", () => {
    expect(TokenStream.tokenize('"Hello"').next).toBeInstanceOf(Literal);
});

test("Double quote input should yield double quote output plus space.", () => {
    expect(TokenStream.tokenize('"Hello"').toJavaScript().trim()).toBe('"Hello"');
});

test("Floating point number should be literal.", () => {
    expect(TokenStream.tokenize('1.234567').next).toBeInstanceOf(Literal);
});

test("Floating point number should yield floating point number output plus space.", () => {
    expect(TokenStream.tokenize('1.234567').toJavaScript().trim()).toBe('1.234567');
});

// Not sure if this a desired feature or it should be prevented.
test("String next to number should be possible.", () => {
    expect(TokenStream.tokenize(`"Hello"1.234567'Hi'`).toJavaScript().trim()).toBe(`"Hello" 1.234567 'Hi'`);
});

// Not sure if there should be a size limit/standard punctuations.
test("Any punctuation with no space should be joint appart from last one.", () => {
    let puncts = "!@#$%^&*-+=\\|;:<>?/";
    let stream = TokenStream.tokenize(puncts).stream;
    stream.forEach((token, i) => {
        expect(token).toBeInstanceOf(Punct);

        let punct: Punct;

        if(token instanceof Punct) {
            punct = token;
        } else {
            throw Error("Not a punct.");
        }

        expect(punct.char).toBe(puncts[i]);

        if(i < stream.length - 1){
            expect(punct.spacing).toBe('joint');
        } else {
            expect(punct.spacing).toBe('alone');
        }
    });
});

test("Non literals should default to identifiers.", () => {
    let idents = "let variable_name to Equ4l x if gt one";
    let identSplit = idents.split(' ');
    let stream = TokenStream.tokenize(idents).stream;

    stream.forEach((token, i) => {
        expect(token).toBeInstanceOf(Ident);

        let ident: Ident;

        if(token instanceof Ident) {
            ident = token;
        } else {
            throw Error("Not an identifier.");
        }

        expect(ident.value).toBe(identSplit[i]);
    });
});

test("Empty groups should have empty content.", () => {
    let groups = "{} [] ()";
    let stream = TokenStream.tokenize(groups).stream;

    stream.forEach(token => {
        expect(token).toBeInstanceOf(Group);

        let group: Group;

        if(token instanceof Group) {
            group = token;
        } else {
            throw Error("Not a group.");
        }

        expect(group.tokenStream.stream).toStrictEqual([]);
    });
});

test("Brace, bracket, and parentheses should be groups.", () => {
    let groups = "{Hi} [Hello] (Hey)";
    let stream = TokenStream.tokenize(groups).stream;

    stream.forEach(token => {
        expect(token).toBeInstanceOf(Group);

        let group: Group;

        if(token instanceof Group) {
            group = token;
        } else {
            throw Error("Not a group.");
        }

        expect(group.tokenStream.stream.length).toBe(1);
        expect(group.tokenStream.next).toBeInstanceOf(Ident);
    });
});