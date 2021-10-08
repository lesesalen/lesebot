package no.lesesalen.lesebot;

import discord4j.core.DiscordClientBuilder;
import discord4j.core.event.domain.interaction.ChatInputInteractionEvent;
import discord4j.rest.RestClient;
import io.github.cdimascio.dotenv.Dotenv;
import no.lesesalen.lesebot.listeners.SlashCommandListener;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.Bean;
import reactor.core.publisher.Mono;

@SpringBootApplication
public class LeseBot {
    public static void main(String[] args) {
        var dotenv = Dotenv.configure().load();
        var springContext = new SpringApplicationBuilder(LeseBot.class)
                .build()
                .run(args);

        DiscordClientBuilder.create(dotenv.get("DISCORD_TOKEN"))
                .build()
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
        var dotenv = Dotenv.configure().load();
        return RestClient.create(dotenv.get("DISCORD_TOKEN"));
    }
}