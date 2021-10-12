package no.lesesalen.lesebot.utils;

import io.github.cdimascio.dotenv.Dotenv;

import java.util.List;
import java.util.Objects;
import java.util.concurrent.ThreadLocalRandom;

public class Utils {
    public static Dotenv dotenv() {
        return Dotenv.configure().ignoreIfMissing().load();
    }

    public static <T> T randomFromList(List<T> list) {
        Objects.requireNonNull(list);
        return list.get(ThreadLocalRandom.current().nextInt(list.size()));
    }

    public static int randomBetween(int min, int max) {
        return ThreadLocalRandom.current().nextInt(min, max);
    }
}
