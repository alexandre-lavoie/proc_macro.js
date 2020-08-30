import Token from "./token";
import Punct from "./tokens/punct";
import Literal from "./tokens/literal";
import Ident from "./tokens/ident";
import Group from "./tokens/group";
import { StringInterface } from "./interfaces";

export default class TokenStream implements StringInterface {
    private _stream: Token[];

    constructor() {
        this._stream = [];
    }
    
    /**
     * Parses a string to a proc_macro like token tree.
     * @param tokenString String to parse.
     */
    public static tokenize(tokenString: string): TokenStream {
        let tokenStream = new TokenStream();

        while(tokenString.trimLeft().length > 0) {
            tokenString = tokenString.trimLeft();

            if(Ident.canTokenizeNext(tokenString)) {
                let [ident, ts] = Ident.tokenizeNext(tokenString);
                tokenStream._stream.push(ident);
                tokenString = ts;
            } else if(Literal.canTokenizeNext(tokenString)) {
                let [lit, ts] = Literal.tokenizeNext(tokenString);
                tokenStream._stream.push(lit);
                tokenString = ts;
            } else if(Punct.canTokenizeNext(tokenString)) {
                let [punct, ts] = Punct.tokenizeNext(tokenString);
                tokenStream._stream.push(punct);
                tokenString = ts;
            } else if(Group.canTokenizeNext(tokenString)) {
                let [group, ts] = Group.tokenizeNext(tokenString);
                tokenStream._stream.push(group);
                tokenString = ts;
            } else {
                throw Error(`Could not tokenize next token for '${tokenString}'.`);
            }
        }

        return tokenStream;
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