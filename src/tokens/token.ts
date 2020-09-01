import { IString, IJavaScript, IEqual } from "../utils/interfaces";
import { TokenStream } from "..";

/**
 * Abstract definition of a parsing token.
 */
export default abstract class Token implements IString, IJavaScript, IEqual {
    public abstract toParenthesisString(): string;
    public abstract toJavaScript(): string;
    public abstract eq(other: any): boolean;

    /**
     * Method that attempts to tokenize the next char(s).
     * @param _ The string to try to tokenize.
     * @event TokenizeError If the next char(s) cannot be tokenized, an error is produced.
     */
    public static tokenize(_: string): [Token, string] {
        throw Error("Tokenize not implemented for this token. Please implement it.");
    }

    /**
     * Checks if the structure can be tokenized.
     * @param tokenString The string trying to tokenize.
     */
    public static canTokenize(tokenString: string): boolean {
        try {
            this.tokenize(tokenString);
            return true;
        } catch(e) {
            return false;
        }
    }

    /**
     * Method that attempts to parse the next token into this token.
     * @throws If the next token(s) cannot be parsed, an error is produced.
     */
    public static parse<T extends Token>(tokenStream: TokenStream): T {
        let nextToken = tokenStream.shiftNext();

        if(nextToken === undefined) throw tokenStream.error("No token to parse.");

        return nextToken.next as any;
    }

    /**
     * Checks if the class can be parsed.
     * @param tokenStream The TokenStream trying to parse.
     */
    public static canParse(tokenStream: TokenStream): boolean {
        try {
            this.parse(tokenStream.clone());

            return true;
        } catch(e) {
            return false;
        }
    }
}