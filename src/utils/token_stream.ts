import Token from "../tokens/token";
import { TOKENS } from "../tokens";
import { IString, IJavaScript, IEqual, IClone } from "./interfaces";
import Expression from "../expressions/expression";
import chalk from "chalk";

type ReadonlyTokens = readonly Token[]; 

export default class TokenStream implements IString, IJavaScript, IEqual, IClone {
    private _stream: Token[];

    constructor(tokens: Token[]=[]) {
        this._stream = tokens;
    }

    public get empty(): boolean {
        return this._stream.length === 0;
    }

    public clone(): TokenStream {
        return new TokenStream([...this._stream]);
    }

    public eq(other: any): boolean {
        if(other instanceof TokenStream && other._stream.length === this._stream.length) {
            return this._stream.every((token, index) => token.eq(other._stream[index]));
        }

        return false;
    }

    /**
     * Adds`other` TokenStream to end of `this` TokenStream.
     * @param other Tokens stream to add.
     */
    public concat(other: TokenStream): TokenStream {
        this._stream.concat(other._stream);

        return this;
    }

    /**
     * Checks if TokenStreams are equal until size of smallest.
     * @param tokenStream TokenStream to compare.
     */
    public zipEq(tokenStream: TokenStream): boolean {
        let small = (this._stream.length > tokenStream._stream.length) ? tokenStream : this;
        let large = (this === small) ? tokenStream : this;

        return small._stream.every((token, index) => token.eq(large._stream[index]));
    }
    
    /**
     * Parses a string to a proc_macro like token tree.
     * @param tokenString String to parse.
     */
    public static tokenize(tokenString: string): TokenStream {
        let tokenStream = new TokenStream();

        outer:
        while(tokenString.trimLeft().length > 0) {
            tokenString = tokenString.trimLeft();

            for(let type of TOKENS) {
                if(type.canTokenize(tokenString)) {
                    let [token, ts] = type.tokenize(tokenString);
                    tokenStream._stream.push(token);
                    tokenString = ts;

                    continue outer;
                }
            }

            throw Error(`FATAL ERROR: Could not tokenize input. This is an error on the proc_macro.js library side. Please report bug.`);
        }

        return tokenStream;
    }

    /**
     * Peeks the next raw Token (Should use `peek` instead).
     */
    public get next(): Token {
        return this._stream[0];
    }

    /**
     * Gets the raw Token array (Should use `parse` instead).
     */
    public get stream(): ReadonlyTokens {
        return this._stream;
    }

    /**
     * Gets the next raw Token (Should use `parse` instead).
     */
    public shiftNext(): TokenStream | undefined {
        return this.shift(1);
    }

    private shift(count: number=1): TokenStream | undefined {
        if(this._stream.length < count) return undefined;

        return new TokenStream(this._stream.splice(0, count));
    }

    private slice(count: number=1): TokenStream | undefined {
        if(this._stream.length < count) return undefined;

        return new TokenStream(this._stream.slice(0, count));
    }

    /**
     * Tagged template to determine if passed tokens are expected tokens.
     * @param tokens Tokens as string.
     * @param types Types to check.
     */
    public peek<T extends Token | Expression>(tokens: readonly string[], ...types: (new(..._: any[]) => T)[]): boolean {
        try {
            this.clone().parse(tokens, ...types);

            return true;
        } catch {
            return false;
        }
    }

    /**
     * Descriptive error for runtime error. (TODO: Using spans.)
     * @param msg Message to display.
     */
    public error(msg: string): Error {
        let tokenMap = this._stream.map((token, i) => {
            if(i > 0) return token.toJavaScript();
            else return chalk.red(token.toJavaScript());
        });

        return Error(`\n|\n|   ${tokenMap.join('')}\n|   ${chalk.red('^')}\n|   ${chalk.red('|')}\n|   ${chalk.red(msg)}\n|`);
    }

    /**
     * Attempts to parse string of tokens.
     * @throws If cannot parse tokens.
     * @param tokenString String of tokens to parse.
     */
    private parseString(tokenString: string): TokenStream {
        let tokenStream = TokenStream.tokenize(tokenString);

        if(!this.canParse(tokenStream)) throw this.error(`Expected the token "${tokenString}".`);

        let next = this.shift(tokenStream._stream.length);

        if(!next) throw this.error(`Expected the token "${tokenString}".`);

        return next;
    }

    /**
     * Checks if the object can be parsed.
     * @param tokenStream The TokenStream trying to parse.
     */
    public canParse(tokenStream: TokenStream): boolean {
        return this.zipEq(tokenStream);
    }

    /**
     * Tagged template to parse tokens and types.
     * @param tokens String representation of tokens.
     * @param types 
     */
    public parse<T extends Token | Expression>(tokens: readonly string[], ...types: (new(..._: any[]) => T)[]): T[] {
        let typeTokens: T[] = [];
        
        tokens.forEach((token, i) => {
            this.parseString(token);

            if(types[i]) {
                let type = types[i];

                let typeToken = this.parseType(type);

                typeTokens.push(typeToken);
            }
        });

        return typeTokens;
    }

    /**
     * Attempts to parse a Token or Expression type.
     * @param type Type to parse.
     */
    private parseType<T extends Token | Expression>(type: new(..._: any[]) => T): T {
        if((type as any).canParse(this)) {
            let t: T = (type as any).parse(this);

            return t as T;
        }

        throw this.error(`Expected the type ${type.name}.`);
    }

    public toParenthesisString(): string {
        let output = "(TokenStream ";

        output += this._stream.map(t => t.toParenthesisString()).join(' ');

        return output + `)`;
    }

    public toJavaScript(): string {
        return this._stream.map(token => token.toJavaScript()).join('');
    }
}