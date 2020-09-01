/**
 * Interface for debugging using strings.
 */
export interface IString {
    /**
     * Converts token trees into a lisp-like notation.
     */
    toParenthesisString(): string;
}

/**
 * Interface to convert tokens to javascript.
 */
export interface IJavaScript {
    /**
     * Converts token representation of object to javascript string.
     */
    toJavaScript(): string;
}

/**
 * Interface for checking equality.
 */
export interface IEqual {
    /**
     * Checks if `this` is equal to other.
     * @param other Other object to check against.
     */
    eq(other: any): boolean;
}

/**
 * Interface to deep-clone object.
 */
export interface IClone {
    /**
     * Clones `this` to a new object.
     */
    clone(): any;
}