package no.lesesalen.lesebot;

import discord4j.common.JacksonResources;
import discord4j.discordjson.json.ApplicationCommandData;
import discord4j.discordjson.json.ApplicationCommandOptionData;
import discord4j.discordjson.json.ApplicationCommandRequest;
import discord4j.discordjson.possible.Possible;
import discord4j.rest.RestClient;
import no.lesesalen.lesebot.utils.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class GuildCommandRegistrar implements ApplicationRunner {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final RestClient client;
    private final long guildId;
    private final Mono<Long> applicationId;

    public GuildCommandRegistrar(RestClient client) {
        this.client = client;
        this.applicationId = client.getApplicationId().cache();
        this.guildId = Long.parseLong(Utils.dotenv().get("DISCORD_GUILD_ID"));
    }

    @Override
    public void run(ApplicationArguments args) throws IOException {
        final var d4jMapper = JacksonResources.create();
        PathMatchingResourcePatternResolver matcher = new PathMatchingResourcePatternResolver();
        List<ApplicationCommandRequest> commandRequests = new ArrayList<>();
        for (Resource resource : matcher.getResources("commands/*.json")) {
            ApplicationCommandRequest request = d4jMapper.getObjectMapper()
                    .readValue(resource.getInputStream(), ApplicationCommandRequest.class);

            commandRequests.add(request);
        }

        this.registerCommands(commandRequests).block();
    }

    public Mono<Void> registerCommands(List<ApplicationCommandRequest> commandRequests) {
        return getExistingCommands()
                .flatMap(existing -> {
                    List<Mono<?>> actions = new ArrayList<>();
                    Map<String, ApplicationCommandRequest> commands = new HashMap<>();
                    for (ApplicationCommandRequest request : commandRequests) {
                        commands.put(request.name(), request);

                        if (!existing.containsKey(request.name())) {
                            actions.add(createCommand(request));
                        }
                    }

                    // check if any commands have been deleted or changed
                    for (ApplicationCommandData existingCommand : existing.values()) {
                        long existingCommandId = Long.parseLong(existingCommand.id());
                        if (commands.containsKey(existingCommand.name())) {
                            ApplicationCommandRequest command = commands.get(existingCommand.name());
                            if (isChanged(existingCommand, command)) {
                                actions.add(modifyCommand(existingCommandId, command));
                            }
                        } else {
                            // removed source command, delete remote command
                            actions.add(deleteCommand(existingCommandId, existingCommand));
                        }
                    }

                    return Mono.when(actions);
                });
    }

    private Mono<ApplicationCommandData> createCommand(ApplicationCommandRequest request) {
        return applicationId.flatMap(id -> client.getApplicationService()
                .createGuildApplicationCommand(id, guildId, request)
                .doOnNext(it -> logger.info("Created guild command {}", request.name())));
    }

    private Mono<ApplicationCommandData> modifyCommand(long commandId, ApplicationCommandRequest request) {
        return applicationId.flatMap(id -> client.getApplicationService()
                .modifyGuildApplicationCommand(id, guildId, commandId, request)
                .doOnNext(it -> logger.info("Updated guild command {}", request.name())));
    }

    private Mono<Void> deleteCommand(long commandId, ApplicationCommandData request) {
        return applicationId.flatMap(id -> client.getApplicationService()
                .deleteGuildApplicationCommand(id, guildId, commandId)
                .doOnTerminate(() -> logger.info("Deleted guild command {}", request.name())));
    }

    private boolean isChanged(ApplicationCommandData existingCommand, ApplicationCommandRequest command) {
        return command.description().toOptional().map(value -> !existingCommand.description().equals(value)).orElse(false)
                || existingCommand.defaultPermission().toOptional().orElse(true) != command.defaultPermission().toOptional().orElse(true)
                || !existingCommand.options().equals(buildOptions(command.options()));
    }

    private Possible<List<ApplicationCommandOptionData>> buildOptions(Possible<List<ApplicationCommandOptionData>> options) {
        if (options.isAbsent()) {
            return options;
        }
        List<ApplicationCommandOptionData> newOptions = new ArrayList<>();
        for (ApplicationCommandOptionData optionData : options.get()) {
            // turn required == false into absent, to fix equality checks
            newOptions.add(ApplicationCommandOptionData.builder()
                    .from(optionData)
                    .required(optionData.required().toOptional()
                            .filter(it -> it)
                            .map(Possible::of)
                            .orElse(Possible.absent()))
                    .options(buildOptions(optionData.options()))
                    .build());
        }
        return Possible.of(newOptions);
    }

    private Mono<Map<String, ApplicationCommandData>> getExistingCommands() {
        return applicationId.flatMap(id -> client.getApplicationService()
                .getGuildApplicationCommands(id, guildId)
                .collectMap(ApplicationCommandData::name));
    }
}
