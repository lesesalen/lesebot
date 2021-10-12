package no.lesesalen.lesebot.commands;

import no.lesesalen.lesebot.api.InteractionEvent;
import no.lesesalen.lesebot.commands.fun.SlashCommand;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class RiggedCommand implements SlashCommand {
    @Override
    public String getName() {
        return "rigged";
    }

    @Override
    public Mono<Void> handle(InteractionEvent event) {
        return event.reply().withContent("En feil har oppstått. Grunnet lav tilgang på økonomiske ressurser trenger vi hjelp til å ordne opp i feilen. Vi tar imot _frivillige donasjoner_ på **2188** på vipps.");
    }
}
