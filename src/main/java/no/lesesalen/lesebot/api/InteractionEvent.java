package no.lesesalen.lesebot.api;

import discord4j.core.event.domain.interaction.ChatInputInteractionEvent;
import discord4j.core.object.command.ApplicationCommandInteractionOption;
import discord4j.core.object.command.ApplicationCommandInteractionOptionValue;
import discord4j.core.object.command.Interaction;
import discord4j.core.object.entity.User;
import discord4j.core.spec.InteractionApplicationCommandCallbackReplyMono;
import reactor.core.publisher.Mono;

import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;

public record InteractionEvent(ChatInputInteractionEvent event) {
    public InteractionApplicationCommandCallbackReplyMono reply() {
        return event.reply();
    }

    public InteractionApplicationCommandCallbackReplyMono reply(final String content) {
        return event.reply(content);
    }

    public Interaction interaction() {
        return event.getInteraction();
    }

    public Optional<String> optionAsString(String name) {
        return getOption(name, ApplicationCommandInteractionOptionValue::asString);
    }

    public Optional<Mono<User>> optionAsUser(String name) {
        return getOption(name, ApplicationCommandInteractionOptionValue::asUser);
    }

    private <T> Optional<T> getOption(String name, Function<? super ApplicationCommandInteractionOptionValue, ? extends T> mapper) {
        Objects.requireNonNull(mapper);
        return event.getOption(name)
                .flatMap(ApplicationCommandInteractionOption::getValue)
                .map(mapper);
    }

}
