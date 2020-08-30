import Token from '../token';

type Spacing = 'alone' | 'joint';

export default class Punct extends Token {
    public readonly char: string;
    public readonly spacing: Spacing;

    constructor(char: string, spacing: Spacing)  {
        super();

        if(char.length !== 1) throw Error("Expected punctuation to be a single character. Use the `joint` spacing if punctuation should be joint."); 

        this.char = char;
        this.spacing = spacing;
    }

    public static tokenizeNext(token_string: string): [Punct, string] {
        let [char, next_token_string] = [token_string.substring(0, 1), token_string.substring(1)];

        if(!/^[+-\/\\><?=!;.,&^%|]$/.test(char)) {
            throw Error("Next token is not a punctuation.");
        }

        let spacing: Spacing = Punct.canTokenizeNext(next_token_string) ? 'joint' : 'alone';

        return [new Punct(char, spacing), next_token_string];
    }

    public toParenthesisString(): string {
        return `(Punct ${this.spacing} '${this.char}')`;
    }

    public toJavaScript(): string {
        return this.char + ((this.spacing === 'joint') ? '' : ' ');
    }
}