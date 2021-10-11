package no.lesesalen.lesebot.utils;

import io.github.cdimascio.dotenv.Dotenv;

public class Utils {
    public static Dotenv dotenv() {
        return Dotenv.configure().ignoreIfMissing().load();
    }
}
