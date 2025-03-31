var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/AnsiBuilder.ts
var AnsiBuilder_exports = {};
__export(AnsiBuilder_exports, {
  ANSIBuilder: () => ANSIBuilder
});

// src/config.ts
var config_exports = {};
__export(config_exports, {
  customDJSConfig: () => customDJSConfig,
  djsConfig: () => djsConfig
});
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

// src/AnsiBuilder.ts
var ANSIBuilder = class {
  stringArray = [];
  constructor(text, options) {
    if (text) this.addLines({ text, options: options ?? {} });
  }
  addLines(...lines) {
    for (const line of lines) {
      const __config = line.options.config ?? djsConfig;
      const ansi = "$ESC[$FORMAT;$BG_COLOR;$TEXT_COLORm$TEXT$ESC[0m".replace(/\$ESC/g, __config.ansi.ESCAPE).replace("$FORMAT", `${__config.ansi.formats[line.options.format ?? "normal"]}`).replace("$BG_COLOR;", line.options.bgColor ? `${__config.ansi.colors.bg[line.options.bgColor]};` : "").replace("$TEXT_COLOR", line.options.color ? `${__config.ansi.colors.text[line.options.color]}` : "").replace("$TEXT", line.text);
      this.stringArray.push(ansi);
    }
    return this;
  }
  toString(codeblock = false) {
    const ansi = this.stringArray.join("\n");
    return codeblock ? `\`\`\`ansi
${ansi}
\`\`\`` : ansi;
  }
};

// src/BetterEmbed.ts
var BetterEmbed_exports = {};
__export(BetterEmbed_exports, {
  BetterEmbed: () => BetterEmbed
});
import {
  EmbedBuilder,
  GuildMember as GuildMember2,
  User as User2
} from "discord.js";

// src/dynaSend.ts
var dynaSend_exports = {};
__export(dynaSend_exports, {
  dynaSend: () => dynaSend
});
import {
  BaseChannel,
  BaseInteraction,
  GuildMember,
  InteractionCallbackResponse,
  Message,
  User
} from "discord.js";

// src/deleteMessageAfter.ts
var deleteMessageAfter_exports = {};
__export(deleteMessageAfter_exports, {
  deleteMessageAfter: () => deleteMessageAfter
});
import jsTools from "jstools";
async function deleteMessageAfter(message, delay = djsConfig.timeouts.ERROR_MESSAGE) {
  delay = jsTools.parseTime(delay);
  message = await Promise.resolve(message);
  await jsTools.sleep(delay);
  if (!message.deletable) return null;
  return await message.delete().catch(null);
}

