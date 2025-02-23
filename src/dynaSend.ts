import { EmbedResolveable, SendHandler, SendMethod, SendableTextChannel } from "./types";

export type DynaSendData<T extends SendMethod> = T extends "reply"
    ? InteractionReplyOptions
    : T extends "editReply"
    ? InteractionEditReplyOptions
    : T extends "followUp"
    ? InteractionReplyOptions
    : T extends "sendInChannel"
    ? MessageCreateOptions
    : T extends "messageReply"
    ? MessageReplyOptions
    : T extends "messageEdit"
    ? MessageEditOptions
    : T extends "dmUser"
    ? MessageCreateOptions
    : never;

type RequiredDynaSendOptions =
    | (DynaSendOptions & { content: string })
    | (DynaSendOptions & { embeds: EmbedResolveable | EmbedResolveable[] })
    | (DynaSendOptions & {
          components:
              | ActionRowBuilder<MessageActionRowComponentBuilder>
              | ActionRowBuilder<MessageActionRowComponentBuilder>[];
      })
    | (DynaSendOptions & { files: BaseMessageOptions["files"] })
    | (DynaSendOptions & { stickers: StickerResolvable[] })
    | (DynaSendOptions & { poll: PollData })
    | (DynaSendOptions & { forward: ForwardOptions });

