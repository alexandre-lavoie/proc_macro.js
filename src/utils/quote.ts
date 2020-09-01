import Token from "../tokens/token";
import Expression from "../expressions/expression";

/**
 * Tagged template used to improve Token to JavaScript parsing.
 * @param tokens String tokens to parse.
 * @param values Tokens to parse.
 */
export default function quote(tokens: readonly string[], ...values: (string | Token | Expression)[]): string {
    let output = "";
    
    tokens.forEach((token, i) => {
        output += token;

        if(values[i]) {
            let value = values[i];

            if(typeof value === 'string') {
                output += value;
            } else {
                output += value.toJavaScript();
            }
        }
    });

    return output;
}