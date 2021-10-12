package no.lesesalen.lesebot.commands;

import feign.Headers;
import feign.RequestLine;
import no.lesesalen.lesebot.api.InteractionEvent;
import no.lesesalen.lesebot.utils.Fetch;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

interface DadJoke {
    @RequestLine("GET /")
    @Headers("Accept: application/json")
    Joke getJoke();

    record Joke(String id, String joke, int status) {
    }
}

@Component
public class DadJokeCommand implements SlashCommand {
    @Override
    public String getName() {
        return "dadjoke";
    }

    @Override
    public Mono<Void> handle(InteractionEvent event) {
        var fetch = Fetch.target(DadJoke.class, "https://icanhazdadjoke.com");
        var joke = fetch.getJoke();

        return event.reply().withContent(joke.joke());
    }
}
