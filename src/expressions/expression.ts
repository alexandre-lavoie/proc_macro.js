import TokenStream from '../utils/token_stream';
import { IJavaScript } from '../utils/interfaces';

export default abstract class Expression implements IJavaScript {
    public abstract toJavaScript(): string;

    /**
     * Method that attempts to parse the next token(s) into this expression.
     * @param tokenStream The TokenStream trying to parse.
     * @throws If the next token(s) cannot be parsed, an error is produced.
     */
    public static parse(tokenStream: TokenStream): Expression {
        throw tokenStream.error("Parse not defined for expression.");
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