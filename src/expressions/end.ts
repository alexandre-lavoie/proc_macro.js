import Expression from "./expression";
import { TokenStream } from "..";

export default class End extends Expression {
    public static parse(tokenStream: TokenStream): End {
        if(!tokenStream.empty) {
            throw tokenStream.error("Expected end of TokenStream.");
        }

        return new End();
    }

    public toJavaScript(): string {
        return "";
    }
}