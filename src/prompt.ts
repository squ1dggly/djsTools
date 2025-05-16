import { SendHandler, EmbedResolveable, UserResolvable } from "./types";

export interface PromptOptions
    extends Omit<
        DynaSendOptions,
        | "embeds"
        | "components"
        | "deleteAfter"
        | "fetchReply"
        | "deleteAfter"
        | "files"
        | "forward"
        | "poll"
        | "reply"
        | "withResponse"
        | "stickers"
        | "tts"
    > {
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
        confirm?: { label?: string; emoji?: string };
        cancel?: { label?: string; emoji?: string };
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

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, Message } from "discord.js";

import { DynaSendOptions, dynaSend } from "./dynaSend";
import { DJSConfig, djsConfig } from "./config";
import { BetterEmbed } from "./BetterEmbed";
import { parseTime } from "jstools";

/** Send a confirmation message and await the user's response.

 * This function utilizes {@link BetterEmbed} and {@link dynaSend}. */
export async function prompt(
    handler: SendHandler,
    options: PromptOptions
): Promise<{ message: Message | null; confirmed: boolean }> {
    const __config = options.config || djsConfig;

    // Parse timeout
    options.timeout = parseTime(options.timeout || __config.timeouts.CONFIRMATION);

    /* error prevention ( START ) */
    if (options.timeout && (options.timeout as number) < 1000) {
        console.log("[Prompt]: 'timeout' is less than 1 second. Is this intentional?");
    }
    /* error prevention ( END ) */

    /* - - - - - { Configure the Embed } - - - - - */
    const __embed =
        options.embed === undefined
            ? new BetterEmbed({
                  title: __config.prompt.DEFAULT_EMBED_TITLE,
                  description: __config.prompt.DEFAULT_EMBED_DESCRIPTION
              })
            : options.embed === null
            ? undefined
            : options.embed;

    /* - - - - - { Action Row  } - - - - - */
    const buttons = {
        confirm: new ButtonBuilder({
            customId: "btn_confirm",
            label: "Confirm",
            style: ButtonStyle.Success,
            ...options.buttons?.confirm
        }),
        cancel: new ButtonBuilder({
            customId: "btn_cancel",
            label: "Cancel",
            style: ButtonStyle.Danger,
            ...options.buttons?.cancel
        })
    };

    const actionRow = new ActionRowBuilder<ButtonBuilder>({ components: [buttons.confirm, buttons.cancel] });

    /* - - - - - { Send the Message } - - - - - */
    const message = await dynaSend(handler, {
        sendMethod: options.sendMethod,
        content: options.content,
        embeds: __embed,
        components: actionRow,
        flags: options.flags,
        allowedMentions: options.allowedMentions
    });

    // Cancel if the message failed to send
    if (!message) return { message: null, confirmed: false };

    /* - - - - - { Await the User's Decision } - - - - - */
    const cleanUp = async (resolve: (...args: any) => void, confirmed: boolean) => {
        // Delete the message ( CONFIRM )
        if (confirmed && (options.onResolve?.deleteOnConfirm ?? true)) {
            if (message?.deletable) await message.delete().catch(Boolean);
        }
        // Delete the message ( CANCEL )
        if (!confirmed && (options.onResolve?.deleteOnCancel ?? true)) {
            if (message?.deletable) await message.delete().catch(Boolean);
        }

        // Return and resolve the promise since the message was deleted
        if ((options.onResolve?.deleteOnConfirm ?? true) || (options.onResolve?.deleteOnCancel ?? true))
            return resolve(confirmed);

        // Disable the components
        if (options.onResolve?.disableComponents) {
            buttons.cancel.setDisabled(true);
            buttons.confirm.setDisabled(true);
            await message?.edit({ components: [actionRow] }).catch(Boolean);
        }

        // Resolve the promise
        return resolve({ message, confirmed });
    };

    // Map the allowed participants to their IDs
    const allowedParticipantIds = options.allowedParticipants
        ? options.allowedParticipants.map(m => (typeof m === "string" ? m : m?.id))
        : [];

    return new Promise(async resolve => {
        const executeAction = async (customId: string) => {
            switch (customId) {
                case "btn_confirm":
                    return await cleanUp(resolve, true);

                case "btn_cancel":
                    return await cleanUp(resolve, false);

                default:
                    return await cleanUp(resolve, false);
            }
        };

        // Wait for the next button interaction
        await message
            .awaitMessageComponent({
                filter: i =>
                    allowedParticipantIds.length
                        ? allowedParticipantIds.includes(i.user.id) && ["btn_confirm", "btn_cancel"].includes(i.customId)
                        : true,
                componentType: ComponentType.Button,
                time: options.timeout as number
            })
            .then(async i => {
                await i.deferUpdate().catch(Boolean);
                executeAction(i.customId);
            })
            .catch(() => executeAction("btn_cancel"));
    });
}
