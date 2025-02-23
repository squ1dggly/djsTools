import * as jstools from 'jstools';
import { DeepPartial } from 'jstools';
import * as discord_js from 'discord.js';
import { CommandInteraction, RepliableInteraction, TextBasedChannel, Message, GuildMember, User, EmbedBuilder, DMChannel, TextChannel, NewsChannel, ThreadChannel, InteractionReplyOptions, ActionRowBuilder, MessageActionRowComponentBuilder, BaseMessageOptions, StickerResolvable, PollData, MessageMentionOptions, ReplyOptions, ForwardOptions, InteractionEditReplyOptions, MessageCreateOptions, MessageReplyOptions, MessageEditOptions, Client, APIEmbedField, ColorResolvable, APIEmbed, StringSelectMenuBuilder, ButtonBuilder, StringSelectMenuOptionBuilder, InteractionCollector, StringSelectMenuInteraction, ButtonInteraction, ReactionCollector, ChannelType, PartialGroupDMChannel, PartialDMChannel, GuildBasedChannel, AnyThreadChannel, VoiceBasedChannel, CategoryChannel, Guild, Role, GuildTextBasedChannel } from 'discord.js';
import { Image } from '@napi-rs/canvas';
import { Readable } from 'node:stream';

interface DJSConfig {
    INVIS_CHAR: string;
    EMBED_COLOR: string[];
    EMBED_COLOR_DEV: string[];
    DEV_MODE: boolean;
    timeouts: {
        PAGINATION: string | number;
        CONFIRMATION: string | number;
        ERROR_MESSAGE: string | number;
    };
    awaitConfirm: {
        DEFAULT_EMBED_TITLE: string;
        DEFAULT_EMBED_DESCRIPTION: string;
    };
    pageNavigator: {
        CAN_JUMP_THRESHOLD: number;
        CAN_USE_LONG_THRESHOLD: number;
        DEFAULT_SELECT_MENU_PLACEHOLDER: string;
        ASK_PAGE_NUMBER_MESSAGE: string;
        ASK_PAGE_NUMBER_ERROR: string;
        buttons: {
            to_first: {
                label: string;
                emoji: {
                    animated?: boolean;
                    name: string;
                    id: string;
                };
            };
            back: {
                label: string;
                emoji: {
                    animated?: boolean;
                    name: string;
                    id: string;
                };
            };
            jump: {
                label: string;
                emoji: {
                    animated?: boolean;
                    name: string;
                    id: string;
                };
            };
            next: {
                label: string;
                emoji: {
                    animated?: boolean;
                    name: string;
                    id: string;
                };
            };
            to_last: {
                label: string;
                emoji: {
                    animated?: boolean;
                    name: string;
                    id: string;
                };
            };
        };
    };
    ansi: {
        ESCAPE: string;
        formats: {
            normal: number;
            bold: number;
            underline: number;
        };
        colors: {
            text: {
                gray: number;
                red: number;
                green: number;
                yellow: number;
                blue: number;
                pink: number;
                cyan: number;
                white: number;
            };
            bg: {
                firefly_dark_blue: number;
                orange: number;
                marble_blue: number;
                grayish_turqouise: number;
                gray: number;
                indigo: number;
                light_gray: number;
                white: number;
            };
        };
    };
}
declare const djsConfig: DJSConfig;
declare function customDJSConfig(config: DeepPartial<DJSConfig>): DJSConfig;

type ANSIFormat = "normal" | "bold" | "underline";
type ANSITextColor = "gray" | "red" | "green" | "yellow" | "blue" | "pink" | "cyan" | "white";
type ANSIBGColor = "firefly_dark_blue" | "orange" | "marble_blue" | "grayish_turqouise" | "gray" | "indigo" | "light_gray" | "white";
interface ANSITextOptions {
    format?: ANSIFormat;
    color?: ANSITextColor;
    bgColor?: ANSIBGColor;
    /** A custom DJS config. */
    config?: DJSConfig;
}

declare class ANSIBuilder {
    private stringArray;
    constructor(text?: string, options?: ANSITextOptions);
    addLines(...lines: {
        text: string;
        options: ANSITextOptions;
    }[]): this;
    toString(codeblock?: boolean): string;
}