// src/dynaSend.ts
import jsTools2 from "jstools";
function isInteractionCallback(interaction) {
  return interaction instanceof InteractionCallbackResponse;
}
function excludeFlags(flags, ...types) {
  if (!flags) return void 0;
  flags = jsTools2.forceArray(flags);
  return flags.filter((f) => types.includes(f));
}
function createSendData(options, sendMethod) {
  switch (sendMethod) {
    case "reply":
      return {
        content: options.content,
        embeds: options.embeds ? jsTools2.forceArray(options.embeds).map((e) => e.toJSON()) : void 0,
        components: options.components ? jsTools2.forceArray(options.components).map((c) => c.toJSON()) : void 0,
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
        embeds: options.embeds ? jsTools2.forceArray(options.embeds).map((e) => e.toJSON()) : void 0,
        components: options.components ? jsTools2.forceArray(options.components).map((c) => c.toJSON()) : void 0,
        ...options.allowedMentions ? { allowedMentions: options.allowedMentions } : {},
        withResponse: options.withResponse,
        flags: excludeFlags(options.flags, "Ephemeral", "SuppressNotifications"),
        files: options.files,
        poll: options.poll
      };
    case "followUp":
      return {
        content: options.content,
        embeds: options.embeds ? jsTools2.forceArray(options.embeds).map((e) => e.toJSON()) : void 0,
        components: options.components ? jsTools2.forceArray(options.components).map((c) => c.toJSON()) : void 0,
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
        embeds: options.embeds ? jsTools2.forceArray(options.embeds).map((e) => e.toJSON()) : void 0,
        components: options.components ? jsTools2.forceArray(options.components).map((c) => c.toJSON()) : void 0,
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
        embeds: options.embeds ? jsTools2.forceArray(options.embeds).map((e) => e.toJSON()) : void 0,
        components: options.components ? jsTools2.forceArray(options.components).map((c) => c.toJSON()) : void 0,
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
        embeds: options.embeds ? jsTools2.forceArray(options.embeds).map((e) => e.toJSON()) : void 0,
        components: options.components ? jsTools2.forceArray(options.components).map((c) => c.toJSON()) : void 0,
        ...options.allowedMentions ? { allowedMentions: options.allowedMentions } : {},
        flags: excludeFlags(options.flags, "Ephemeral", "SuppressNotifications"),
        files: options.files
      };
    case "dmUser":
      return {
        content: options.content,
        embeds: options.embeds ? jsTools2.forceArray(options.embeds).map((e) => e.toJSON()) : void 0,
        components: options.components ? jsTools2.forceArray(options.components).map((c) => c.toJSON()) : void 0,
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
  options.sendMethod ??= handler instanceof BaseInteraction ? "reply" : handler instanceof BaseChannel ? "sendInChannel" : handler instanceof Message ? "messageReply" : handler instanceof GuildMember || handler instanceof User ? "dmUser" : void 0;
  options.deleteAfter = options.deleteAfter ? jsTools2.parseTime(options.deleteAfter) : void 0;
  if (options.sendMethod) {
    if (!(handler instanceof BaseInteraction) && ["reply", "editReply", "followUp"].includes(options.sendMethod))
      throw new TypeError("[DynaSend] Invalid SendMethod", { cause: "'handler' is not 'Interaction' based" });
    if (!(handler instanceof BaseChannel) && ["sendInChannel"].includes(options.sendMethod))
      throw new TypeError("[DynaSend] Invalid SendMethod", { cause: "'handler' is not 'Channel' based" });
    if (!(handler instanceof Message) && ["messageReply", "messageEdit"].includes(options.sendMethod))
      throw new TypeError("[DynaSend] Invalid SendMethod", { cause: "'handler' is not 'Message' based" });
    if (!(handler instanceof GuildMember || handler instanceof User) && ["dmUser"].includes(options.sendMethod))
      throw new TypeError("[DynaSend] Invalid SendMethod", { cause: "'handler' is not 'User' based" });
    if (handler instanceof BaseInteraction && options.sendMethod === "reply" && (handler.replied || handler.deferred))
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
import { choice, forceArray } from "jstools";
var BetterEmbed = class _BetterEmbed {
  embed = new EmbedBuilder();
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
      if (_authorContext instanceof User2) user = _authorContext;
      if (_authorContext instanceof GuildMember2) {
        user = _authorContext.user;
        guildMember = _authorContext;
      }
    } else {
      if (this.data.context.user instanceof User2) user = this.data.context.user;
      if (this.data.context.user instanceof GuildMember2) {
        user = this.data.context.user.user;
        guildMember = this.data.context.user;
      }
    }
    if (user) str = str.replace(/(?<!\\)\$USER\b/g, user.toString()).replace(/(?<!\\)\$USER_NAME\b/g, user.username).replace(/(?<!\\)\$USER_AVATAR\b/g, user.avatarURL() || "USER_HAS_NO_AVATAR");
    if (guildMember) str = str.replace(/(?<!\\)\$DISPLAY_NAME\b/g, guildMember.displayName);
    let _interactionOrMessageContext = this.data.context?.interaction || this.data.context?.message;
    if (_interactionOrMessageContext) str = str.replace(/(?<!\\)\$BOT_AVATAR\b/g, _interactionOrMessageContext.client.user.avatarURL() || "BOT_HAS_NO_AVATAR");
    str = str.replace(/(?<!\\)\$INVIS\b/g, this.data.config.INVIS_CHAR).replace(/(?<!\\|<)@[0-9]+(?!>)/g, (s) => `<@${s.substring(1)}>`).replace(/(?<!\\|<)@&[0-9]+(?!>)/g, (s) => `<@&${s.substring(2)}>`).replace(/(?<!\\|<)#[0-9]+(?!>)/g, (s) => `<#${s.substring(1)}>`).replace(/(?<!\\)\$YEAR/g, date.getFullYear().toString()).replace(/(?<!\\)\$MONTH/g, `0${date.getMonth() + 1}`.slice(-2)).replace(/(?<!\\)\$DAY/g, `0${date.getDate()}`.slice(-2)).replace(/(?<!\\)\$year/g, `${date.getFullYear()}`.substring(2)).replace(/(?<!\\)\$month/g, `0${date.getMonth() + 1}`.slice(-2)).replace(/(?<!\\)\$day/g, `0${date.getDate()}`.slice(-2));
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
    if (!this.data.author.context && _interactionContext && _interactionContext.member instanceof GuildMember2)
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
        if (this.data.author.context instanceof GuildMember2)
          this.data.author.icon = this.data.author.context.user.avatarURL();
        if (this.data.author.context instanceof User2)
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
      choice(
        this.data.config.DEV_MODE ? this.data.config.EMBED_COLOR_DEV : this.data.config.EMBED_COLOR
      )
    );
    this.setTimestamp();
  }
  constructor(data) {
    this.data = { ...this.data, ...data, config: data.config ?? djsConfig };
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
    let _color = Array.isArray(color) ? choice(color) : color;
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
      embeds: [_embed, ...options?.embeds ? forceArray(options?.embeds) : []]
    });
  }
};

