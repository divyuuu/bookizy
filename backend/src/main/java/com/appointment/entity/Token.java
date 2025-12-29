package com.appointment.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "tokens")
@Data
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer tokenNumber;
    private String patientName;
    private Integer patientAge;
    @JoinColumn(name = "date_booked")
    private LocalDate appointmentDate;
    @JoinColumn(name = "time_booked")
    private LocalTime appointmentTime;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "clinic_id")
    private Clinic clinic;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime createdAt;

    public enum Status {
        WAITING, ARRIVED, SERVING, COMPLETED, SKIPPED, CANCELLED
    }
}