package com.example.nlp.client;

import com.example.nlp.dto.request.ChatCompletionRequest;
import com.example.nlp.dto.response.ChatCompletionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

@Component
@ConditionalOnMissingBean(name = "mockGemma4Client")
public class OpenAICompatibleGemma4Client implements Gemma4Client {

    private final WebClient webClient;
    private final int timeoutMs;

    public OpenAICompatibleGemma4Client(
            @Value("${model.server.url}") String baseUrl,
            @Value("${model.server.api-key}") String apiKey,
            @Value("${model.server.timeout-ms}") int timeoutMs
    ) {
        this.timeoutMs = timeoutMs;
        var builder = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Content-Type", "application/json");

        if (!apiKey.isBlank()) {
            builder.defaultHeader("Authorization", "Bearer " + apiKey);
        }

        this.webClient = builder.build();
    }

    @Override
    public ChatCompletionResponse chatCompletion(ChatCompletionRequest request) {
        var response = webClient.post()
                .uri("/v1/chat/completions")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(ChatCompletionResponse.class)
                .timeout(Duration.ofMillis(timeoutMs))
                .block();

        if (response == null || response.choices() == null || response.choices().isEmpty()) {
            throw new IllegalStateException("Model server returned no completion choices");
        }
        return response;
    }
}
