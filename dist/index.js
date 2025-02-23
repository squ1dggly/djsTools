"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  BetterEmbed: () => BetterEmbed,
  __zero: () => __zero,
  cleanMention: () => cleanMention,
  customDJSConfig: () => customDJSConfig,
  deleteMessageAfter: () => deleteMessageAfter,
  djsConfig: () => djsConfig,
  dynaSend: () => dynaSend,
  extractMessage: () => extractMessage,
  fetchChannel: () => fetchChannel,
  fetchGuild: () => fetchGuild,
  fetchMember: () => fetchMember,
  fetchMessage: () => fetchMessage,
  fetchRole: () => fetchRole,
  fetchUser: () => fetchUser,
  getFirstMentionId: () => getFirstMentionId,
  isMentionOrSnowflake: () => isMentionOrSnowflake
});
module.exports = __toCommonJS(index_exports);

// src/config.ts
var djsConfig = {
  INVIS_CHAR: "\u200B",
  EMBED_COLOR: ["#2B2D31"],
  EMBED_COLOR_DEV: ["#2B2D31"],
  DEV_MODE: false,
  timeouts: {
    PAGINATION: "30s",
    CONFIRMATION: "15s",
    ERROR_MESSAGE: "5s"
  },
  awaitConfirm: {
    DEFAULT_EMBED_TITLE: "\u26A0\uFE0F Are you sure?",
    DEFAULT_EMBED_DESCRIPTION: "Carefully review your action and confirm your decision."
  },
  pageNavigator: {
    CAN_JUMP_THRESHOLD: 5,
    CAN_USE_LONG_THRESHOLD: 4,
    DEFAULT_SELECT_MENU_PLACEHOLDER: "Choose a page to view...",
    ASK_PAGE_NUMBER_MESSAGE: "$USER_MENTION say the page number you would like to view.",
    ASK_PAGE_NUMBER_ERROR: "$USER_MENTION `$MESSAGE_CONTENT` is not a valid page.",
    buttons: {
      to_first: { label: "\u25C0\u25C0", emoji: { animated: false, name: "\u23EE\uFE0F", id: "\u23EE\uFE0F" } },
      back: { label: "\u25C0", emoji: { animated: false, name: "\u25C0\uFE0F", id: "\u25C0\uFE0F" } },
      jump: { label: "\u{1F4C4}", emoji: { animated: false, name: "\u{1F4C4}", id: "\u{1F4C4}" } },
      next: { label: "\u25B6", emoji: { animated: false, name: "\u25B6\uFE0F", id: "\u25B6\uFE0F" } },
      to_last: { label: "\u25B6\u25B6", emoji: { animated: false, name: "\u23ED\uFE0F", id: "\u23ED\uFE0F" } }
    }
  },
  ansi: {
    ESCAPE: "\x1B",
    formats: {
      normal: 0,
      bold: 1,
      underline: 2
    },
    colors: {
      text: {
        gray: 30,
        red: 31,
        green: 32,
        yellow: 33,
        blue: 34,
        pink: 35,
        cyan: 36,
        white: 37
      },
      bg: {
        firefly_dark_blue: 40,
        orange: 41,
        marble_blue: 42,
        grayish_turqouise: 43,
        gray: 44,
        indigo: 45,
        light_gray: 46,
        white: 47
      }
    }
  }
};
function customDJSConfig(config) {
  return {
    INVIS_CHAR: config.INVIS_CHAR || djsConfig.INVIS_CHAR,
    EMBED_COLOR: config.EMBED_COLOR || djsConfig.EMBED_COLOR,
    EMBED_COLOR_DEV: config.EMBED_COLOR_DEV || djsConfig.EMBED_COLOR_DEV,
    DEV_MODE: config.DEV_MODE || djsConfig.DEV_MODE,
    timeouts: { ...config.timeouts, ...djsConfig.timeouts },
    awaitConfirm: { ...config.awaitConfirm, ...djsConfig.awaitConfirm },
    pageNavigator: { ...config.pageNavigator, ...djsConfig.pageNavigator },
    ansi: { ...config.ansi, ...djsConfig.ansi }
  };
}