// src/CanvasBuilder.ts
var CanvasBuilder_exports = {};
__export(CanvasBuilder_exports, {
  default: () => CanvasBuilder
});
import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import { join } from "node:path";
var imageCache = /* @__PURE__ */ new Map();
var CanvasBuilder = class {
  constructor(width, height, options = {}) {
    this.width = width;
    this.height = height;
    this.options = { ...this.options, ...options };
    this.canvas = createCanvas(this.width, this.height);
    this.ctx = this.canvas.getContext("2d");
    this.ctx.save();
  }
  canvas;
  ctx;
  options = {
    fillColor: "#ffffff",
    textColor: "#000000",
    font: "serif",
    fontSize: 12,
    textAlignment: "left"
  };
  tempCanvas() {
    const tempCanvas = createCanvas(this.width, this.height);
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.save();
    return { canvas: tempCanvas, ctx: tempCtx };
  }
  async loadImage(source) {
    if (source instanceof URL && imageCache.has(source.href)) imageCache.get(source.href);
    else if (typeof source === "string" && imageCache.has(source)) imageCache.get(source);
    const image = await loadImage(source);
    if (source instanceof URL) imageCache.set(source.href, image);
    else if (typeof source === "string") imageCache.set(source, image);
    return image;
  }
  /** Load a font from the specified path and assign it to an alias.
   * Returns whether the font was loaded successfully.
   * @param path Path to the font file.
   * @param alias The alias to assign to the font.
   * @param relative Whether the path is relative to `process.cwd()`. */
  loadFont(path, alias, relative = true) {
    return GlobalFonts.registerFromPath(relative ? join(process.cwd(), path) : path, alias);
  }
  measureText(text) {
    return this.ctx.measureText(text);
  }
  clear(x = 0, y = 0, width = this.width, height = this.height) {
    this.ctx.clearRect(x, y, width, height);
  }
  setBackgroundColor(color = this.options.fillColor) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();
  }
  async setBackgroundImage(source) {
    const image = await this.loadImage(source);
    this.ctx.drawImage(image, 0, 0, this.width, this.height);
    this.ctx.restore();
  }
  fillText(text, options = {}) {
    const _options = {
      x: 0,
      y: 0,
      color: this.options.textColor,
      font: this.options.font,
      size: this.options.fontSize,
      align: this.options.textAlignment,
      ...options
    };
    this.ctx.fillStyle = _options.color;
    this.ctx.font = `${_options.style || ""}${_options.size}px ${_options.font}`.trim();
    this.ctx.textAlign = _options.align;
    if (_options.placeInside) {
      const { x, y, width, height } = _options.placeInside;
      const metrics = this.ctx.measureText(text);
      this.ctx.textAlign = "center";
      this.ctx.fillText(text, x + _options.x + width / 2, y + _options.y + height / 2 + metrics.emHeightAscent / 2);
    } else {
      this.ctx.fillText(text, _options.x, _options.y);
    }
    this.ctx.restore();
  }
  async drawImage(source, options = {}) {
    const image = await this.loadImage(source);
    if (!image) throw new Error(`Image source is not valid.`);
    const _options = {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
      rounded: false,
      ...options
    };
    const px = (typeof _options.padding === "number" ? _options.padding : _options.padding?.x) || 0;
    const py = (typeof _options.padding === "number" ? _options.padding : _options.padding?.y) || 0;
    const _draw = (_ctx, mergeWithMainCanvas) => {
      if (_options.placeInside) {
        const { x, y, width, height } = _options.placeInside;
        _ctx.drawImage(
          image,
          x + _options.x + width / 2 - _options.width / 2 - px,
          y + _options.y + height / 2 - _options.height / 2 - py,
          _options.width,
          _options.height
        );
      } else {
        _ctx.drawImage(image, _options.x + px, _options.y + py, _options.width, _options.height);
      }
      if (mergeWithMainCanvas) {
        this.ctx.drawImage(_ctx.canvas, 0, 0);
      }
      _ctx.restore();
    };
    const _clip = (_ctx) => {
      if (!_options.rounded) return;
      let x = 0, y = 0;
      if (_options.placeInside) {
        const { x: _x, y: _y, width: _width, height: _height } = _options.placeInside;
        x = _options.x + _width / 2 - _options.width / 2 - px;
        y = _options.y + _height / 2 - _options.height / 2 - py;
      } else {
        x = _options.x + px;
        y = _options.y + py;
      }
      if (typeof _options.rounded === "number") {
        _ctx.beginPath();
        _ctx.moveTo(_options.x + _options.rounded, _options.y);
        _ctx.arcTo(x + _options.width, y, x + _options.width, y + _options.height, _options.rounded);
        _ctx.arcTo(x + _options.width, y + _options.height, x, y + _options.height, _options.rounded);
        _ctx.arcTo(x, y + _options.height, x, y, _options.rounded);
        _ctx.arcTo(x, y, x + _options.width, y, _options.rounded);
        _ctx.closePath();
        _ctx.clip();
      } else {
        _ctx.beginPath();
        _ctx.arc(x + _options.width / 2, y + _options.height / 2, _options.width / 2, 0, 2 * Math.PI);
        _ctx.closePath();
        _ctx.clip();
      }
    };
    if (_options.rounded) {
      const { ctx } = this.tempCanvas();
      _clip(ctx);
      _draw(ctx, true);
      ctx.restore();
    } else {
      _clip(this.ctx);
      _draw(this.ctx, false);
      this.ctx.restore();
    }
  }
  toBuffer(mime, cfgOrQuality) {
    switch (mime) {
      case "image/avif":
        return this.canvas.toBuffer("image/avif", cfgOrQuality);
      case "image/jpeg":
        return this.canvas.toBuffer("image/jpeg", cfgOrQuality);
      case "image/webp":
        return this.canvas.toBuffer("image/webp", cfgOrQuality);
      case "image/png":
        return this.canvas.toBuffer("image/png");
    }
  }
};

// src/PageNavigator.ts
var PageNavigator_exports = {};
__export(PageNavigator_exports, {
  PageNavigator: () => PageNavigator
});
import {
  ActionRowBuilder as ActionRowBuilder2,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} from "discord.js";
