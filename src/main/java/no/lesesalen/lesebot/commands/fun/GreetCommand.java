package no.lesesalen.lesebot.commands.fun;

import no.lesesalen.lesebot.api.InteractionEvent;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class GreetCommand implements SlashCommand {
    @Override
    public String getName() {
        return "greet";
    }

    @Override
    public Mono<Void> handle(InteractionEvent event) {
        var name = event.optionAsString("name").orElseThrow();

        return event.reply()
                .withEphemeral(true)
                .withContent("Hello, " + name);
    }
}