type SendHandler = CommandInteraction | RepliableInteraction | TextBasedChannel | Message | GuildMember | User;
type InteractionBasedSendHandler = CommandInteraction | RepliableInteraction;
type SendMethodInteractionBased = "reply" | "editReply" | "followUp";
type SendMethodChannelBased = "sendInChannel";
type SendMethodMessageBased = "messageReply" | "messageEdit";
type SendMethodUserBased = "dmUser";
type SendMethod = SendMethodInteractionBased | SendMethodChannelBased | SendMethodMessageBased | SendMethodUserBased;
type EmbedResolveable = EmbedBuilder | BetterEmbed;
type InteractionResolveable = CommandInteraction | RepliableInteraction;
type UserResolvable = GuildMember | User | string;
type SendableTextChannel = DMChannel | TextChannel | NewsChannel | ThreadChannel;

type DynaSendData<T extends SendMethod> = T extends "reply" ? InteractionReplyOptions : T extends "editReply" ? InteractionEditReplyOptions : T extends "followUp" ? InteractionReplyOptions : T extends "sendInChannel" ? MessageCreateOptions : T extends "messageReply" ? MessageReplyOptions : T extends "messageEdit" ? MessageEditOptions : T extends "dmUser" ? MessageCreateOptions : never;
type RequiredDynaSendOptions = (DynaSendOptions & {
    content: string;
}) | (DynaSendOptions & {
    embeds: EmbedResolveable | EmbedResolveable[];
}) | (DynaSendOptions & {
    components: ActionRowBuilder<MessageActionRowComponentBuilder> | ActionRowBuilder<MessageActionRowComponentBuilder>[];
}) | (DynaSendOptions & {
    files: BaseMessageOptions["files"];
}) | (DynaSendOptions & {
    stickers: StickerResolvable[];
}) | (DynaSendOptions & {
    poll: PollData;
}) | (DynaSendOptions & {
    forward: ForwardOptions;
});
interface DynaSendOptions {
    /** The method used to send the message.
     *
     * Defaults based on the `handler` type:
     *
     * ___1.___ `RepliableInteraction`: "reply" _(uses "editReply" if an interaction cannot be replied to)_
     *
     * ___2.___ `TextBasedChannel`: "sendInChannel"
     *
     * ___3.___ `Message`: "messageReply"
     *
     * ___3.___ `GuildMember` | `User`: "dmUser" */
    sendMethod?: SendMethod;
    /** Text content to send in the message. */
    content?: string;
    /** Flags to pass to the interaction. */
    flags?: InteractionReplyOptions["flags"];
    /** Return the message after replying to or editing an interaction. */
    withResponse?: boolean;
    /** Embeds to send with the message. */
    embeds?: EmbedResolveable | EmbedResolveable[];
    /** Components to send with the message. */
    components?: ActionRowBuilder<MessageActionRowComponentBuilder> | ActionRowBuilder<MessageActionRowComponentBuilder>[];
    /** Attachments to send with the message. */
    files?: BaseMessageOptions["files"];
    /** Stickers to send with the message. */
    stickers?: StickerResolvable[];
    /** Send a poll. */
    poll?: PollData;
    /** Mention types allowed for the message. */
    allowedMentions?: MessageMentionOptions;
    /** The message to reply to when using the 'sendInChannel' SendMethod. */
    reply?: ReplyOptions;
    /** Forward a message. */
    forward?: ForwardOptions;
    /** Send as a TTS message. */
    tts?: boolean;
    /** An amount of time to wait in __milliseconds__ before deleting the message.
     *
     * This option also utilizes {@link jsTools.parseTime jsTools.parseTime}, letting you use "10s" or "1m 30s" instead of a number. */
    deleteAfter?: number | string;
}

/** Send a message using a dynamic SendHandler with very customizable options.
 *
 * Includes automatic error handling and type checking.
 * @param handler The handler that'll be used to send the message.
 * @param options The message options. */
declare function dynaSend(handler: SendHandler, options: RequiredDynaSendOptions): Promise<Message | null>;

