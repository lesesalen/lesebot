package no.lesesalen.lesebot.commands.fun;

import feign.RequestLine;
import no.lesesalen.lesebot.api.InteractionEvent;
import no.lesesalen.lesebot.utils.Fetch;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

interface CatFact {
    @RequestLine("GET /")
    Fact getFact();

    record Fact(String fact, int length) {
    }
}

@Component
public class CatFactCommand implements SlashCommand {
    @Override
    public String getName() {
        return "catfact";
    }

    @Override
    public Mono<Void> handle(InteractionEvent event) {
        var fetch = Fetch.target(CatFact.class, "https://catfact.ninja/fact");
        var fact = fetch.getFact();

        return event.reply().withContent(fact.fact());
    }
}
