import TokenStream from "./token_stream";

export type ParsingFunction = (tokenString: TokenStream) => TokenStream | string;

export type TaggedTemplateFunction = (strings: readonly string[], ...keys: string[]) => string;

/**
 * Wrapper function to create the proc_macro tagged template function.
 * @param parsingFunction Function used to parse input.
 */
export default function proc_macro(parsingFunction: ParsingFunction): TaggedTemplateFunction {
    return function (strings: readonly string[], ...keys: string[]) {
        let tokenString = strings.map((str, i) => str + (keys[i] || '')).join('');

        try {
            let tokenStream = TokenStream.tokenize(tokenString);

            let parseOutput = parsingFunction(tokenStream);

            return (typeof parseOutput === 'string') ? parseOutput : parseOutput.toJavaScript();
        } catch(e) {
            throw e;
        }
    };
}