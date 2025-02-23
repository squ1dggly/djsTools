import { Message } from "discord.js";
import jsTools from "jstools";

import { djsConfig } from "./config";

/** Delete a message after a specified amount of time.
 * @param message The message to delete, or a promise resolving to a message.
 * @param delay The time to wait before deleting the message. Defaults to `timeouts.ERROR_MESSAGE`.

 * This option also utilizes {@link jsTools.parseTime}, letting you use "10s" or "1m 30s" instead of a number. */
export async function deleteMessageAfter(
    message: Message | Promise<Message>,
    delay: string | number = djsConfig.timeouts.ERROR_MESSAGE
): Promise<Message | null> {
    delay = jsTools.parseTime(delay);

    // Ensure the message is resolved
    message = await Promise.resolve(message);

    // Await the given time
    await jsTools.sleep(delay);

    // Check if the message is deletable
    if (!message.deletable) return null;
    return await message.delete().catch(null);
}
