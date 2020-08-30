import { StringInterface } from "./interfaces";

/**
 * Abstract definition of a parsing token.
 */
export default abstract class Token implements StringInterface {
    public abstract toParenthesisString(): string;

    /**
     * Converts token representation of object to javascript string.
     */
    public abstract toJavaScript(): string;

    /**
     * Method that attempts to parse the next token into this token.
     * @param _ The string to try to parse.
     * @event ParsingError If the next token(s) cannot be parsed to this token, an error is produced.
     */
    public static tokenizeNext(_: string): [Token, string] {
        throw "Tokenize not implemented for this Token subclass.";
    }

    /**
     * Checks if the structure can be parsed.
     * @param token_string The string to try to parse.
     */
    public static canTokenizeNext(token_string: string): boolean {
        try {
            this.tokenizeNext(token_string);
            return true;
        } catch(e) {
            return false;
        }
    }
}