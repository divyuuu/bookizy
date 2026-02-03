package com.appointment.repository;

import com.appointment.entity.Token;
import com.appointment.entity.Token.Status;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    List<Token> findByClinicIdAndStatusInOrderByTokenNumberAsc(Long clinicId, List<Status> statuses);

    Optional<Token> findByClinicIdAndUserIdAndStatusIn(Long clinicId, Long userId, List<Status> statuses);

    @Query("SELECT MAX(t.tokenNumber) FROM Token t WHERE t.clinic.id = :clinicId AND t.createdAt >= CURRENT_DATE")
    Optional<Integer> findMaxTokenNumberForToday(Long clinicId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query(value = "SELECT * FROM tokens WHERE clinic_id = :clinicId AND DATE(created_at) = CURDATE() ORDER BY token_number DESC LIMIT 1 FOR UPDATE", nativeQuery = true)
    Optional<Token> findMaxTokenForTodayWithLock(@Param("clinicId") Long clinicId);

    long countByClinicIdAndStatusInAndTokenNumberLessThan(Long clinicId, List<Status> statuses, Integer tokenNumber);
}