/**
 * Section defines the start and end of a code snippet part of a token.
 */
type Section = [number, number];

/**
 * TODO: Implement spans for more accurate debugging.
 */
export default class Span {
    private _sections: Section[];
    public get sections(): readonly Section[] { return this.sections }

    constructor(sections: Section[] = []) {
        this._sections = sections;
    }

    public expand(section: Section) {
        this._sections.push(section);
    }

    public toParenthesisString(): string {
        return '[' + this._sections.map(s => `${s[0]}..${s[1]}`) + ']';
    }
}