import { clamp, forceArray as forceArray2, getProp, parseTime } from "jstools";
function isPageData(pageData) {
  return Object.hasOwn(pageData, "embed");
}
function isNestedPageData(pageData) {
  return Object.hasOwn(pageData, "nestedEmbeds");
}
var PageNavigator = class {
  options;
  data;
  events;
  resolveEmbedsToPages(embeds) {
    const _pages = forceArray2(embeds);
    const resolvedPages = [];
    for (let p of _pages) {
      if (isPageData(p) || isNestedPageData(p)) {
        resolvedPages.push(p);
      } else if (Array.isArray(p)) {
        resolvedPages.push({ nestedEmbeds: p });
      } else {
        resolvedPages.push({ embed: p });
      }
    }
    return resolvedPages;
  }
  createButton(data) {
    let button = new ButtonBuilder({ custom_id: data.custom_id, style: ButtonStyle.Secondary });
    if (data.label) button.setLabel(data.label);
    else if (data.emoji) button.setEmoji(data.emoji);
    else throw new Error(
      "[PageNavigator>createButton] You must provide text or an emoji ID for this navigator button in '_dT_this.options.config.json'."
    );
    return button;
  }
  setPage(pageIndex = this.data.page.index.current, nestedPageIndex = this.data.page.index.nested) {
    this.data.page.index.current = clamp(pageIndex, this.options.pages.length - 1);
    this.data.selectMenu.currentlySelected = this.data.components.selectMenu.options[this.data.page.index.current] || null;
    if (this.data.selectMenu.currentlySelected) {
      this.data.components.selectMenu.options.forEach((o) => o.setDefault(false));
      this.data.selectMenu.currentlySelected.setDefault(true);
    }
    let pageData = this.options.pages[this.data.page.index.current];
    if (isNestedPageData(pageData)) {
      this.data.page.index.nested = nestedPageIndex % pageData.nestedEmbeds.length;
      if (this.data.page.index.nested < 0) this.data.page.index.nested = pageData.nestedEmbeds.length - 1;
      this.data.page.currentEmbed = pageData.nestedEmbeds[this.data.page.index.nested];
      this.data.page.currentData = pageData;
      this.data.page.currentMessageContent = pageData.nestedContent ? pageData.nestedContent[this.data.page.index.nested] || void 0 : void 0;
    } else {
      this.data.page.index.nested = 0;
      this.data.page.currentEmbed = pageData.embed;
      this.data.page.currentData = pageData;
      this.data.page.currentMessageContent = pageData.content || void 0;
    }
    const { CAN_JUMP_THRESHOLD, CAN_USE_LONG_THRESHOLD } = this.options.config.pageNavigator;
    this.data.navigation.required = isNestedPageData(pageData) && pageData.nestedEmbeds.length >= 2;
    this.data.navigation.canJump = isNestedPageData(pageData) && pageData.nestedEmbeds.length >= CAN_JUMP_THRESHOLD;
    this.data.navigation.canUseLong = isNestedPageData(pageData) && pageData.nestedEmbeds.length >= CAN_USE_LONG_THRESHOLD;
  }
  callEventStack(event, ...args) {
    if (!this.events[event].length) return;
    for (let i = 0; i < this.events[event].length; i++) {
      this.events[event][i].listener.apply(null, args);
      if (this.events[event][i].once) this.events[event].splice(i, 1);
    }
  }
  configure_navigation() {
    this.data.navigation.reactions = [];
    if (this.data.navigation.required) {
      let navTypes = [];
      switch (this.options.type) {
        case "short":
          navTypes = ["back", "next"];
          break;
        case "shortJump":
          navTypes = this.options.dynamic ? this.data.navigation.canJump ? ["back", "jump", "next"] : ["back", "next"] : ["back", "jump", "next"];
          break;
        case "long":
          navTypes = ["to_first", "back", "next", "to_last"];
          break;
        case "longJump":
          navTypes = this.options.dynamic ? this.data.navigation.canJump ? ["to_first", "back", "jump", "next", "to_last"] : ["to_first", "back", "next", "to_last"] : ["to_first", "back", "jump", "next", "to_last"];
          break;
      }
      if (this.options.useReactions) {
        this.data.navigation.reactions = navTypes.map(
          (type) => getProp(this.options.config.pageNavigator.buttons, `${type}.emoji`)
        );
      } else {
        this.data.components.actionRows.navigation.setComponents(
          ...navTypes.map((type) => getProp(this.data.components.navigation, type))
        );
      }
    } else {
      this.data.components.actionRows.navigation.setComponents([]);
    }
    for (const btn of this.data.extraUserButtons) {
      this.data.components.actionRows.navigation.components.splice(btn.index, 0, btn.component);
    }
  }
  configure_components() {
    this.data.messageActionRows = [];
    if (this.data.selectMenu.optionIds.length) {
      this.data.components.actionRows.selectMenu.setComponents(this.data.components.selectMenu);
      this.data.messageActionRows.push(this.data.components.actionRows.selectMenu);
    }
    if (this.data.navigation.required && !this.options.useReactions || this.data.extraUserButtons.length) {
      this.data.messageActionRows.push(this.data.components.actionRows.navigation);
    }
  }
  configure_all() {
    this.setPage();
    this.configure_navigation();
    this.configure_components();
  }
  async askPageNumber(requestedBy) {
    if (!this.data.message) throw new Error("[PageNavigator>#askPageNumber]: 'this.data.message' is undefined.");
    const _acf = (str, msg) => str.replace("$USER_MENTION", requestedBy.toString()).replace("$MESSAGE_CONTENT", msg?.content || "");
    let messageReply = await this.data.message.reply({ content: _acf(this.options.config.pageNavigator.ASK_PAGE_NUMBER_MESSAGE) }).catch(() => null);
    if (!messageReply) return null;
    const _timeouts = {
      confirm: parseTime(this.options.config.timeouts.CONFIRMATION),
      error: parseTime(this.options.config.timeouts.ERROR_MESSAGE)
    };
    let filter = (msg) => msg.author.id === requestedBy.id && msg.content.match(/^\d+$/) ? true : false;
    return await messageReply.channel.awaitMessages({ filter, max: 1, time: _timeouts.confirm }).then((collected) => {
      let msg = collected.first();
      if (!msg) return null;
      let chosenPageNumber = Number(msg.content) - 1;
      let fuckedUp = false;
      if (chosenPageNumber > 0 && chosenPageNumber <= this.options.pages.length) {
        fuckedUp = true;
        dynaSend(msg, {
          content: _acf(this.options.config.pageNavigator.ASK_PAGE_NUMBER_ERROR, msg),
          deleteAfter: _timeouts.error
        });
      }
      if (msg.deletable) msg.delete().catch(Boolean);
      if (messageReply.deletable) messageReply.delete().catch(Boolean);
      return fuckedUp ? null : chosenPageNumber;
    }).catch(() => {
      if (messageReply.deletable) messageReply.delete().catch(Boolean);
      return null;
    });
  }
  async navComponents_removeFromMessage() {
    if (!this.data.message?.editable) return;
    await this.data.message.edit({ components: [] }).catch(Boolean);
  }
  async navReactions_addToMessage() {
    if (!this.data.message || !this.options.useReactions || !this.data.navigation.reactions.length) return;
    const reactionNames = Object.values(this.options.config.pageNavigator.buttons).map((d) => d.emoji.name);
    let _reactions = this.data.message.reactions.cache.filter((r) => reactionNames.includes(r.emoji.name || ""));
    if (_reactions.size !== this.data.navigation.reactions.length) {
      await this.navReactions_removeFromMessage();
      for (let r of this.data.navigation.reactions) await this.data.message.react(r.id).catch(Boolean);
    }
  }
  async navReactions_removeFromMessage() {
    if (!this.data.message) return;
    await this.data.message.reactions.removeAll().catch(Boolean);
  }
  async collect_components() {
    if (!this.data.message) return;
    if (!this.data.messageActionRows.length) return;
    if (this.data.collectors.component) {
      this.data.collectors.component.resetTimer();
      return;
    }
    const allowedParticipantIds = this.options.allowedParticipants.map((m) => typeof m === "string" ? m : m.id);
    const collector = this.data.message.createMessageComponentCollector({
      filter: (i) => allowedParticipantIds.length ? allowedParticipantIds.includes(i.user.id) : true,
      ...this.options.timeout ? { idle: this.options.timeout } : {}
    });
    this.data.collectors.component = collector;
    return new Promise((resolve) => {
      collector.on("collect", async (i) => {
        if (!i.isStringSelectMenu() && !i.isButton()) return;
        collector.resetTimer();
        this.callEventStack("collect", i, this.data.page.currentData);
        try {
          switch (i.customId) {
            case "ssm_pageSelect":
              await i.deferUpdate().catch(Boolean);
              let _ssmOptionIndex = this.data.selectMenu.optionIds.indexOf(
                i.values[0]
              );
              this.setPage(_ssmOptionIndex);
              this.callEventStack(
                "selectMenuOptionPicked",
                this.data.page.currentData,
                this.data.components.selectMenu.options[_ssmOptionIndex],
                this.data.page.index.current
              );
              this.callEventStack("pageChanged", this.data.page.currentData, this.data.page.index.current);
              return await this.refresh();
            case "btn_to_first":
              await i.deferUpdate().catch(Boolean);
              this.setPage(this.data.page.index.current, 0);
              this.callEventStack("pageChanged", this.data.page.currentData, this.data.page.index.nested);
              return await this.refresh();
            case "btn_back":
              await i.deferUpdate().catch(Boolean);
              this.setPage(this.data.page.index.current, this.data.page.index.nested - 1);
              this.callEventStack("pageBack", this.data.page.currentData, this.data.page.index.nested);
              this.callEventStack("pageChanged", this.data.page.currentData, this.data.page.index.nested);
              return await this.refresh();
            case "btn_jump":
              await i.deferUpdate().catch(Boolean);
              let jumpIndex = await this.askPageNumber(i.user);
              if (jumpIndex === null) return;
              this.setPage(this.data.page.index.current, jumpIndex);
              this.callEventStack("pageJumped", this.data.page.currentData, this.data.page.index.nested);
              this.callEventStack("pageChanged", this.data.page.currentData, this.data.page.index.nested);
              return await this.refresh();
            case "btn_next":
              await i.deferUpdate().catch(Boolean);
              this.setPage(this.data.page.index.current, this.data.page.index.nested + 1);
              this.callEventStack("pageNext", this.data.page.currentData, this.data.page.index.nested);
              this.callEventStack("pageChanged", this.data.page.currentData, this.data.page.index.nested);
              return await this.refresh();
            case "btn_to_last":
              await i.deferUpdate().catch(Boolean);
              this.setPage(this.data.page.index.current, this.options.pages.length - 1);
              this.callEventStack("pageChanged", this.data.page.currentData, this.data.page.index.nested);
              return await this.refresh();
          }
        } catch (err) {
          console.error("[PageNavigator>#collectComponents]", err);
        }
      });
      collector.on("end", async () => {
        this.data.collectors.component = null;
        this.handlePostTimeout();
        resolve();
      });
    });
  }
  async collect_reactions() {
    if (!this.data.message) return;
    if (!this.data.navigation.reactions.length) return;
    if (this.data.collectors.reaction) {
      this.data.collectors.reaction.resetTimer();
      return;
    }
    const allowedParticipantIds = this.options.allowedParticipants.map((m) => typeof m === "string" ? m : m.id);
    const collector = this.data.message.createReactionCollector({
      ...this.options.timeout ? { idle: this.options.timeout } : {}
    });
    this.data.collectors.reaction = collector;
    return new Promise((resolve) => {
      collector.on("collect", async (reaction, user) => {
        if (!this.data.paginationReactionNames.includes(reaction.emoji.name || "")) return;
        if (user.id !== reaction.message.guild?.members?.me?.id) await reaction.users.remove(user.id);
        if (allowedParticipantIds.length && !allowedParticipantIds.includes(user.id)) return;
        collector.resetTimer();
        this.callEventStack("react", reaction, user, this.data.page.currentData);
        try {
          switch (reaction.emoji.name) {
            case this.options.config.pageNavigator.buttons.to_first.emoji.name:
              this.setPage(this.data.page.index.current, 0);
              this.callEventStack("pageChanged", this.data.page.currentData, this.data.page.index.current);
              return await this.refresh();
            case this.options.config.pageNavigator.buttons.back.emoji.name:
              this.setPage(this.data.page.index.current, this.data.page.index.nested - 1);
              this.callEventStack("pageBack", this.data.page.currentData, this.data.page.index.nested);
              this.callEventStack("pageChanged", this.data.page.currentData, this.data.page.index.current);
              return await this.refresh();
            case this.options.config.pageNavigator.buttons.jump.emoji.name:
              let jumpIndex = await this.askPageNumber(user);
              if (jumpIndex === null) return;
              this.setPage(this.data.page.index.current, jumpIndex);
              this.callEventStack("pageJumped", this.data.page.currentData, this.data.page.index.nested);
              this.callEventStack("pageChanged", this.data.page.currentData, this.data.page.index.current);
              return await this.refresh();
            case this.options.config.pageNavigator.buttons.next.emoji.name:
              this.setPage(this.data.page.index.current, this.data.page.index.nested + 1);
              this.callEventStack("pageNext", this.data.page.currentData, this.data.page.index.nested);
              this.callEventStack("pageChanged", this.data.page.currentData, this.data.page.index.current);
              return await this.refresh();
            case this.options.config.pageNavigator.buttons.to_last.emoji.name:
              this.setPage(this.data.page.index.current, this.options.pages.length - 1);
              this.callEventStack("pageChanged", this.data.page.currentData, this.data.page.index.current);
              return await this.refresh();
          }
        } catch (err) {
          console.error("[PageNavigator>#collectReactions]", err);
        }
      });
      collector.on("end", async () => {
        this.data.collectors.reaction = null;
        this.handlePostTimeout();
        resolve();
      });
    });
  }
  async collect_all() {
    return await Promise.all([this.collect_components(), this.collect_reactions()]);
  }
  async handlePostTimeout() {
    if (this.options.postTimeout.deleteMessage) {
      let _postTimeoutOptions = Object.entries(this.options.postTimeout).filter(([k, _]) => k !== "deleteMessage").filter(([_, v]) => v).map(([k, _]) => k);
      if (_postTimeoutOptions.length) {
        console.log(
          `[PageNavigator>#handlePostTimeout]: ${_postTimeoutOptions.map((k) => `'${k}'`).join(", ")} has no effect when 'deleteMessage' is enabled.`
        );
      }
      if (this.data.message?.deletable) this.data.message = await this.data.message.delete().catch(() => null);
    }
    if (this.data.message && this.data.message.editable && !this.options.postTimeout.deleteMessage) {
      if (this.options.postTimeout.disableComponents) {
        this.data.messageActionRows.forEach((ar) => ar.components.forEach((c) => c.setDisabled(true)));
        this.data.message.edit({ components: this.data.messageActionRows }).catch(Boolean);
      }
      if (this.options.postTimeout.clearComponentsOrReactions) {
        if (!this.options.useReactions) {
          this.navComponents_removeFromMessage();
        } else {
          this.navReactions_removeFromMessage();
        }
      }
    }
    this.callEventStack("timeout", this.data.message);
  }
  constructor(options) {
    this.options = {
      ...options,
      allowedParticipants: options.allowedParticipants ?? [],
      pages: this.resolveEmbedsToPages(options.pages),
      type: options.type || "short",
      useReactions: options.useReactions || false,
      dynamic: options.dynamic || false,
      timeout: typeof options.timeout === "string" || typeof options.timeout === "number" ? parseTime(options.timeout) : parseTime((options.config || djsConfig).timeouts.PAGINATION),
      config: options.config || djsConfig,
      postTimeout: {
        disableComponents: true,
        clearComponentsOrReactions: false,
        deleteMessage: false
      }
    };
    this.data = {
      paginationReactionNames: Object.values(this.options.config.pageNavigator.buttons).map((data) => data.emoji.name),
      message: null,
      messageActionRows: [],
      extraUserButtons: [],
      page: {
        currentEmbed: null,
        currentData: null,
        currentMessageContent: void 0,
        index: { current: 0, nested: 0 }
      },
      selectMenu: {
        currentlySelected: null,
        optionIds: []
      },
      navigation: {
        reactions: [],
        required: false,
        canUseLong: false,
        canJump: false
      },
      collectors: {
        component: null,
        reaction: null
      },
      components: {
        actionRows: {
          selectMenu: new ActionRowBuilder2(),
          navigation: new ActionRowBuilder2()
        },
        selectMenu: new StringSelectMenuBuilder().setCustomId("ssm_pageSelect"),
        navigation: {
          to_first: this.createButton({
            custom_id: "btn_to_first",
            ...this.options.config.pageNavigator.buttons.to_first
          }),
          back: this.createButton({ custom_id: "btn_back", ...this.options.config.pageNavigator.buttons.back }),
          jump: this.createButton({ custom_id: "btn_jump", ...this.options.config.pageNavigator.buttons.jump }),
          next: this.createButton({ custom_id: "btn_next", ...this.options.config.pageNavigator.buttons.next }),
          to_last: this.createButton({
            custom_id: "btn_to_last",
            ...this.options.config.pageNavigator.buttons.to_last
          })
        }
      }
    };
    this.events = {
      pageChanged: [],
      pageBack: [],
      pageNext: [],
      pageJumped: [],
      selectMenuOptionPicked: [],
      collect: [],
      react: [],
      timeout: []
    };
    if (!options.pages || Array.isArray(options.pages) && !options.pages.length) {
      throw new Error("[PageNavigator]: You must provide at least 1 page.");
    }
    if (options?.useReactions) {
      for (let [key, val] of Object.entries(this.options.config.pageNavigator.buttons)) {
        if (!val.emoji.id) throw new Error(`[PageNavigator]: \`${key}.id\` is an empty value; This is required to be able to add it as a reaction. Fix this in './this.options.config.json'.`);
        if (!val.emoji.name) throw new Error(`[PageNavigator]: \`${key}.name\` is an empty value; This is required to determine which reaction a user reacted to. Fix this in './this.options.config.json'.`);
      }
    }
    this.configure_all();
  }
  on(event, listener, once = false) {
    this.events[event].push({ listener, once });
    return this;
  }
  /** Add one or more options to the select menu component. */
  addSelectMenuOptions(...options) {
    const ssm_options = [];
    for (let data of options) {
      if (!data.emoji && !data.label)
        throw new Error("[PageNavigator>addSelectMenuOptions]: Option must include either an emoji or a label.");
      data = {
        emoji: data.emoji || "",
        label: data.label || `page ${this.data.selectMenu.optionIds.length + 1}`,
        description: data.description || "",
        value: data.value || `ssm_o_${this.data.selectMenu.optionIds.length + 1}`,
        default: data.default ?? this.data.selectMenu.optionIds.length === 0 ? true : false
      };
      const ssm_option = new StringSelectMenuOptionBuilder({
        label: data.label,
        value: data.value,
        default: data.default
      });
      if (data.emoji) ssm_option.setEmoji(data.emoji);
      if (data.description) ssm_option.setDescription(data.description);
      ssm_options.push(ssm_option);
      this.data.selectMenu.optionIds.push(data.value);
    }
    this.data.components.selectMenu.addOptions(...ssm_options);
    return this;
  }
  /** Remove select menu options at the given index/indices.
   * ```ts
   * // Remove the options at index 0, 2, and 4
   * PageNavigator.removeSelectMenuOptions(0, 2, 4);
   *
   * // Remove the last option
   * PageNavigator.removeSelectMenuOptions(-1);
   * ``` */
  removeSelectMenuOptions(...index) {
    index.forEach((i) => this.data.components.selectMenu.spliceOptions(i, 1));
    return this;
  }
  /** Set the pagination type. */
  setPaginationType(type) {
    this.options.type = type;
    return this;
  }
  /** Allows inserting a button at the given index in the same action row as the navigation buttons. */
  insertButtonAt(index, component) {
    if (this.data.components.actionRows.navigation.components.length === 5) {
      console.log(
        "[PageNavigator>insertButtonAt]: You cannot have more than 5 buttons in the same action row. Add a new ActionRow."
      );
    }
    this.data.extraUserButtons.push({ index, component });
    return this;
  }
  /** Remove buttons at the given index/indices.
   * ```ts
   * // Remove the button at index 0, 2, and 4
   * PageNavigator.removeButtonAt(0, 2, 4);
   *
   * // Remove the last button
   * PageNavigator.removeButtonAt(-1);
   * ``` */
  removeButtonAt(...index) {
    index.forEach((i) => this.data.extraUserButtons[this.data.extraUserButtons.findIndex((b) => b.index === i)]);
    return this;
  }
  /** Send the PageNavigator. */
  async send(handler, options) {
    this.configure_all();
    this.data.message = await dynaSend(handler, {
      ...options,
      content: this.data.page.currentMessageContent,
      embeds: this.data.page.currentEmbed,
      components: this.data.messageActionRows,
      withResponse: true
    });
    if (this.data.message) {
      this.navReactions_addToMessage();
      this.collect_all();
    }
    return this.data.message;
  }
  /** Refresh the current page embed, navigation, and collectors. */
  async refresh() {
    if (!this.data.message) {
      console.log("[PageNavigator>refresh]: Could not refresh navigator; message not sent.");
      return null;
    }
    if (!this.data.message.editable) {
      console.log("[PageNavigator>refresh]: Could not refresh navigator; message not editable.");
      return null;
    }
    this.configure_all();
    this.data.message = await dynaSend(this.data.message, {
      sendMethod: "messageEdit",
      content: this.data.page.currentMessageContent,
      embeds: this.data.page.currentEmbed,
      components: this.data.messageActionRows,
      withResponse: true
    });
    if (this.data.message) {
      this.navReactions_removeFromMessage().then(() => this.navReactions_addToMessage());
    }
    return this.data.message;
  }
};

