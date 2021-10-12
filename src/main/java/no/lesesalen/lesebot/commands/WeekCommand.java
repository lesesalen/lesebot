package no.lesesalen.lesebot.commands;

import discord4j.core.spec.EmbedCreateSpec;
import discord4j.rest.util.Color;
import no.lesesalen.lesebot.api.InteractionEvent;
import no.lesesalen.lesebot.utils.Constants;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.WeekFields;

@Component
public class WeekCommand implements SlashCommand {
    @Override
    public String getName() {
        return "week";
    }

    @Override
    public Mono<Void> handle(InteractionEvent event) {
        var week = LocalDate.now().get(WeekFields.ISO.weekOfYear());
        var embed = EmbedCreateSpec.builder()
                .color(Color.of(0x0099FF))
                .title("Week number")
                .description(Integer.toString(week))
                .thumbnail(Constants.BLOBROSS)
                .timestamp(Instant.now())
                .footer("Don't you have a calendar?", "")
                .build();

        return event.reply().withEmbeds(embed);
    }
}
