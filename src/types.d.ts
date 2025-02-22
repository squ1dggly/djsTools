import {
    AnyThreadChannel,
    CacheType,
    CategoryChannel,
    CommandInteraction,
    DMChannel,
    EmbedBuilder,
    GuildBasedChannel,
    GuildMember,
    InteractionEditReplyOptions,
    InteractionReplyOptions,
    Message,
    MessageCreateOptions,
    MessageEditOptions,
    MessageReplyOptions,
    NewsChannel,
    PartialDMChannel,
    PartialGroupDMChannel,
    RepliableInteraction,
    TextBasedChannel,
    TextChannel,
    ThreadChannel,
    User,
    VoiceBasedChannel
} from "discord.js";
import BetterEmbed from "./BetterEmbed";

export type SendHandler = CommandInteraction | RepliableInteraction | TextBasedChannel | Message | GuildMember | User;
export type InteractionBasedSendHandler = CommandInteraction | RepliableInteraction;

export type SendMethodInteractionBased = "reply" | "editReply" | "followUp";
export type SendMethodChannelBased = "sendInChannel";
export type SendMethodMessageBased = "messageReply" | "messageEdit";
export type SendMethodUserBased = "dmUser";
export type SendMethod = SendMethodInteractionBased | SendMethodChannelBased | SendMethodMessageBased | SendMethodUserBased;

export type EmbedResolveable = EmbedBuilder | BetterEmbed;
export type InteractionResolveable = CommandInteraction | RepliableInteraction;
export type UserResolvable = GuildMember | User | string;

export type SendableTextChannel = DMChannel | TextChannel | NewsChannel | ThreadChannel;