interface BetterEmbedData {
    /** Can be provided for Auto-shorthand context formatting (_ACF_). */
    context?: {
        client?: Client | null;
        interaction?: InteractionResolveable | null;
        channel?: TextBasedChannel | null;
        message?: Message | null;
        user?: GuildMember | User | null;
    } | null;
    /** Author of the `Embed`. */
    author?: string | BetterEmbedAuthor | null;
    /** Title of the `Embed`. */
    title?: string | BetterEmbedTitle | null;
    /** Thumbnail to be displayed on the top right of the `Embed`. */
    thumbnailURL?: string | null;
    /** Text to be displayed inside of the `Embed`. */
    description?: string | null;
    /** Image to be displayed inside of the `Embed`. */
    imageURL?: string | null;
    /** Footer to be displayed at the bottom of the `Embed`. */
    footer?: string | BetterEmbedFooter | null;
    /** Fields of the `Embed`. */
    fields?: APIEmbedField[];
    /** Color of the `Embed`. */
    color?: ColorResolvable | ColorResolvable[] | null;
    /** The timestamp to be displayed to the right of the `Embed`'s footer.
     *
     * If set to `true`, will use the current time. */
    timestamp?: number | boolean | Date | null;
    /** If `false`, will disable auto-shorthand context formatting. */
    acf?: boolean;
    /** A custom DJS config. */
    config?: DJSConfig;
}
interface BetterEmbedAuthor {
    /** A user that will be used for Auto-shorthand context formatting (_ACF_).
     *
     * __NOTE:__ There is no reason to provide this unless:
     *
     * ___1.___ `BetterEmbed.context` was not provided upon creation, or the given context was a `TextBasedChannel`.
     *
     * ___2.___ The `.user` of `BetterEmbed.context` is different from who you want ACF to target. */
    context?: GuildMember | User | null;
    /** Text to be displayed. */
    text: string;
    /** Icon to be displayed on the top left of the `Embed`.
     *
     * If `context` is provided, can be set to `true` to use the context user's avatar. */
    icon?: string | boolean | null;
    /** If provided, will turn the author's text into a hyperlink. */
    hyperlink?: string | null;
}
interface BetterEmbedTitle {
    /** Text to be displayed. */
    text: string;
    /** If provided, will turn the title's text into a hyperlink. */
    hyperlink?: string | null;
}
interface BetterEmbedFooter {
    /** Text to be displayed. */
    text: string;
    /** Icon to be displayed on the bottom left of the `Embed`.
     *
     * If `context` is provided, can be set to `true` to use the context user's avatar. */
    icon?: string | boolean | null;
}

/** A powerful wrapper for `EmbedBuilder` that introduces useful features.
 *
 * Auto-shorthand context formatting (_ACF_) is enabled by default.
 *
 * All functions utilize _ACF_ unless `BetterEmbed.acf` is set to `false`.
 *
 * ___Use a blackslash___ `\` ___to escape any context.___
 *
 * \- - - Author Context - - -
 * - __`$USER`__: _author's mention (@xsqu1znt)_
 * - __`$USER_NAME`__: _author's username_
 * - __`$DISPLAY_NAME`__: _author's display name (requires `GuildMember` context)_
 * - __`$USER_AVATAR`__: _author's avatar_
 *
 * \- - - Client Context - - -
 *
 * - __`$BOT_AVATAR`__: _bot's avatar_
 *
 * \- - - Shorthand Context - - -
 * - __`$INVIS`__: _invisible character_
 *
 * - __`$YEAR`__: _YYYY_
 * - __`$MONTH`__: _MM_
 * - __`$DAY`__: _DD_
 * - __`$year`__: _YY_
 * - __`$month`__: _M or MM_
 * - __`$day`__: _D or DD_
 *
 * ___NOTE:___ `Client` is also included in `RepliedInteraction` and `Message` contexts. */
declare class BetterEmbed {
    private embed;
    private dataInit;
    data: BetterEmbedData;
    private applyContextFormatting;
    private parseData;
    private configure;
    constructor(data: BetterEmbedData);
    /** Returns a new `BetterEmbed` with the same (or different) configuration. */
    clone(options?: BetterEmbedData): BetterEmbed;
    /** Serializes this builder to API-compatible JSON data. */
    toJSON(): APIEmbed;
    /** Set the embed's author. */
    setAuthor(author?: BetterEmbedAuthor | null): this;
    /** Set the embed's title. */
    setTitle(title?: BetterEmbedTitle | null): this;
    /** Set the embed's thumbnail. */
    setThumbnail(url?: string | null): this;
    /** Set the embed's description. */
    setDescription(description?: string | null): this;
    /** Set the embed's image. */
    setImage(url?: string | null): this;
    /** Set the embed's footer. */
    setFooter(footer?: BetterEmbedFooter | string | null): this;
    /** Add or replace the embed's fields.
     *
     * ___NOTE:___ You can only have a MAX of 25 fields per `Embed`. */
    addFields(fieldData?: APIEmbedField[] | null, replaceAll?: boolean): this;
    /** Delete or replace the embed's fields.
     *
     * - ___NOTE:___ You can only have a MAX of 25 fields per `Embed`. */
    spliceFields(index: number, deleteCount: number, fieldData?: APIEmbedField[]): this;
    /** Set the embed's color. */
    setColor(color?: ColorResolvable | ColorResolvable[]): this;
    /** Set the embed's timestamp. */
    setTimestamp(timestamp?: number | boolean | Date | null): this;
    /** Send the embed. */
    send(handler: SendHandler, options?: DynaSendOptions, data?: BetterEmbedData): Promise<Message | null>;
}

