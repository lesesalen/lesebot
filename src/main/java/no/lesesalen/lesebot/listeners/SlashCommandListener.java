package no.lesesalen.lesebot.listeners;

import discord4j.core.event.domain.interaction.ChatInputInteractionEvent;
import no.lesesalen.lesebot.api.InteractionEvent;
import no.lesesalen.lesebot.commands.SlashCommand;
import org.springframework.context.ApplicationContext;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Collection;

public class SlashCommandListener {
    private final Collection<SlashCommand> commands;

    public SlashCommandListener(ApplicationContext applicationContext) {
        //Get all classes that implement our SlashCommand interface and annotated with @Component
        commands = applicationContext.getBeansOfType(SlashCommand.class).values();
    }

    public Mono<Void> handle(ChatInputInteractionEvent event) {
        //Convert our list to a flux that we can iterate through
        var interaction = new InteractionEvent(event);
        return Flux.fromIterable(commands)
                //Filter out all commands that don't match the name this event is for
                .filter(command -> command.getName().equals(event.getCommandName()))
                //Get the first (and only) item in the flux that matches our filter
                .next()
                //Have our command class handle all logic related to its specific command.
                .flatMap(command -> command.handle(interaction));
    }
}

