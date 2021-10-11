package no.lesesalen.lesebot.commands;

import discord4j.core.event.domain.interaction.ChatInputInteractionEvent;
import discord4j.core.object.command.ApplicationCommandInteractionOption;
import discord4j.core.object.command.ApplicationCommandInteractionOptionValue;
import discord4j.core.object.entity.Guild;
import discord4j.core.object.entity.User;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Objects;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class SlapCommand implements SlashCommand {
    @Override
    public String getName() {
        return "slap";
    }

    // TODO: what the actual fuck
    @Override
    public Mono<Void> handle(ChatInputInteractionEvent event) {
        var target = event.getOption("target")
                .flatMap(ApplicationCommandInteractionOption::getValue)
                .map(ApplicationCommandInteractionOptionValue::asUser)
                .map(u -> u.map(User::getId).block());

        var author = event.getInteraction().getMember().orElseThrow();

        if (target.isPresent()) {
            return event.reply("<@%d> slaps <@%s>! Ouch...".formatted(author.getId().asLong(), target.get().asLong()));
        } else {
            var members = event.getInteraction().getGuild().map(Guild::getMembers).map(Flux::collectList).block().block();
            var member = Objects.requireNonNull(members).get(ThreadLocalRandom.current().nextInt(members.size()));
            return event.reply("<@%d> slaps <@%s>! Ouch...".formatted(author.getId().asLong(), member.getId().asLong()));
        }
    }
}
