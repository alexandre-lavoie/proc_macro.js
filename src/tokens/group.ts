import Token from './token';
import { TokenStream } from '..';

type Delimiter = 'brace' | 'bracket' | 'parenthesis' | 'none';

/**
 * A collection of tokens delimited by `{}`, `[]`, or `()`.
 */
export default class Group extends Token {
    public readonly delimiters: Delimiter;
    public readonly tokenStream: TokenStream;

    constructor(delimiters: Delimiter, tokenStream: TokenStream) {
        super();
        this.delimiters = delimiters;
        this.tokenStream = tokenStream;
    }

    public eq(other: any): boolean {
        if(other instanceof Group) {
            return this.delimiters === other.delimiters && this.tokenStream.eq(other.tokenStream); 
        }

        return false;
    }

    public static tokenize(tokenString: string): [Group, string] {
        // Assumes that current token is a delimiter.
        let openDelimiter = tokenString[0];
        let closeDelimiter: string;

        // If this assert fails, our initial assumption that the delimiter was open is false.
        try {
            closeDelimiter = this.getClosingDelimiter(openDelimiter);
        } catch(e) {
            throw e;
        }

        let delimiterCounter = 1;
        let pointer = 0;

        loop:
        while(pointer < tokenString.length) {
            if(delimiterCounter === 0) break loop;

            switch(tokenString[++pointer]){
                case openDelimiter:
                    delimiterCounter++;
                    continue loop;
                case closeDelimiter:
                    delimiterCounter--;
            }
        }

        if(delimiterCounter !== 0) throw Error("FATAL ERROR: Group is never closed.");

        let innerTokenStream = TokenStream.tokenize(tokenString.substring(1, pointer));

        return [new Group(this.getDelimiterType(openDelimiter), innerTokenStream), tokenString.substring(pointer + 1)];
    }

    /**
     * Converts the char representation of delimiter into string type.
     * @param char Delimiter to conver to string.
     */
    public static getDelimiterType(char: string): Delimiter {
        switch(char) {
            case '{':
            case '}':
                return 'brace';
            case '(':
            case ')':
                return 'parenthesis';
            case '[':
            case ']':
                return 'bracket';
            default:
                throw Error("FATAL ERROR: Char is not a group delimiter.");
        }
    }

    public static getDelimiters(delimiter: Delimiter): [string, string] {
        switch(delimiter) {
            case 'brace':
                return ['{', '}'];
            case 'bracket':
                return ['[', ']'];
            case 'parenthesis':
                return ['(', ')'];
            case 'none':
            default:
                return [' ', ' '];
        }
    } 

    /**
     * Gets the closing delimiter from the open delimiter.
     * @param char The open delimiter.
     */
    public static getClosingDelimiter(char: string): string {
        switch(char) {
            case '{':
                return '}';
            case '(':
                return ')';
            case '[':
                return ']';
            default:
                throw Error("FATAL ERROR: Char is not a group delimiter.");
        }
    }

    public toParenthesisString(): string {
        return `(Group ${this.delimiters} ${this.tokenStream.toParenthesisString()})`;
    }

    public toJavaScript(): string {
        let [open, close] = Group.getDelimiters(this.delimiters);

        return open + " " + this.tokenStream.toJavaScript() + close + " ";
    }
}