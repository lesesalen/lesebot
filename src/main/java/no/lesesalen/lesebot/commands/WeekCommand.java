package no.lesesalen.lesebot.commands;

import discord4j.core.event.domain.interaction.ChatInputInteractionEvent;
import discord4j.core.spec.EmbedCreateSpec;
import discord4j.rest.util.Color;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Date;

public class WeekCommand implements SlashCommand {
    @Override
    public String getName() {
        return "week";
    }

    @Override
    public Mono<Void> handle(ChatInputInteractionEvent event) {
        var embed = EmbedCreateSpec.builder()
                .color(Color.of(0x0099FF))
                .image("attachment://assets/blobross.png")
                .title("Week number")
                .description(new Date().toString())
                .thumbnail("")
                .timestamp(Instant.now())
                .footer("Don't you have a calendar?", "")
                .build();

        return event.reply()
                .withEphemeral(true)
                .withEmbeds(embed);
    }
}
