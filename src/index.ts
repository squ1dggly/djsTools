export * from "./AnsiBuilder";
export * from "./BetterEmbed";
export * from "./CanvasBuilder";
export * from "./PageNavigator";
export * from "./prompt";
export * from "./config";
export * from "./dTools";
export * from "./deleteMessageAfter";
export * from "./dynaSend";
export * from "./extractMessage";
export * from "./types";

import * as AnsiBuilder from "./AnsiBuilder";
import * as BetterEmbed from "./BetterEmbed";
import * as CanvasBuilder from "./CanvasBuilder";
import * as PageNavigator from "./PageNavigator";
import * as prompt from "./prompt";
import * as djsConfig from "./config";
import * as dTools from "./dTools";
import * as deleteMessageAfter from "./deleteMessageAfter";
import * as dynaSend from "./dynaSend";
import * as extractMessage from "./extractMessage";
import * as types from "./types";

export default {
    ...AnsiBuilder,
    ...BetterEmbed,
    ...CanvasBuilder,
    ...PageNavigator,
    ...prompt,
    ...djsConfig,
    ...dTools,
    ...deleteMessageAfter,
    ...dynaSend,
    ...extractMessage,
    ...types
};
