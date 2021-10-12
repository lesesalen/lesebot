package no.lesesalen.lesebot.utils;

import feign.Feign;
import feign.http2client.Http2Client;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import feign.slf4j.Slf4jLogger;

public class Fetch {
    private static Feign.Builder instance = null;

    private Fetch() {
    }

    public static <T> T target(Class<T> klass, String url) {
        if (instance == null) {
            instance = Feign.builder()
                    .client(new Http2Client())
                    .encoder(new JacksonEncoder())
                    .decoder(new JacksonDecoder())
                    .logger(new Slf4jLogger());
        }

        return instance.target(klass, url);
    }
}
