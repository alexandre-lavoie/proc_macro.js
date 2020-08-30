import Token from '../token';

export default class Ident extends Token {
    public readonly value: string;

    constructor(value: string) {
        super();
        this.value = value;
    }

    public static tokenizeNext(token_string: string): [Ident, string] {
        let pointer = 0;
        let tokens = token_string[0];

        while(pointer < token_string.length && /^[a-zA-Z_][a-zA-Z0-9_]*?$/.test(tokens)) {
            tokens += token_string[++pointer];
        } 

        if(pointer === 0) {
            throw Error("Next token is not a ident.");
        }

        return [new Ident(token_string.substring(0, pointer)), token_string.substring(pointer)];
    }

    public toParenthesisString(): string {
        return `(Ident ${this.value})`
    }

    public toJavaScript(): string {
        return this.value + " ";
    }
}