// src/awaitConfirm.ts
var awaitConfirm_exports = {};
__export(awaitConfirm_exports, {
  default: () => awaitConfirm
});
import { ActionRowBuilder as ActionRowBuilder3, ButtonBuilder as ButtonBuilder2, ButtonStyle as ButtonStyle2, ComponentType } from "discord.js";
import { parseTime as parseTime2 } from "jstools";
async function awaitConfirm(handler, options) {
  const __config = options.config || djsConfig;
  options.timeout = parseTime2(options.timeout || __config.timeouts.CONFIRMATION);
  if (options.timeout && options.timeout < 1e3) {
    console.log("[AwaitConfirm]: 'timeout' is less than 1 second. Is this intentional?");
  }
  const __embed = options.embed === void 0 ? new BetterEmbed({
    title: __config.awaitConfirm.DEFAULT_EMBED_TITLE,
    description: __config.awaitConfirm.DEFAULT_EMBED_DESCRIPTION
  }) : options.embed === null ? void 0 : options.embed;
  const buttons = {
    confirm: new ButtonBuilder2({
      customId: "btn_confirm",
      label: "Confirm",
      style: ButtonStyle2.Success,
      ...options.buttons?.confirm
    }),
    cancel: new ButtonBuilder2({
      customId: "btn_cancel",
      label: "Cancel",
      style: ButtonStyle2.Danger,
      ...options.buttons?.cancel
    })
  };
  const actionRow = new ActionRowBuilder3({ components: [buttons.confirm, buttons.cancel] });
  const message = await dynaSend(handler, {
    sendMethod: options.sendMethod,
    content: options.content,
    embeds: __embed,
    components: actionRow,
    flags: options.flags,
    allowedMentions: options.allowedMentions
  });
  if (!message) return { message: null, confirmed: false };
  const cleanUp = async (resolve, confirmed) => {
    if (confirmed && (options.onResolve?.deleteOnConfirm ?? true)) {
      if (message?.deletable) await message.delete().catch(Boolean);
    }
    if (!confirmed && (options.onResolve?.deleteOnCancel ?? true)) {
      if (message?.deletable) await message.delete().catch(Boolean);
    }
    if ((options.onResolve?.deleteOnConfirm ?? true) || (options.onResolve?.deleteOnCancel ?? true))
      return resolve(confirmed);
    if (options.onResolve?.disableComponents) {
      buttons.cancel.setDisabled(true);
      buttons.confirm.setDisabled(true);
      await message?.edit({ components: [actionRow] }).catch(Boolean);
      return resolve({ message, confirmed });
    }
  };
  const allowedParticipantIds = options.allowedParticipants ? options.allowedParticipants.map((m) => typeof m === "string" ? m : m?.id) : [];
  return new Promise(async (resolve) => {
    const executeAction = async (customId) => {
      switch (customId) {
        case "btn_confirm":
          return await cleanUp(resolve, true);
        case "btn_cancel":
          return await cleanUp(resolve, false);
        default:
          return await cleanUp(resolve, false);
      }
    };
    await message.awaitMessageComponent({
      filter: (i) => allowedParticipantIds.length ? allowedParticipantIds.includes(i.user.id) && ["btn_confirm", "btn_cancel"].includes(i.customId) : true,
      componentType: ComponentType.Button,
      time: options.timeout
    }).then(async (i) => {
      await i.deferUpdate().catch(Boolean);
      executeAction(i.customId);
    }).catch(() => executeAction("btn_cancel"));
  });
}