export interface DynaSendOptions {
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

import {
    ActionRowBuilder,
    BaseChannel,
    BaseInteraction,
    BaseMessageOptions,
    ForwardOptions,
    GuildMember,
    InteractionCallbackResponse,
    InteractionEditReplyOptions,
    InteractionReplyOptions,
    Message,
    MessageActionRowComponentBuilder,
    MessageCreateOptions,
    MessageEditOptions,
    MessageMentionOptions,
    MessageReplyOptions,
    PollData,
    RepliableInteraction,
    ReplyOptions,
    StickerResolvable,
    User
} from "discord.js";
import { deleteMessageAfter } from "./deleteMessageAfter";
import jsTools from "jstools";

function isInteractionCallback(interaction: any): interaction is InteractionCallbackResponse {
    return interaction instanceof InteractionCallbackResponse;
}

function excludeFlags(flags: InteractionReplyOptions["flags"], ...types: InteractionReplyOptions["flags"][]) {
    if (!flags) return undefined;
    flags = jsTools.forceArray(flags);
    return flags.filter(f => types.includes(f));
}

function createSendData<T extends SendMethod>(options: DynaSendOptions, sendMethod: T): DynaSendData<T> {
    switch (sendMethod) {
        case "reply":
            return {
                content: options.content,
                embeds: options.embeds ? jsTools.forceArray(options.embeds).map(e => e.toJSON()) : undefined,
                components: options.components ? jsTools.forceArray(options.components).map(c => c.toJSON()) : undefined,
                ...(options.allowedMentions ? { allowedMentions: options.allowedMentions } : {}),
                withResponse: options.withResponse,
                flags: options.flags,
                files: options.files,
                poll: options.poll,
                tts: options.tts
            } as any;

        case "editReply":
            return {
                content: options.content,
                embeds: options.embeds ? jsTools.forceArray(options.embeds).map(e => e.toJSON()) : undefined,
                components: options.components ? jsTools.forceArray(options.components).map(c => c.toJSON()) : undefined,
                ...(options.allowedMentions ? { allowedMentions: options.allowedMentions } : {}),
                withResponse: options.withResponse,
                flags: excludeFlags(options.flags, "Ephemeral", "SuppressNotifications"),
                files: options.files,
                poll: options.poll
            } as any;

        case "followUp":
            return {
                content: options.content,
                embeds: options.embeds ? jsTools.forceArray(options.embeds).map(e => e.toJSON()) : undefined,
                components: options.components ? jsTools.forceArray(options.components).map(c => c.toJSON()) : undefined,
                ...(options.allowedMentions ? { allowedMentions: options.allowedMentions } : {}),
                withResponse: options.withResponse,
                flags: options.flags,
                files: options.files,
                poll: options.poll,
                tts: options.tts
            } as any;

        case "sendInChannel":
            return {
                content: options.content,
                embeds: options.embeds ? jsTools.forceArray(options.embeds).map(e => e.toJSON()) : undefined,
                components: options.components ? jsTools.forceArray(options.components).map(c => c.toJSON()) : undefined,
                ...(options.allowedMentions ? { allowedMentions: options.allowedMentions } : {}),
                flags: excludeFlags(options.flags, "Ephemeral"),
                files: options.files,
                poll: options.poll,
                tts: options.tts,
                stickers: options.stickers,
                reply: options.reply
            } as any;

        case "messageReply":
            return {
                content: options.content,
                embeds: options.embeds ? jsTools.forceArray(options.embeds).map(e => e.toJSON()) : undefined,
                components: options.components ? jsTools.forceArray(options.components).map(c => c.toJSON()) : undefined,
                ...(options.allowedMentions ? { allowedMentions: options.allowedMentions } : {}),
                flags: excludeFlags(options.flags, "Ephemeral"),
                files: options.files,
                poll: options.poll,
                tts: options.tts,
                stickers: options.stickers
            } as any;

        case "messageEdit":
            return {
                content: options.content,
                embeds: options.embeds ? jsTools.forceArray(options.embeds).map(e => e.toJSON()) : undefined,
                components: options.components ? jsTools.forceArray(options.components).map(c => c.toJSON()) : undefined,
                ...(options.allowedMentions ? { allowedMentions: options.allowedMentions } : {}),
                flags: excludeFlags(options.flags, "Ephemeral", "SuppressNotifications"),
                files: options.files
            } as any;

        case "dmUser":
            return {
                content: options.content,
                embeds: options.embeds ? jsTools.forceArray(options.embeds).map(e => e.toJSON()) : undefined,
                components: options.components ? jsTools.forceArray(options.components).map(c => c.toJSON()) : undefined,
                ...(options.allowedMentions ? { allowedMentions: options.allowedMentions } : {}),
                flags: excludeFlags(options.flags, "Ephemeral"),
                files: options.files,
                poll: options.poll,
                tts: options.tts,
                forward: options.forward,
                stickers: options.stickers
            } as any;

        default:
            return {} as any;
    }
}

/** Send a message using a dynamic SendHandler with very customizable options.
 *
 * Includes automatic error handling and type checking.
 * @param handler The handler that'll be used to send the message.
 * @param options The message options. */
export async function dynaSend(handler: SendHandler, options: RequiredDynaSendOptions): Promise<Message | null> {
    // Set SendMethod defaults
    options.sendMethod ??=
        handler instanceof BaseInteraction
            ? "reply"
            : handler instanceof BaseChannel
            ? "sendInChannel"
            : handler instanceof Message
            ? "messageReply"
            : handler instanceof GuildMember || handler instanceof User
            ? "dmUser"
            : undefined;

    // Parse deleteAfter time
    options.deleteAfter = options.deleteAfter ? jsTools.parseTime(options.deleteAfter) : undefined;

    /* - - - - - { Error Checking } - - - - - */
    if (options.sendMethod) {
        if (!(handler instanceof BaseInteraction) && ["reply", "editReply", "followUp"].includes(options.sendMethod))
            throw new TypeError("[DynaSend] Invalid SendMethod", { cause: "'handler' is not 'Interaction' based" });

        if (!(handler instanceof BaseChannel) && ["sendInChannel"].includes(options.sendMethod))
            throw new TypeError("[DynaSend] Invalid SendMethod", { cause: "'handler' is not 'Channel' based" });

        if (!(handler instanceof Message) && ["messageReply", "messageEdit"].includes(options.sendMethod))
            throw new TypeError("[DynaSend] Invalid SendMethod", { cause: "'handler' is not 'Message' based" });

        if (!(handler instanceof GuildMember || handler instanceof User) && ["dmUser"].includes(options.sendMethod))
            throw new TypeError("[DynaSend] Invalid SendMethod", { cause: "'handler' is not 'User' based" });

        // Interaction "editReply" fallback
        if (handler instanceof BaseInteraction && options.sendMethod === "reply" && (handler.replied || handler.deferred))
            options.sendMethod = "editReply";
    } else throw new TypeError("[DynaSend] Invalid SendMethod", { cause: "'sendMethod' cannot be null or undefined" });

    if (options.deleteAfter && (options.deleteAfter as number) < 1000)
        console.log("[DynaSend] 'deleteAfter' is less than 1 second. Is this intentional?");

    /* - - - - - { Send the Message } - - - - - */
    let message: Message | null = null;

    // Send the message based on the SendMethod
    switch (options.sendMethod) {
        case "reply":
            const _reply = await (handler as RepliableInteraction).reply(createSendData(options, "reply")).catch(err => {
                console.error("[DYNASEND]", "REPLY_TO_INTERACTION | SendMethod: 'reply'", err);
                return null;
            });
            message = isInteractionCallback(_reply) ? _reply.resource?.message || null : null;
            break;

        case "editReply":
            const _editReply = await (handler as RepliableInteraction)
                .editReply(createSendData(options, "editReply"))
                .catch(err => {
                    console.error("[DYNASEND]", "REPLY_TO_INTERACTION | SendMethod: 'reply'", err);
                    return null;
                });
            message = isInteractionCallback(_editReply) ? _editReply.resource?.message || null : null;
            break;

        case "followUp":
            const _followUp = await (handler as RepliableInteraction)
                .followUp(createSendData(options, "followUp"))
                .catch(err => {
                    console.error("[DYNASEND]", "REPLY_TO_INTERACTION | SendMethod: 'reply'", err);
                    return null;
                });
            message = isInteractionCallback(_followUp) ? _followUp.resource?.message || null : null;
            break;

        case "sendInChannel":
            message = await (handler as SendableTextChannel | GuildMember | User)
                .send(createSendData(options, "sendInChannel"))
                .catch(err => {
                    console.error("[DYNASEND]", "SEND_IN_CHANNEL | SendMethod: 'sendInChannel'", err);
                    return null;
                });
            break;

        case "messageReply":
            message = await (handler as Message).reply(createSendData(options, "messageReply")).catch(err => {
                console.error("[DYNASEND]", "REPLY_TO_MESSAGE | SendMethod: 'messageReply'", err);
                return null;
            });
            break;

        case "messageEdit":
            // Check if the message can be edited
            if (!(handler as Message).editable) {
                console.log("[DYNASEND] Message cannot be edited");
                break;
            }

            message = await (handler as Message).edit(createSendData(options, "messageEdit")).catch(err => {
                console.error("[DYNASEND]", "EDIT_MESSAGE | SendMethod: 'messageEdit'", err);
                return null;
            });
            break;

        case "dmUser":
            message = await (handler as GuildMember | User).send(createSendData(options, "dmUser")).catch(err => {
                console.error("[DYNASEND]", "DM_USER | SendMethod: 'dmUser'", err);
                return null;
            });
            break;

        default:
            throw new TypeError("[DynaSend] Invalid SendMethod", { cause: "'sendMethod' is not defined" });
    }

    // Delete the message after the given delay
    if (options.deleteAfter && message) deleteMessageAfter(message, options.deleteAfter);

    return message;
}
