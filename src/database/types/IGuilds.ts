export default interface IGuilds {
   birthday_channel_id: BigInt | null;
   birthday_notifications_enabled: boolean;
   discord_guild_id: BigInt;
   guild_name: string;
   id: number;
   joined_at: Date;
}
