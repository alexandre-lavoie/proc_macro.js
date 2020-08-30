import Token from '../token';

type LiteralType = 'string' | 'number';

export default class Literal extends Token {
    public readonly value: string;
    public readonly type: LiteralType;

    constructor(value: string, type: LiteralType) {
        super();
        this.value = value;
        this.type = type;
    }

    public static tokenizeNext(token_string: string): [Literal, string] {
        let pointer = 0;
        let type: LiteralType;
        let tokens = token_string[pointer];

        if(/\d/.test(tokens)) {
            type = 'number';

            while(pointer < token_string.length && /^\d+?\.{0,1}\d*?$/.test(tokens)) {
                tokens += token_string[++pointer];
            }
        } else if(tokens === '"' || tokens === "'") {
            type = 'string';

            let matching_token = tokens;

            while(pointer < token_string.length && token_string[++pointer] != matching_token) {};
        } else {
            throw Error("Next token is not a literal.")
        }

        return [new Literal(token_string.substring(0, pointer), type), token_string.substring(pointer)];
    }

    public toParenthesisString(): string {
        return `(Literal ${this.type} ${this.value})`;
    }

    public toJavaScript(): string {
        return this.value + " ";
    }
}