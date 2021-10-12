package no.lesesalen.lesebot.commands;

import discord4j.core.spec.EmbedCreateSpec;
import no.lesesalen.lesebot.api.InteractionEvent;
import no.lesesalen.lesebot.commands.fun.SlashCommand;
import no.lesesalen.lesebot.utils.Constants;
import no.lesesalen.lesebot.utils.Utils;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.time.Instant;

@Component
public class RandomCommand implements SlashCommand {
    @Override
    public String getName() {
        return "random";
    }

    @Override
    public Mono<Void> handle(InteractionEvent event) {
        var min = event.optionAsLong("min").orElseThrow().intValue();
        var max = event.optionAsLong("max").orElseThrow().intValue();

        if (min >= max) {
            return event.reply().withContent("That's illegal, yo");
        }

        var number = Utils.randomBetween(min, max);
        var embed = EmbedCreateSpec.builder()
                .color(Constants.EMBED_BLUE)
                .title("Random number")
                .description(Integer.toString(number))
                .timestamp(Instant.now())
                .footer("Guaranteed to be random", "")
                .thumbnail(Constants.BLOBROSS)
                .build();

        return event.reply().withEmbeds(embed);
    }
}
