package com.appointment.repository;

import com.appointment.entity.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClinicRepository extends JpaRepository<Clinic, Long> {
    boolean existsByNameAndDoctorName(String name, String doctorName);
}