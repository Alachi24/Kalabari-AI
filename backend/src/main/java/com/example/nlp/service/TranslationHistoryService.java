package com.example.nlp.service;

import com.example.nlp.entity.TranslationHistory;
import com.example.nlp.repository.TranslationHistoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class TranslationHistoryService {

    private final TranslationHistoryRepository repository;

    public TranslationHistoryService(TranslationHistoryRepository repository) {
        this.repository = repository;
    }

    public Page<TranslationHistory> getHistory(UUID userId, int page, int size) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(page, size));
    }

    public TranslationHistory save(TranslationHistory entry) {
        return repository.save(entry);
    }

    public void delete(UUID id, UUID userId) {
        repository.deleteByIdAndUserId(id, userId);
    }

    public long countToday(UUID userId) {
        return repository.countByUserIdAndCreatedAtAfter(userId, Instant.now().minusSeconds(86400));
    }

    public long countTotal(UUID userId) {
        return repository.countByUserId(userId);
    }
}
