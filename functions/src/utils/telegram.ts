import {Telegraf} from "telegraf";

export const bot = new Telegraf(process.env.BOT_TOKEN!);
export const CHAT_ID = process.env.GIRLFRIEND_CHAT_ID!;
