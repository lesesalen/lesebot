package no.lesesalen.lesebot.commands.fun;

import no.lesesalen.lesebot.api.InteractionEvent;
import no.lesesalen.lesebot.utils.Utils;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class SlapCommand implements SlashCommand {
    @Override
    public String getName() {
        return "slap";
    }

    @Override
    public Mono<Void> handle(InteractionEvent event) {
        var target = event.optionUserToSnowflake("target");
        var author = event.author().orElseThrow();

        if (target.isPresent()) {
            return event.reply().withContent("<@%d> slaps <@%s>! Ouch...".formatted(author.getId().asLong(), target.get().asLong()));
        } else {
            return event.members().flatMap(members -> {
                var member = Utils.randomFromList(members);
                return event.reply().withContent("<@%d> slaps <@%s>! Ouch...".formatted(author.getId().asLong(), member.getId().asLong()));
            });
        }
    }
}
