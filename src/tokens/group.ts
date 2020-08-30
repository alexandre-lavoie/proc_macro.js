import Token from '../token';
import TokenStream from '../token_stream';

type Delimiter = 'brace' | 'bracket' | 'parenthesis' | 'none';

export default class Group extends Token {
    public readonly delimiters: Delimiter;
    public readonly tokenStream: TokenStream;

    constructor(delimiters: Delimiter, tokenStream: TokenStream) {
        super();
        this.delimiters = delimiters;
        this.tokenStream = tokenStream;
    }

    public static tokenizeNext(tokenString: string): [Group, string] {
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
        let pointer = 1;

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

        if(delimiterCounter !== 0) throw "Group is never closed.";

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
                throw Error("Char is not a group delimiter.");
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
                throw Error("Char is not a group delimiter.");
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