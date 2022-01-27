export interface Config {
  discord: {
    token: string;
    appId: string;
    guildId: string;
    prefix: string;
  };
}

export const getEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Could not find environment variable ${name}`);

  return value;
};

export const getConfig = (): Config => {
  return {
    discord: {
      token: getEnvVar("DISCORD_TOKEN"),
      appId: getEnvVar("DISCORD_APP_ID"),
      guildId: getEnvVar("DISCORD_GUILD_ID"),
      prefix: getEnvVar("DISCORD_PREFIX"),
    },
  };
};
