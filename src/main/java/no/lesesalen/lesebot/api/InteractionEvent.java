package no.lesesalen.lesebot.api;

import discord4j.common.util.Snowflake;
import discord4j.core.event.domain.interaction.ChatInputInteractionEvent;
import discord4j.core.object.command.ApplicationCommandInteractionOption;
import discord4j.core.object.command.ApplicationCommandInteractionOptionValue;
import discord4j.core.object.command.Interaction;
import discord4j.core.object.entity.Guild;
import discord4j.core.object.entity.Member;
import discord4j.core.object.entity.User;
import discord4j.core.spec.InteractionApplicationCommandCallbackReplyMono;
import discord4j.core.spec.InteractionCallbackSpecDeferReplyMono;
import discord4j.core.spec.InteractionReplyEditMono;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;

public record InteractionEvent(ChatInputInteractionEvent event) {
    public InteractionApplicationCommandCallbackReplyMono reply() {
        return event.reply();
    }

    public InteractionCallbackSpecDeferReplyMono deferReply() {
        return event.deferReply();
    }

    public InteractionReplyEditMono editReply() {
        return event.editReply();
    }

    public Mono<Guild> guild() {
        return event.getInteraction().getGuild();
    }

    public Interaction interaction() {
        return event.getInteraction();
    }

    public Optional<Member> author() {
        return interaction().getMember();
    }

    public Mono<List<Member>> members() {
        return interaction()
                .getGuild()
                .map(Guild::getMembers)
                .flatMap(Flux::collectList);
    }

    public Optional<String> optionAsString(String name) {
        return getOption(name, ApplicationCommandInteractionOptionValue::asString);
    }

    public Optional<Boolean> optionAsBool(String name) {
        return getOption(name, ApplicationCommandInteractionOptionValue::asBoolean);
    }

    public Optional<Mono<User>> optionAsUser(String name) {
        return getOption(name, ApplicationCommandInteractionOptionValue::asUser);
    }

    public Optional<Snowflake> optionUserToSnowflake(String name) {
        return optionAsUser(name).map(u -> u.map(User::getId).block());
    }

    public Optional<Long> optionAsLong(String name) {
        return getOption(name, ApplicationCommandInteractionOptionValue::asLong);
    }

    private <T> Optional<T> getOption(String name, Function<? super ApplicationCommandInteractionOptionValue, ? extends T> mapper) {
        Objects.requireNonNull(mapper);
        return event.getOption(name)
                .flatMap(ApplicationCommandInteractionOption::getValue)
                .map(mapper);
    }
}
