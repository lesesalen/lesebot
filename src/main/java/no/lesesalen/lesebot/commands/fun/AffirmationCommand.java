package no.lesesalen.lesebot.commands.fun;

import feign.RequestLine;
import no.lesesalen.lesebot.api.InteractionEvent;
import no.lesesalen.lesebot.utils.Fetch;
import no.lesesalen.lesebot.utils.Utils;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

interface AffirmationRequest {
    @RequestLine("GET /")
    Affirmation get();

    record Affirmation(String affirmation) {
    }
}

@Component
public class AffirmationCommand implements SlashCommand {
    @Override
    public String getName() {
        return "affirmation";
    }

    @Override
    public Mono<Void> handle(InteractionEvent event) {
        var target = event.optionUserToSnowflake("target");
        var author = event.author().orElseThrow();
        var request = Fetch.target(AffirmationRequest.class, "https://www.affirmations.dev");
        var affirmation = request.get().affirmation();

        if (target.isPresent()) {
            var targetId = Utils.snowflakeToMention(target.get());
            var authorId = Utils.snowflakeToMention(author.getId());

            if (target.get().equals(author.getId())) {
                return event.reply().withContent("Need a little lift, %s? %s.".formatted(authorId, affirmation));
            }

            return event.reply().withContent("%s: %s. (from %s)".formatted(targetId, affirmation, authorId));
        } else {
            return event.members().flatMap(members -> event.reply().withContent("%s.".formatted(affirmation)));
        }
    }
}
