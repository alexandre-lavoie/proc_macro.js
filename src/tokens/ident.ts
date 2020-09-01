import Token from './token';

/**
 * A non-literal token used to identify object (such as variables, conditions, etc).
 */
export default class Ident extends Token {
    public readonly value: string;

    constructor(value: string) {
        super();
        this.value = value;
    }

    public eq(other: any): boolean {
        if(other instanceof Ident) {
            return other.value === this.value;
        }
        
        return false;
    }

    public static tokenize(tokenString: string): [Ident, string] {
        let pointer = 0;
        let tokens = tokenString[0];

        while(pointer < tokenString.length && /^[a-zA-Z_][a-zA-Z0-9_]*?$/.test(tokens)) {
            tokens += tokenString[++pointer];
        } 

        if(pointer === 0) {
            throw Error("Next token is not a ident.");
        }

        return [new Ident(tokenString.substring(0, pointer)), tokenString.substring(pointer)];
    }

    public toParenthesisString(): string {
        return `(Ident ${this.value})`
    }

    public toJavaScript(): string {
        return this.value + " ";
    }
}