// src/dTools.ts
var dTools_exports = {};
__export(dTools_exports, {
  __zero: () => __zero,
  cleanMention: () => cleanMention,
  fetchChannel: () => fetchChannel,
  fetchGuild: () => fetchGuild,
  fetchMember: () => fetchMember,
  fetchMessage: () => fetchMessage,
  fetchRole: () => fetchRole,
  fetchUser: () => fetchUser,
  getFirstMentionId: () => getFirstMentionId,
  getMessageMention: () => getMessageMention,
  getMessageMentionArg: () => getMessageMentionArg,
  isMentionOrSnowflake: () => isMentionOrSnowflake
});
function __zero(str) {
  return str?.length ? str : "0";
}
function isMentionOrSnowflake(str) {
  return str ? str.match(/<@[#&]?[\d]{6,}>/) || str.match(/\d{6,}/) ? true : false : false;
}
function cleanMention(str) {
  return str ? str.replaceAll(/[<@#&>]/g, "").trim() : void 0;
}
async function getMessageMention(message, type, index = 0, parse) {
  switch (type) {
    case "user":
      const userMention = message.mentions.users.at(index) || null;
      return parse ? userMention?.id || null : userMention;
    case "member":
      if (!message.guild) return null;
      const member = await fetchMember(message.guild, message.mentions.users.at(index)?.id);
      return parse ? member?.id || null : member;
    case "channel":
      const channelMention = message.mentions.channels.at(index) || null;
      return parse ? channelMention?.id || null : channelMention;
    case "role":
      const roleMention = message.mentions.roles.at(index) || null;
      return parse ? roleMention?.id || null : roleMention;
    default:
      return null;
  }
}
async function getMessageMentionArg(context, content, type, index = 0, parse) {
  const args = content.split(" ");
  const arg = isMentionOrSnowflake(args[index]) ? cleanMention(args[index]) : null;
  if (!arg) return null;
  switch (type) {
    case "user":
      return parse ? arg : await fetchUser(context.client, arg);
    case "member":
      return parse ? arg : context.guild ? await fetchMember(context.guild, arg) : null;
    case "channel":
      return parse ? arg : context.guild ? await fetchChannel(context.guild, arg) : context.client.channels.cache.get(__zero(arg)) ?? context.client.channels.fetch(__zero(arg));
    case "role":
      return parse ? arg : context.guild ? await fetchRole(context.guild, arg) : null;
    default:
      return null;
  }
}
function getFirstMentionId(options) {
  let mentionId = "";
  if (options.message) {
    switch (options.type) {
      case "user":
        mentionId = options.message.mentions.users.first()?.id || "";
      case "channel":
        mentionId = options.message.mentions.channels.first()?.id || "";
      case "role":
        mentionId = options.message.mentions.roles.first()?.id || "";
    }
  }
  const firstArg = options.content?.split(" ")[0] || "";
  return mentionId || isMentionOrSnowflake(firstArg) ? cleanMention(firstArg) : "";
}
async function fetchUser(client, userId) {
  if (!userId) return null;
  return client.users.cache.get(__zero(userId)) || await client.users.fetch(__zero(userId)).catch(() => null);
}
async function fetchGuild(client, guildId) {
  if (!guildId) return null;
  return client.guilds.cache.get(__zero(guildId)) || await client.guilds.fetch(__zero(guildId)).catch(() => null);
}
async function fetchMember(guild, memberId) {
  if (!memberId) return null;
  return guild.members.cache.get(__zero(memberId)) || await guild.members.fetch(__zero(memberId)).catch(() => null);
}
async function fetchChannel(guild, channelId, type) {
  if (!channelId) return null;
  const channel = guild.channels.cache.get(__zero(channelId)) || await guild.channels.fetch(__zero(channelId)).catch(() => null);
  if (type && channel?.type !== type) return null;
  return channel;
}
async function fetchRole(guild, roleId) {
  if (!roleId) return null;
  return guild.roles.cache.get(__zero(roleId)) || await guild.roles.fetch(__zero(roleId)).catch(() => null) || null;
}
async function fetchMessage(channel, messageId) {
  if (!messageId) return null;
  return channel.messages.cache.get(__zero(messageId)) || await channel.messages.fetch(__zero(messageId)).catch(() => null) || null;
}

// src/extractMessage.ts
var extractMessage_exports = {};
__export(extractMessage_exports, {
  extractMessage: () => extractMessage
});
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

// src/types.ts
var types_exports = {};

// src/index.ts
var index_default = {
  ...AnsiBuilder_exports,
  ...BetterEmbed_exports,
  ...CanvasBuilder_exports,
  ...PageNavigator_exports,
  ...awaitConfirm_exports,
  ...config_exports,
  ...dTools_exports,
  ...deleteMessageAfter_exports,
  ...dynaSend_exports,
  ...extractMessage_exports,
  ...types_exports
};
export {
  ANSIBuilder,
  BetterEmbed,
  PageNavigator,
  __zero,
  cleanMention,
  customDJSConfig,
  index_default as default,
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
  getMessageMention,
  getMessageMentionArg,
  isMentionOrSnowflake
};