type MimeType = "image/avif" | "image/jpeg" | "image/png" | "image/webp";
type ImageResolveable = string | URL | Buffer | ArrayBufferLike | Uint8Array | Image | Readable;
type ColorHex = `#${string}`;
interface CanvasOptions {
    fillColor: ColorHex;
    textColor: ColorHex;
    font: string;
    fontSize: number;
    textAlignment: CanvasTextAlign;
}
interface TextOptions {
    x: number;
    y: number;
    color: ColorHex;
    font: string;
    size: number;
    align: CanvasTextAlign;
    style?: "bold" | "italic" | "underline";
    placeInside?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
interface ImageOptions {
    x: number;
    y: number;
    width: number;
    height: number;
    rounded: boolean | number;
    padding?: number | {
        x: number;
        y: number;
    };
    placeInside?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

type PaginationEvent = "pageChanged" | "pageBack" | "pageNext" | "pageJumped" | "selectMenuOptionPicked" | "timeout";
type PaginationType = "short" | "shortJump" | "long" | "longJump";
type PageResolveable = EmbedResolveable | EmbedResolveable[] | PageData | NestedPageData;
interface PageNavigatorOptions {
    /** The type of pagination. Defaults to `short`. */
    type?: PaginationType;
    /** The user or users that are allowed to interact with the navigator. */
    allowedParticipants?: UserResolvable[];
    /** The pages to be displayed. */
    pages: PageResolveable | PageResolveable[];
    /** Whether or not to use reactions instead of buttons. */
    useReactions?: boolean;
    /** Whether to only add the `Page Jump` action when needed.
     *
     * I.E. if there's more than 5 pages, add the `Page Jump` button/reaction.
     *
     * ___NOTE:___ The threshold can be configured in the `./this.options.config.json` file. */
    dynamic?: boolean;
    /** How long to wait before timing out. Use `undefined` to never timeout.
     *
     * Defaults to `timeouts.PAGINATION`. Configure in `./this.options.config.json`.
     *
     * This option also utilizes {@link jsTools.parseTime}, letting you use "10s" or "1m 30s" instead of a number. */
    timeout?: number | string | undefined;
    /** A custom DJS config. */
    config?: DJSConfig;
    /** What to do after the page navigator times out.
     *
     * ___1.___ `disableComponents`: Disable the components. (default: `false`)
     *
     * ___2.___ `clearComponents`: Clear the components. (default: `true`)
     *
     * ___3.___ `clearReactions`: Clear the reactions. (default: `true`)
     *
     * ___4.___ `deleteMessage`: Delete the message. (default: `false`) */
    postTimeout?: {
        disableComponents?: boolean;
        clearComponentsOrReactions?: boolean;
        deleteMessage?: boolean;
    };
}
interface PageData {
    content?: string;
    embed: EmbedResolveable;
}
interface NestedPageData {
    nestedContent?: string[];
    nestedEmbeds: EmbedResolveable[];
}
interface SelectMenuOptionData {
    /** The emoji to be displayed to the left of the option. */
    emoji?: string | null;
    /** The main text to be displayed. */
    label: string;
    /** The description to be displayed. */
    description?: string;
    /** Custom option ID. Useful if you have custom handling for this option. */
    value?: string;
    /** Whether this is the default option. */
    default?: boolean;
}
interface SendOptions extends Omit<DynaSendOptions, "content" | "embeds" | "components"> {
}

declare class PageNavigator {
    options: {
        type: PaginationType;
        allowedParticipants: UserResolvable[];
        pages: Array<PageData | NestedPageData>;
        useReactions: boolean;
        dynamic: boolean;
        timeout: number | null;
        config: DJSConfig;
        postTimeout: {
            disableComponents: boolean;
            clearComponentsOrReactions: boolean;
            deleteMessage: boolean;
        };
    };
    data: {
        paginationReactionNames: string[];
        message: Message | null;
        messageActionRows: ActionRowBuilder<StringSelectMenuBuilder | ButtonBuilder>[];
        extraUserButtons: {
            index: number;
            component: ButtonBuilder;
        }[];
        page: {
            currentEmbed: EmbedResolveable | null;
            currentData: PageData | NestedPageData | null;
            currentMessageContent: string | undefined;
            index: {
                current: number;
                nested: number;
            };
        };
        selectMenu: {
            currentlySelected: StringSelectMenuOptionBuilder | null;
            optionIds: string[];
        };
        navigation: {
            reactions: {
                name: string;
                id: string;
            }[];
            required: boolean;
            canUseLong: boolean;
            canJump: boolean;
        };
        collectors: {
            component: InteractionCollector<StringSelectMenuInteraction | ButtonInteraction> | null;
            reaction: ReactionCollector | null;
        };
        components: {
            actionRows: {
                selectMenu: ActionRowBuilder<StringSelectMenuBuilder>;
                navigation: ActionRowBuilder<ButtonBuilder>;
            };
            selectMenu: StringSelectMenuBuilder;
            navigation: {
                to_first: ButtonBuilder;
                back: ButtonBuilder;
                jump: ButtonBuilder;
                next: ButtonBuilder;
                to_last: ButtonBuilder;
            };
        };
    };
    private events;
    private resolveEmbedsToPages;
    private createButton;
    private setPage;
    private callEventStack;
    private configure_navigation;
    private configure_components;
    private configure_all;
    private askPageNumber;
    private navComponents_removeFromMessage;
    private navReactions_addToMessage;
    private navReactions_removeFromMessage;
    private collect_components;
    private collect_reactions;
    private collect_all;
    private handlePostTimeout;
    constructor(options: PageNavigatorOptions);
    on(event: "pageChanged", listener: (page: PageData | NestedPageData, index: number) => any, once: boolean): this;
    on(event: "pageBack", listener: (page: PageData | NestedPageData, index: number) => any, once: boolean): this;
    on(event: "pageNext", listener: (page: PageData | NestedPageData, index: number) => any, once: boolean): this;
    on(event: "pageJumped", listener: (page: PageData | NestedPageData, index: number) => any, once: boolean): this;
    on(event: "selectMenuOptionPicked", listener: (page: PageData | NestedPageData, option: SelectMenuOptionData, index: number) => any, once: boolean): this;
    on(event: "timeout", listener: (message: Message) => any, once: boolean): this;
    /** Add one or more options to the select menu component. */
    addSelectMenuOptions(...options: SelectMenuOptionData[]): this;
    /** Remove select menu options at the given index/indices.
     * ```ts
     * // Remove the options at index 0, 2, and 4
     * PageNavigator.removeSelectMenuOptions(0, 2, 4);
     *
     * // Remove the last option
     * PageNavigator.removeSelectMenuOptions(-1);
     * ``` */
    removeSelectMenuOptions(...index: number[]): this;
    /** Set the pagination type. */
    setPaginationType(type: PaginationType): this;
    /** Allows inserting a button at the given index in the same action row as the navigation buttons. */
    insertButtonAt(index: number, component: ButtonBuilder): this;
    /** Remove buttons at the given index/indices.
     * ```ts
     * // Remove the button at index 0, 2, and 4
     * PageNavigator.removeButtonAt(0, 2, 4);
     *
     * // Remove the last button
     * PageNavigator.removeButtonAt(-1);
     * ``` */
    removeButtonAt(...index: number[]): this;
    /** Send the PageNavigator. */
    send(handler: SendHandler, options?: SendOptions): Promise<Message | null>;
    /** Refresh the current page embed, navigation, and collectors. */
    refresh(): Promise<Message | null>;
}

interface AwaitConfirmOptions extends Omit<DynaSendOptions, "embeds" | "components" | "deleteAfter" | "fetchReply" | "deleteAfter" | "files" | "forward" | "poll" | "reply" | "withResponse" | "stickers" | "tts"> {
    /** The users that are allowed to interact with the message. */
    allowedParticipants?: UserResolvable[];
    /** The embed or embed configuration to send. Set to `null` to not send an embed. */
    embed?: EmbedResolveable | null;
    /** How long to wait before timing out. Set to `null` to never timeout.
     *
     * Defaults to {@link djsConfig.timeouts.CONFIRMATION}.
     *
     * This option also utilizes {@link parseTime}, letting you use "10s" or "1m 30s" instead of a number. */
    timeout?: number | string | null;
    buttons?: {
        confirm?: {
            label?: string;
            emoji?: string;
        };
        cancel?: {
            label?: string;
            emoji?: string;
        };
    };
    onResolve?: {
        /** Delete the message after the `confirm` button is pressed. Default is `true`. */
        deleteOnConfirm?: boolean;
        /** Delete the message after the `cancel` button is pressed. Default is `true`. */
        deleteOnCancel?: boolean;
        /** Disable components instead of deleting the message. Default is `false`. */
        disableComponents?: boolean;
    };
    /** A custom DJS config. */
    config?: DJSConfig;
}

type FetchedChannel<T> = T extends ChannelType.DM ? PartialGroupDMChannel | DMChannel | PartialDMChannel : T extends ChannelType.GuildText ? GuildBasedChannel & TextBasedChannel : T extends ChannelType.PublicThread | ChannelType.PrivateThread | ChannelType.AnnouncementThread ? AnyThreadChannel : T extends ChannelType.GuildVoice ? VoiceBasedChannel : T extends ChannelType.GuildCategory ? CategoryChannel : GuildBasedChannel;
type MentionType = "users" | "channels" | "roles";

/** Returns the string if it's populated, or "0" otherwise.
 *
 * Useful for fetching where the provided ID may or may not exist.
 * @param str The string to check. */
declare function __zero(str?: string | undefined | null): string;
/** Check if the given string is a mention or a snowflake.
 *
 * Looks for formats like `<@123456789>`, or a numeric string with at least 6 digits.
 * @param str The string to check. */
declare function isMentionOrSnowflake(str: string): boolean;
/** Remove mention syntax from a string.
 * @param str The string to clean. */
declare function cleanMention(str: string): string;
/** Get the ID of the first mention of a specified type from a message or message content.
 * @param options Optional options that aren't really optional. */
declare function getFirstMentionId(options: {
    message?: Message;
    content?: string;
    type: MentionType;
}): string;
/** Fetch a user from the client, checking the cache first.
 * @param client - The client to fetch the user from.
 * @param userId - The ID of the user to fetch. */
declare function fetchUser(client: Client<true>, userId: string): Promise<User | null>;
/** Fetch a guild from the client, checking the cache first.
 * @param client - The client to fetch the guild from.
 * @param guildId - The ID of the guild to fetch. */
declare function fetchGuild(client: Client<true>, guildId: string): Promise<Guild | null>;
/** Fetch a member from a guild, checking the cache first.
 * @param guild - The guild to fetch the member from.
 * @param memberId - The ID of the member to fetch. */
declare function fetchMember(guild: Guild, memberId: string): Promise<GuildMember | null>;
/** Fetch a channel from a guild, checking the cache first.
 *
 * ***NOTE:*** If the channel type does not match the provided type or the channel is null, null is returned.
 * @param guild - The guild to fetch the channel from.
 * @param channelId - The ID of the channel to fetch.
 * @param type - The type of channel to fetch. */
declare function fetchChannel<T extends ChannelType>(guild: Guild, channelId: string, type?: T): Promise<FetchedChannel<T> | null>;
/** Fetch a role from a guild, checking the cache first.
 * @param guild - The guild to fetch the role from.
 * @param roleId - The ID of the role to fetch. */
declare function fetchRole(guild: Guild, roleId: string): Promise<Role | null>;
/** Fetch a message from a channel, checking the cache first.
 * @param channel - The channel to fetch the message from.
 * @param messageId - The ID of the message to fetch. */
declare function fetchMessage(channel: GuildTextBasedChannel | VoiceBasedChannel, messageId: string): Promise<Message | null>;

/** Delete a message after a specified amount of time.
 * @param message The message to delete, or a promise resolving to a message.
 * @param delay The time to wait before deleting the message. Defaults to `timeouts.ERROR_MESSAGE`.

 * This option also utilizes {@link jsTools.parseTime}, letting you use "10s" or "1m 30s" instead of a number. */
declare function deleteMessageAfter(message: Message | Promise<Message>, delay?: string | number): Promise<Message | null>;

interface ExtractionOptions {
    /** The amount of embeds to parse in the message. Defaults to `null` (unlimited). */
    embedDepth: number | null;
    /** Whether the returned strings should be lowercase. */
    lowercaseify: boolean;
}
/** Returns every word in the given message, including from `Embeds`. */
declare function extractMessage(message: Message, options?: ExtractionOptions): string[];

declare const _default: {
    extractMessage(message: discord_js.Message, options?: ExtractionOptions): string[];
    dynaSend(handler: SendHandler, options: (DynaSendOptions & {
        content: string;
    }) | (DynaSendOptions & {
        embeds: EmbedResolveable | EmbedResolveable[];
    }) | (DynaSendOptions & {
        components: discord_js.ActionRowBuilder<discord_js.MessageActionRowComponentBuilder> | discord_js.ActionRowBuilder<discord_js.MessageActionRowComponentBuilder>[];
    }) | (DynaSendOptions & {
        files: discord_js.BaseMessageOptions["files"];
    }) | (DynaSendOptions & {
        stickers: discord_js.StickerResolvable[];
    }) | (DynaSendOptions & {
        poll: discord_js.PollData;
    }) | (DynaSendOptions & {
        forward: discord_js.ForwardOptions;
    })): Promise<discord_js.Message | null>;
    deleteMessageAfter(message: discord_js.Message | Promise<discord_js.Message>, delay?: string | number): Promise<discord_js.Message | null>;
    __zero(str?: string | undefined | null): string;
    isMentionOrSnowflake(str: string): boolean;
    cleanMention(str: string): string;
    getFirstMentionId(options: {
        message?: discord_js.Message;
        content?: string;
        type: MentionType;
    }): string;
    fetchUser(client: discord_js.Client<true>, userId: string): Promise<discord_js.User | null>;
    fetchGuild(client: discord_js.Client<true>, guildId: string): Promise<discord_js.Guild | null>;
    fetchMember(guild: discord_js.Guild, memberId: string): Promise<discord_js.GuildMember | null>;
    fetchChannel<T extends discord_js.ChannelType>(guild: discord_js.Guild, channelId: string, type?: T): Promise<FetchedChannel<T> | null>;
    fetchRole(guild: discord_js.Guild, roleId: string): Promise<discord_js.Role | null>;
    fetchMessage(channel: discord_js.GuildTextBasedChannel | discord_js.VoiceBasedChannel, messageId: string): Promise<discord_js.Message | null>;
    customDJSConfig(config: jstools.DeepPartial<DJSConfig>): DJSConfig;
    djsConfig: DJSConfig;
    default(handler: SendHandler, options: AwaitConfirmOptions): Promise<{
        message: discord_js.Message | null;
        confirmed: boolean;
    }>;
    PageNavigator: typeof PageNavigator;
    BetterEmbed: typeof BetterEmbed;
    ANSIBuilder: typeof ANSIBuilder;
};

export { type ANSIBGColor, ANSIBuilder, type ANSIFormat, type ANSITextColor, type ANSITextOptions, type AwaitConfirmOptions, BetterEmbed, type BetterEmbedAuthor, type BetterEmbedData, type BetterEmbedFooter, type BetterEmbedTitle, type CanvasOptions, type ColorHex, type DJSConfig, type DynaSendData, type DynaSendOptions, type EmbedResolveable, type ExtractionOptions, type FetchedChannel, type ImageOptions, type ImageResolveable, type InteractionBasedSendHandler, type InteractionResolveable, type MentionType, type MimeType, type NestedPageData, type PageData, PageNavigator, type PageNavigatorOptions, type PageResolveable, type PaginationEvent, type PaginationType, type SelectMenuOptionData, type SendHandler, type SendMethod, type SendMethodChannelBased, type SendMethodInteractionBased, type SendMethodMessageBased, type SendMethodUserBased, type SendOptions, type SendableTextChannel, type TextOptions, type UserResolvable, __zero, cleanMention, customDJSConfig, _default as default, deleteMessageAfter, djsConfig, dynaSend, extractMessage, fetchChannel, fetchGuild, fetchMember, fetchMessage, fetchRole, fetchUser, getFirstMentionId, isMentionOrSnowflake };
