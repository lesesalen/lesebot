package no.lesesalen.lesebot.commands;

import no.lesesalen.lesebot.api.InteractionEvent;
import reactor.core.publisher.Mono;

/**
 * A simple interface defining our slash command class contract.
 * a getName() method to provide the case-sensitive name of the command.
 * and a handle() method which will house all the logic for processing each command.
 */
public interface SlashCommand {

    String getName();

    Mono<Void> handle(InteractionEvent event);
}
