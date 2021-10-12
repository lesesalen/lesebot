package no.lesesalen.lesebot.commands;

import feign.RequestLine;
import no.lesesalen.lesebot.api.InteractionEvent;
import no.lesesalen.lesebot.utils.Fetch;
import no.lesesalen.lesebot.utils.Utils;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

interface ComplimentRequest {
    @RequestLine("GET /")
    Compliment get();

    record Compliment(String compliment) {
    }
}

@Component
public class ComplimentCommand implements SlashCommand {
    @Override
    public String getName() {
        return "compliment";
    }

    @Override
    public Mono<Void> handle(InteractionEvent event) {
        var target = event.optionUserToSnowflake("target");
        var author = event.author().orElseThrow();
        var request = Fetch.target(ComplimentRequest.class, "https://complimentr.com/api");
        var authorId = Utils.snowflakeToMention(author.getId());
        var compliment = request.get().compliment();
        var finalCompliment = compliment.substring(0, 1).toUpperCase() + compliment.substring(1);

        if (target.isPresent()) {
            var targetId = Utils.snowflakeToMention(target.get());

            if (target.get().equals(author.getId())) {
                return event.reply().withContent("Wow, you're really fishing for compliments...");
            }

            return event.reply().withContent("Hey, %s! %s. (from %s)".formatted(targetId, finalCompliment, authorId));
        } else {
            return event.members().flatMap(members -> event.reply().withContent("Wow, %s, %s".formatted(authorId, finalCompliment.toLowerCase())));
        }
    }
}
