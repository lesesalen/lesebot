package no.lesesalen.lesebot.commands;

import feign.RequestLine;
import no.lesesalen.lesebot.api.InteractionEvent;
import no.lesesalen.lesebot.utils.Fetch;
import no.lesesalen.lesebot.utils.Utils;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.Locale;

interface InsultRequest {
    @RequestLine("GET /")
    Insult get();

    record Arguments(String lang, String template) {
    }

    record Insult(boolean errors, Arguments args, String insult) {
    }
}

@Component
public class InsultCommand implements SlashCommand {
    @Override
    public String getName() {
        return "insult";
    }

    @Override
    public Mono<Void> handle(InteractionEvent event) {
        var target = event.optionUserToSnowflake("target");
        var tts = event.optionAsBool("tts").orElse(false);

        var author = event.author().orElseThrow();
        var request = Fetch.target(InsultRequest.class, "https://insult.mattbas.org/api/insult.json");
        var authorId = Utils.snowflakeToMention(author.getId());
        var insult = request.get().insult().toLowerCase(Locale.ROOT);

        if (target.isPresent()) {
            var targetId = Utils.snowflakeToMention(target.get());
            return event.reply().withContent("Hey, %s! %s thinks %s".formatted(targetId, insult, authorId)).withTts(tts);
        } else {
            return event.members().flatMap(members -> event.reply().withContent("Wow, %s, %s".formatted(authorId, insult.toLowerCase())));
        }
    }
}