// src/dTools.ts
function __zero(str) {
  return str?.length ? str : "0";
}
function isMentionOrSnowflake(str) {
  return str.match(/<@[#&]?[\d]{6,}>/) || str.match(/\d{6,}/) ? true : false;
}
function cleanMention(str) {
  return str.replaceAll(/[<@#&>]/g, "").trim();
}
function getFirstMentionId(options) {
  let mentionId = "";
  if (options.message) {
    switch (options.type) {
      case "users":
        mentionId = options.message.mentions.users.first()?.id || "";
      case "channels":
        mentionId = options.message.mentions.channels.first()?.id || "";
      case "roles":
        mentionId = options.message.mentions.roles.first()?.id || "";
    }
  }
  const firstArg = options.content?.split(" ")[0] || "";
  return mentionId || isMentionOrSnowflake(firstArg) ? cleanMention(firstArg) : "";
}
async function fetchUser(client, userId) {
  return client.users.cache.get(userId) || await client.users.fetch(__zero(userId)).catch(() => null);
}
async function fetchGuild(client, guildId) {
  return client.guilds.cache.get(guildId) || await client.guilds.fetch(__zero(guildId)).catch(() => null);
}
async function fetchMember(guild, memberId) {
  return guild.members.cache.get(memberId) || await guild.members.fetch(__zero(memberId)).catch(() => null);
}
async function fetchChannel(guild, channelId, type) {
  const channel = guild.channels.cache.get(channelId) || await guild.channels.fetch(__zero(channelId)).catch(() => null);
  if (type && channel?.type !== type) return null;
  return channel;
}
async function fetchRole(guild, roleId) {
  return guild.roles.cache.get(roleId) || await guild.roles.fetch(__zero(roleId)).catch(() => null) || null;
}
async function fetchMessage(channel, messageId) {
  return channel.messages.cache.get(messageId) || await channel.messages.fetch(__zero(messageId)).catch(() => null) || null;
}

// src/extractMessage.ts
function extractMessage(message, options) {
  const _options = {
    embedDepth: null,
    lowercaseify: true,
    ...options
  };
  const content = [];
  if (message.content) {
    content.push(...message.content.split(" "));
  }
  if (message?.embeds?.length) {
    for (let embed of message.embeds.slice(0, _options.embedDepth ?? message.embeds.length - 1)) {
      if (embed?.title) content.push(...embed.title.split(" "));
      if (embed?.author?.name) content.push(...embed.author.name.split(" "));
      if (embed?.description) content.push(...embed.description.split(" "));
      if (embed?.fields?.length) {
        for (let field of embed.fields) {
          if (field?.name) content.push(...field.name.split(" "));
          if (field?.value) content.push(...field.value.split(" "));
        }
      }
      if (embed?.footer?.text) content.push(...embed.footer.text.split(" "));
    }
  }
  return content.map((str) => (_options.lowercaseify ? str.toLowerCase() : str).trim()).filter((str) => str);
}

// src/deleteMessageAfter.ts
var import_jstools = __toESM(require("jstools"));
async function deleteMessageAfter(message, delay = djsConfig.timeouts.ERROR_MESSAGE) {
  delay = import_jstools.default.parseTime(delay);
  message = await Promise.resolve(message);
  await import_jstools.default.sleep(delay);
  if (!message.deletable) return null;
  return await message.delete().catch(null);
}

// src/awaitConfirm.ts
var import_discord3 = require("discord.js");

// src/dynaSend.ts
var import_discord = require("discord.js");
var import_jstools2 = __toESM(require("jstools"));
function isInteractionCallback(interaction) {
  return interaction instanceof import_discord.InteractionCallbackResponse;
}
function excludeFlags(flags, ...types) {
  if (!flags) return void 0;
  flags = import_jstools2.default.forceArray(flags);
  return flags.filter((f) => types.includes(f));
}
function createSendData(options, sendMethod) {
  switch (sendMethod) {
    case "reply":
      return {
        content: options.content,
        embeds: options.embeds ? import_jstools2.default.forceArray(options.embeds).map((e) => e.toJSON()) : void 0,
        components: options.components ? import_jstools2.default.forceArray(options.components).map((c) => c.toJSON()) : void 0,
        ...options.allowedMentions ? { allowedMentions: options.allowedMentions } : {},
        withResponse: options.withResponse,
        flags: options.flags,
        files: options.files,
        poll: options.poll,
        tts: options.tts
      };
    case "editReply":
      return {
        content: options.content,
        embeds: options.embeds ? import_jstools2.default.forceArray(options.embeds).map((e) => e.toJSON()) : void 0,
        components: options.components ? import_jstools2.default.forceArray(options.components).map((c) => c.toJSON()) : void 0,
        ...options.allowedMentions ? { allowedMentions: options.allowedMentions } : {},
        withResponse: options.withResponse,
        flags: excludeFlags(options.flags, "Ephemeral", "SuppressNotifications"),
        files: options.files,
        poll: options.poll
      };
    case "followUp":
      return {
        content: options.content,
        embeds: options.embeds ? import_jstools2.default.forceArray(options.embeds).map((e) => e.toJSON()) : void 0,
        components: options.components ? import_jstools2.default.forceArray(options.components).map((c) => c.toJSON()) : void 0,
        ...options.allowedMentions ? { allowedMentions: options.allowedMentions } : {},
        withResponse: options.withResponse,
        flags: options.flags,
        files: options.files,
        poll: options.poll,
        tts: options.tts
      };
    case "sendInChannel":
      return {
        content: options.content,
        embeds: options.embeds ? import_jstools2.default.forceArray(options.embeds).map((e) => e.toJSON()) : void 0,
        components: options.components ? import_jstools2.default.forceArray(options.components).map((c) => c.toJSON()) : void 0,
        ...options.allowedMentions ? { allowedMentions: options.allowedMentions } : {},
        flags: excludeFlags(options.flags, "Ephemeral"),
        files: options.files,
        poll: options.poll,
        tts: options.tts,
        stickers: options.stickers,
        reply: options.reply
      };
    case "messageReply":
      return {
        content: options.content,
        embeds: options.embeds ? import_jstools2.default.forceArray(options.embeds).map((e) => e.toJSON()) : void 0,
        components: options.components ? import_jstools2.default.forceArray(options.components).map((c) => c.toJSON()) : void 0,
        ...options.allowedMentions ? { allowedMentions: options.allowedMentions } : {},
        flags: excludeFlags(options.flags, "Ephemeral"),
        files: options.files,
        poll: options.poll,
        tts: options.tts,
        stickers: options.stickers
      };
    case "messageEdit":
      return {
        content: options.content,
        embeds: options.embeds ? import_jstools2.default.forceArray(options.embeds).map((e) => e.toJSON()) : void 0,
        components: options.components ? import_jstools2.default.forceArray(options.components).map((c) => c.toJSON()) : void 0,
        ...options.allowedMentions ? { allowedMentions: options.allowedMentions } : {},
        flags: excludeFlags(options.flags, "Ephemeral", "SuppressNotifications"),
        files: options.files
      };
    case "dmUser":
      return {
        content: options.content,
        embeds: options.embeds ? import_jstools2.default.forceArray(options.embeds).map((e) => e.toJSON()) : void 0,
        components: options.components ? import_jstools2.default.forceArray(options.components).map((c) => c.toJSON()) : void 0,
        ...options.allowedMentions ? { allowedMentions: options.allowedMentions } : {},
        flags: excludeFlags(options.flags, "Ephemeral"),
        files: options.files,
        poll: options.poll,
        tts: options.tts,
        forward: options.forward,
        stickers: options.stickers
      };
    default:
      return {};
  }
}
async function dynaSend(handler, options) {
  options.sendMethod ??= handler instanceof import_discord.BaseInteraction ? "reply" : handler instanceof import_discord.BaseChannel ? "sendInChannel" : handler instanceof import_discord.Message ? "messageReply" : handler instanceof import_discord.GuildMember || handler instanceof import_discord.User ? "dmUser" : void 0;
  options.deleteAfter = options.deleteAfter ? import_jstools2.default.parseTime(options.deleteAfter) : void 0;
  if (options.sendMethod) {
    if (!(handler instanceof import_discord.BaseInteraction) && ["reply", "editReply", "followUp"].includes(options.sendMethod))
      throw new TypeError("[DynaSend] Invalid SendMethod", { cause: "'handler' is not 'Interaction' based" });
    if (!(handler instanceof import_discord.BaseChannel) && ["sendInChannel"].includes(options.sendMethod))
      throw new TypeError("[DynaSend] Invalid SendMethod", { cause: "'handler' is not 'Channel' based" });
    if (!(handler instanceof import_discord.Message) && ["messageReply", "messageEdit"].includes(options.sendMethod))
      throw new TypeError("[DynaSend] Invalid SendMethod", { cause: "'handler' is not 'Message' based" });
    if (!(handler instanceof import_discord.GuildMember || handler instanceof import_discord.User) && ["dmUser"].includes(options.sendMethod))
      throw new TypeError("[DynaSend] Invalid SendMethod", { cause: "'handler' is not 'User' based" });
    if (handler instanceof import_discord.BaseInteraction && options.sendMethod === "reply" && (handler.replied || handler.deferred))
      options.sendMethod = "editReply";
  } else throw new TypeError("[DynaSend] Invalid SendMethod", { cause: "'sendMethod' cannot be null or undefined" });
  if (options.deleteAfter && options.deleteAfter < 1e3)
    console.log("[DynaSend] 'deleteAfter' is less than 1 second. Is this intentional?");
  let message = null;
  switch (options.sendMethod) {
    case "reply":
      const _reply = await handler.reply(createSendData(options, "reply")).catch((err) => {
        console.error("[DYNASEND]", "REPLY_TO_INTERACTION | SendMethod: 'reply'", err);
        return null;
      });
      message = isInteractionCallback(_reply) ? _reply.resource?.message || null : null;
      break;
    case "editReply":
      const _editReply = await handler.editReply(createSendData(options, "editReply")).catch((err) => {
        console.error("[DYNASEND]", "REPLY_TO_INTERACTION | SendMethod: 'reply'", err);
        return null;
      });
      message = isInteractionCallback(_editReply) ? _editReply.resource?.message || null : null;
      break;
    case "followUp":
      const _followUp = await handler.followUp(createSendData(options, "followUp")).catch((err) => {
        console.error("[DYNASEND]", "REPLY_TO_INTERACTION | SendMethod: 'reply'", err);
        return null;
      });
      message = isInteractionCallback(_followUp) ? _followUp.resource?.message || null : null;
      break;
    case "sendInChannel":
      message = await handler.send(createSendData(options, "sendInChannel")).catch((err) => {
        console.error("[DYNASEND]", "SEND_IN_CHANNEL | SendMethod: 'sendInChannel'", err);
        return null;
      });
      break;
    case "messageReply":
      message = await handler.reply(createSendData(options, "messageReply")).catch((err) => {
        console.error("[DYNASEND]", "REPLY_TO_MESSAGE | SendMethod: 'messageReply'", err);
        return null;
      });
      break;
    case "messageEdit":
      if (!handler.editable) {
        console.log("[DYNASEND] Message cannot be edited");
        break;
      }
      message = await handler.edit(createSendData(options, "messageEdit")).catch((err) => {
        console.error("[DYNASEND]", "EDIT_MESSAGE | SendMethod: 'messageEdit'", err);
        return null;
      });
      break;
    case "dmUser":
      message = await handler.send(createSendData(options, "dmUser")).catch((err) => {
        console.error("[DYNASEND]", "DM_USER | SendMethod: 'dmUser'", err);
        return null;
      });
      break;
    default:
      throw new TypeError("[DynaSend] Invalid SendMethod", { cause: "'sendMethod' is not defined" });
  }
  if (options.deleteAfter && message) deleteMessageAfter(message, options.deleteAfter);
  return message;
}

// src/BetterEmbed.ts
var import_discord2 = require("discord.js");
var import_jstools3 = require("jstools");
var BetterEmbed = class _BetterEmbed {
  embed = new import_discord2.EmbedBuilder();
  config = djsConfig;
  dataInit = {
    context: { client: null, interaction: null, channel: null, message: null, user: null },
    author: { context: null, text: "", icon: null, hyperlink: null },
    title: { text: "", hyperlink: null },
    thumbnailURL: null,
    imageURL: null,
    description: null,
    footer: { text: "", icon: null },
    color: null,
    timestamp: null,
    fields: [],
    acf: true
  };
  data = {
    context: { client: null, interaction: null, channel: null, message: null, user: null },
    author: { context: null, text: "", icon: null, hyperlink: null },
    title: { text: "", hyperlink: null },
    thumbnailURL: null,
    imageURL: null,
    description: null,
    footer: { text: "", icon: null },
    color: null,
    timestamp: null,
    fields: [],
    acf: true
  };
  applyContextFormatting(str) {
    if (!str) return "";
    if (!str.includes("$") || !this.data.acf) return str;
    let user = null;
    let guildMember = null;
    let date = /* @__PURE__ */ new Date();
    if (!this.data.context?.user) {
      let _authorContext = this.data.author.context;
      if (_authorContext instanceof import_discord2.User) user = _authorContext;
      if (_authorContext instanceof import_discord2.GuildMember) {
        user = _authorContext.user;
        guildMember = _authorContext;
      }
    } else {
      if (this.data.context.user instanceof import_discord2.User) user = this.data.context.user;
      if (this.data.context.user instanceof import_discord2.GuildMember) {
        user = this.data.context.user.user;
        guildMember = this.data.context.user;
      }
    }
    if (user) str = str.replace(/(?<!\\)\$USER\b/g, user.toString()).replace(/(?<!\\)\$USER_NAME\b/g, user.username).replace(/(?<!\\)\$USER_AVATAR\b/g, user.avatarURL() || "USER_HAS_NO_AVATAR");
    if (guildMember) str = str.replace(/(?<!\\)\$DISPLAY_NAME\b/g, guildMember.displayName);
    let _interactionOrMessageContext = this.data.context?.interaction || this.data.context?.message;
    if (_interactionOrMessageContext) str = str.replace(/(?<!\\)\$BOT_AVATAR\b/g, _interactionOrMessageContext.client.user.avatarURL() || "BOT_HAS_NO_AVATAR");
    str = str.replace(/(?<!\\)\$INVIS\b/g, this.config.INVIS_CHAR).replace(/(?<!\\|<)@[0-9]+(?!>)/g, (s) => `<@${s.substring(1)}>`).replace(/(?<!\\|<)@&[0-9]+(?!>)/g, (s) => `<@&${s.substring(2)}>`).replace(/(?<!\\|<)#[0-9]+(?!>)/g, (s) => `<#${s.substring(1)}>`).replace(/(?<!\\)\$YEAR/g, date.getFullYear().toString()).replace(/(?<!\\)\$MONTH/g, `0${date.getMonth() + 1}`.slice(-2)).replace(/(?<!\\)\$DAY/g, `0${date.getDate()}`.slice(-2)).replace(/(?<!\\)\$year/g, `${date.getFullYear()}`.substring(2)).replace(/(?<!\\)\$month/g, `0${date.getMonth() + 1}`.slice(-2)).replace(/(?<!\\)\$day/g, `0${date.getDate()}`.slice(-2));
    return str;
  }
  parseData() {
    if (typeof this.data.author === "string")
      this.data.author = { context: null, text: this.data.author, icon: null, hyperlink: null };
    else if (!this.data.author)
      this.data.author = { context: null, text: "", icon: null, hyperlink: null };
    if (typeof this.data.title === "string")
      this.data.title = { text: this.data.title, hyperlink: null };
    else if (!this.data.title)
      this.data.title = { text: "", hyperlink: null };
    if (typeof this.data.footer === "string")
      this.data.footer = { text: this.data.footer, icon: null };
    else if (!this.data.footer)
      this.data.footer = { text: "", icon: null };
    if (this.data.timestamp === true) this.data.timestamp = Date.now();
    let _interactionContext = this.data.context?.interaction;
    if (!this.data.author.context && _interactionContext && _interactionContext.member instanceof import_discord2.GuildMember)
      this.data.author.context = _interactionContext.member;
    let _messageContext = this.data.context?.message;
    if (!this.data.author.context && _messageContext)
      this.data.author.context = _messageContext?.member || _messageContext?.author;
    if (this.data.acf) {
      this.data.author.text = this.applyContextFormatting(this.data.author.text);
      this.data.title.text = this.applyContextFormatting(this.data.title.text);
      this.data.description = this.applyContextFormatting(this.data.description || "");
      this.data.footer.text = this.applyContextFormatting(this.data.footer.text);
      if (this.data.author.icon === true && this.data.author.context) {
        if (this.data.author.context instanceof import_discord2.GuildMember)
          this.data.author.icon = this.data.author.context.user.avatarURL();
        if (this.data.author.context instanceof import_discord2.User)
          this.data.author.icon = this.data.author.context.avatarURL();
      } else if (typeof this.data.author.icon === "string")
        this.data.author.icon = this.applyContextFormatting(this.data.author.icon) || null;
    } else {
      if (this.data.author.icon === true) this.data.author.icon = null;
    }
  }
  configure() {
    this.setAuthor();
    this.setTitle();
    this.setThumbnail();
    this.setDescription();
    this.setImage();
    this.setFooter();
    this.addFields(this.data.fields, true);
    this.setColor(
      (0, import_jstools3.choice)(this.config.DEV_MODE ? this.config.EMBED_COLOR_DEV : this.config.EMBED_COLOR)
    );
    this.setTimestamp();
  }
  constructor(data) {
    this.data = { ...this.data, ...data };
    this.config = this.data.config ?? djsConfig;
    this.parseData();
    this.configure();
  }
  /** Returns a new `BetterEmbed` with the same (or different) configuration. */
  clone(options) {
    return new _BetterEmbed({ ...this.data, ...options });
  }
  /** Serializes this builder to API-compatible JSON data. */
  toJSON() {
    return this.embed.toJSON();
  }
  /** Set the embed's author. */
  setAuthor(author = this.data.author) {
    let _thisAuthor = this.data.author;
    if (author === null)
      this.data.author = structuredClone(this.dataInit.author);
    else if (typeof author === "string")
      this.data.author = { ..._thisAuthor, text: author };
    else
      this.data.author = { ..._thisAuthor, ...author };
    this.parseData();
    if (_thisAuthor.text) {
      this.embed.setAuthor({ name: _thisAuthor.text });
    }
    if (_thisAuthor?.icon) {
      try {
        this.embed.setAuthor({
          name: this.embed.data.author?.name || "",
          // NOT-USED
          iconURL: _thisAuthor?.icon || void 0,
          url: this.embed.data.author?.url
          // NOT-USED
        });
      } catch (err) {
        console.error("[BetterEmbed]", `INVALID_AUTHOR_ICON | '${_thisAuthor.icon}'`, err);
      }
    }
    if (_thisAuthor?.hyperlink) {
      try {
        this.embed.setAuthor({
          name: this.embed.data.author?.name || "",
          // NOT-USED
          iconURL: this.embed.data.author?.icon_url,
          // NOT-USED
          url: _thisAuthor.hyperlink || void 0
        });
      } catch (err) {
        console.error("[BetterEmbed]", `INVALID_AUTHOR_HYPERLINK | '${_thisAuthor.hyperlink}'`, err);
      }
    }
    return this;
  }
  /** Set the embed's title. */
  setTitle(title = this.data.title) {
    let _thisTitle = this.data.title;
    if (title === null)
      this.data.author = structuredClone(this.dataInit.title);
    else if (typeof title === "string")
      this.data.author = { ..._thisTitle, text: title };
    else
      this.data.author = { ..._thisTitle, ...title };
    this.parseData();
    if (_thisTitle.text) {
      this.embed.setTitle(_thisTitle.text);
    }
    if (_thisTitle?.hyperlink) {
      try {
        this.embed.setURL(_thisTitle.hyperlink || null);
      } catch (err) {
        console.error("[BetterEmbed]", `INVALID_TITLE_HYPERLINK | '${_thisTitle.hyperlink}'`, err);
      }
    }
    return this;
  }
  /** Set the embed's thumbnail. */
  setThumbnail(url = this.data.thumbnailURL) {
    if (url) url = this.applyContextFormatting(url.trim());
    try {
      this.embed.setThumbnail(url);
    } catch (err) {
      console.error("[BetterEmbed]", `INVALID_THUMBNAIL_URL | '${this.data.thumbnailURL}'`);
      return this;
    }
    this.data.thumbnailURL = url;
    return this;
  }
  /** Set the embed's description. */
  setDescription(description = this.data.description) {
    if (description) description = this.applyContextFormatting(description);
    this.embed.setDescription(description || null);
    this.data.description = description;
    return this;
  }
  /** Set the embed's image. */
  setImage(url = this.data.imageURL) {
    if (url) url = this.applyContextFormatting(url.trim());
    try {
      this.embed.setImage(url);
    } catch {
      console.error("[BetterEmbed]", `INVALID_IMAGE_URL | '${this.data.imageURL}'`);
      return this;
    }
    this.data.imageURL = url;
    return this;
  }
  /** Set the embed's footer. */
  setFooter(footer = this.data.footer) {
    let _thisFooter = this.data.footer;
    if (footer === null)
      this.data.footer = structuredClone(this.dataInit.footer);
    else if (typeof footer === "string")
      this.data.footer = { ..._thisFooter, text: footer };
    else
      this.data.footer = { ..._thisFooter, ...footer };
    this.parseData();
    if (_thisFooter.text) {
      this.embed.setFooter({ text: _thisFooter.text });
    }
    if (_thisFooter.icon) {
      try {
        this.embed.setFooter({
          text: this.embed.data.footer?.text || "",
          // NOT-USED
          iconURL: _thisFooter.icon || void 0
        });
      } catch (err) {
        console.error("[BetterEmbed]", `INVALID_FOOTER_ICON | '${_thisFooter.icon}'`, err);
      }
    }
    return this;
  }
  /** Add or replace the embed's fields.
   *
   * ___NOTE:___ You can only have a MAX of 25 fields per `Embed`. */
  addFields(fieldData = this.data.fields, replaceAll = false) {
    let _thisFields = this.data.fields;
    if (replaceAll && !fieldData?.length) {
      this.data.fields = [];
      this.embed.spliceFields(0, this.embed.data.fields?.length || 0);
      return this;
    }
    if (!fieldData) return this;
    if (fieldData.length > 25) {
      let _trimLength = fieldData.length - 25;
      fieldData = fieldData.slice(0, 25);
      console.log(`[BetterEmbed] You can only have a MAX of 25 fields. ${_trimLength} ${_trimLength === 1 ? "field has" : "fields have"} been trimmed`);
    }
    if (this.data.acf) {
      for (let i = 0; i < fieldData.length; i++) {
        fieldData[i].name = this.applyContextFormatting(fieldData[i].name);
        fieldData[i].value = this.applyContextFormatting(fieldData[i].value);
      }
    }
    if (replaceAll) {
      this.data.fields = fieldData;
      this.embed.setFields(fieldData);
    } else {
      _thisFields.push(...fieldData);
      this.embed.addFields(fieldData);
    }
    return this;
  }
  /** Delete or replace the embed's fields.
   *
   * - ___NOTE:___ You can only have a MAX of 25 fields per `Embed`. */
  spliceFields(index, deleteCount, fieldData) {
    let _thisFields = this.data.fields;
    if (fieldData)
      _thisFields.splice(index, deleteCount, ...fieldData);
    else
      _thisFields.splice(index, deleteCount);
    return this.addFields(fieldData, true);
  }
  /** Set the embed's color. */
  setColor(color = this.data.color) {
    let _color = Array.isArray(color) ? (0, import_jstools3.choice)(color) : color;
    try {
      this.embed.setColor(_color || null);
    } catch {
      console.error("[BetterEmbed]", `INVALID_COLOR | '${this.data.color}'`);
      return this;
    }
    this.data.color = _color;
    return this;
  }
  /** Set the embed's timestamp. */
  setTimestamp(timestamp = this.data.timestamp) {
    if (timestamp === true) timestamp = Date.now();
    try {
      this.embed.setTimestamp(timestamp);
    } catch {
      console.error("[BetterEmbed]", `INVALID_TIMESTAMP | '${this.data.timestamp}'`);
      return this;
    }
    this.data.timestamp = timestamp || null;
    return this;
  }
  /** Send the embed. */
  async send(handler, options, data) {
    let _embed = this;
    this.parseData();
    if (options?.content && this.data.acf) options.content = this.applyContextFormatting(options.content);
    if (data) _embed = this.clone(data);
    return await dynaSend(handler, {
      ...options,
      embeds: [_embed, ...options?.embeds ? (0, import_jstools3.forceArray)(options?.embeds) : []]
    });
  }
};

// src/awaitConfirm.ts
var import_jstools4 = require("jstools");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BetterEmbed,
  __zero,
  cleanMention,
  customDJSConfig,
  deleteMessageAfter,
  djsConfig,
  dynaSend,
  extractMessage,
  fetchChannel,
  fetchGuild,
  fetchMember,
  fetchMessage,
  fetchRole,
  fetchUser,
  getFirstMentionId,
  isMentionOrSnowflake
});
