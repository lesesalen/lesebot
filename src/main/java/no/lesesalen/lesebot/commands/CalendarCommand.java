package no.lesesalen.lesebot.commands;

import discord4j.core.object.VoiceState;
import discord4j.core.object.entity.Member;
import no.lesesalen.lesebot.api.InteractionEvent;
import no.lesesalen.lesebot.commands.fun.SlashCommand;
import no.lesesalen.lesebot.utils.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class CalendarCommand implements SlashCommand {
    private static final Logger log = LoggerFactory.getLogger(CalendarCommand.class);

    @Override
    public String getName() {
        return "calendar";
    }

    @Override
    public Mono<Void> handle(InteractionEvent event) {
        return event.deferReply()
                .then(Mono.justOrEmpty(event.author()))
                .flatMap(Member::getVoiceState)
                .flatMap(VoiceState::getChannel)
                .flatMap(channel -> channel.getVoiceStates()
                        .map(VoiceState::getMember)
                        .filter(m -> m.block().getDisplayName().equals("testbot"))
                        .collectList()
                        .flatMap(m -> m.size() == 1 ? Mono.empty() : Utils.randomFromList(m))
                        .flatMap(u -> {
                            if (u == null) {
                                return channel
                                        .sendDisconnectVoiceState()
                                        .then(event.editReply().withContentOrNull("Trying to win on your own, eh? You lost."));
                            }

                            log.info("USER: {}", u.getDisplayName());

                            return channel
                                    .join()
                                    .then(event.editReply().withContentOrNull("Hello"));
                        }))
                .doFinally(s -> log.info("Finalized join request after {}", s))
                .onErrorResume(t -> event.editReply().withContentOrNull("You need to be in a voice channel to use this command..."))
                .then();
    }
}
