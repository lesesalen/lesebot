package no.lesesalen.lesebot;

import discord4j.core.DiscordClient;
import discord4j.core.DiscordClientBuilder;
import discord4j.core.event.domain.interaction.ChatInputInteractionEvent;
import discord4j.gateway.intent.IntentSet;
import discord4j.rest.RestClient;
import no.lesesalen.lesebot.listeners.SlashCommandListener;
import no.lesesalen.lesebot.utils.Utils;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.Bean;
import reactor.core.publisher.Mono;

@SpringBootApplication
public class LeseBot {
    public static void main(String[] args) {
        var dotenv = Utils.dotenv();
        var springContext = new SpringApplicationBuilder(LeseBot.class)
                .build()
                .run(args);

        DiscordClient.create(dotenv.get("DISCORD_TOKEN"))
                .gateway()
                .setEnabledIntents(IntentSet.all())
                .withGateway(client -> {
                    var slashCommandListener = new SlashCommandListener(springContext);
                    var onSlashCommand = client
                            .on(ChatInputInteractionEvent.class, slashCommandListener::handle)
                            .then();

                    return Mono.when(onSlashCommand);
                }).block();
    }

    @Bean
    public RestClient discordRestClient() {
        var dotenv = Utils.dotenv();
        return RestClient.create(dotenv.get("DISCORD_TOKEN"));
    }
}