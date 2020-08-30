import TokenStream from "./token_stream";
import { Group, Ident, Punct, Literal } from "./tokens";

export { TokenStream, Group, Ident, Punct, Literal };

export type ParsingFunction = (tokenString: TokenStream) => TokenStream;

export type TaggedTemplateFunction = (strings: readonly string[], ...keys: string[]) => any;

export function proc_macro(parsingFunction: ParsingFunction): TaggedTemplateFunction {
    return function (strings: readonly string[], ...keys: string[]) {
        let tokenString = strings.map((str, i) => str + (keys[i] || '')).join('');

        let tokenStream = TokenStream.tokenize(tokenString);

        let parseOutput = parsingFunction(tokenStream);

        return eval(parseOutput.toJavaScript());
    };
}