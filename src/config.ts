import { DeepPartial } from "jstools";

export interface DJSConfig {
    INVIS_CHAR: string;
    EMBED_COLOR: string[];
    EMBED_COLOR_DEV: string[];

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
            to_first: { label: string; emoji: { animated?: boolean; name: string; id: string } };
            back: { label: string; emoji: { animated?: boolean; name: string; id: string } };
            jump: { label: string; emoji: { animated?: boolean; name: string; id: string } };
            next: { label: string; emoji: { animated?: boolean; name: string; id: string } };
            to_last: { label: string; emoji: { animated?: boolean; name: string; id: string } };
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

export const djsConfig: DJSConfig = {
    INVIS_CHAR: "\u200b",
    EMBED_COLOR: ["#2B2D31"],
    EMBED_COLOR_DEV: ["#2B2D31"],

    timeouts: {
        PAGINATION: "30s",
        CONFIRMATION: "15s",
        ERROR_MESSAGE: "5s"
    },

    awaitConfirm: {
        DEFAULT_EMBED_TITLE: "⚠️ Are you sure?",
        DEFAULT_EMBED_DESCRIPTION: "Carefully review your action and confirm your decision."
    },

    pageNavigator: {
        CAN_JUMP_THRESHOLD: 5,
        CAN_USE_LONG_THRESHOLD: 4,

        DEFAULT_SELECT_MENU_PLACEHOLDER: "Choose a page to view...",
        ASK_PAGE_NUMBER_MESSAGE: "$USER_MENTION say the page number you would like to view.",
        ASK_PAGE_NUMBER_ERROR: "$USER_MENTION `$MESSAGE_CONTENT` is not a valid page.",

        buttons: {
            to_first: { label: "◀◀", emoji: { animated: false, name: "⏮️", id: "⏮️" } },
            back: { label: "◀", emoji: { animated: false, name: "◀️", id: "◀️" } },
            jump: { label: "📄", emoji: { animated: false, name: "📄", id: "📄" } },
            next: { label: "▶", emoji: { animated: false, name: "▶️", id: "▶️" } },
            to_last: { label: "▶▶", emoji: { animated: false, name: "⏭️", id: "⏭️" } }
        }
    },

    ansi: {
        ESCAPE: "\u001b",

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

export function customDJSConfig(config: DeepPartial<DJSConfig>): DJSConfig {
    return {
        INVIS_CHAR: config.INVIS_CHAR || djsConfig.INVIS_CHAR,
        EMBED_COLOR: (config.EMBED_COLOR as string[]) || djsConfig.EMBED_COLOR,
        EMBED_COLOR_DEV: (config.EMBED_COLOR_DEV as string[]) || djsConfig.EMBED_COLOR_DEV,

        timeouts: { ...config.timeouts, ...djsConfig.timeouts },
        awaitConfirm: { ...config.awaitConfirm, ...djsConfig.awaitConfirm },
        pageNavigator: { ...config.pageNavigator, ...djsConfig.pageNavigator },
        ansi: { ...config.ansi, ...djsConfig.ansi }
    };
}
