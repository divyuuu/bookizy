package com.appointment.dto;


import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TokenBookingRequest {
    private String patientName;
    private Integer patientAge;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
}

