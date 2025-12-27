package com.appointment.config;

import com.appointment.entity.Clinic;
import com.appointment.repository.ClinicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ClinicRepository clinicRepository;

    @Override
    public void run(String... args) throws Exception {
        // Add a few sample clinics if they don't already exist
        createIfNotExists("City Clinic", "Dr. A. Smith", "General", "09:00-17:00", "123 Main St", 15);
        createIfNotExists("Downtown Care", "Dr. B. Lee", "Pediatrics", "10:00-16:00", "456 Elm St", 10);
        createIfNotExists("Skin Health", "Dr. C. Jones", "Dermatology", "09:00-15:00", "789 Oak St", 20);
        createIfNotExists("Uptown Dental", "Dr. D. Patel", "Dentistry", "08:00-14:00", "321 Pine St", 20);
    }

    private void createIfNotExists(String name, String doctorName, String specialization, String timing, String address, Integer avgTimePerPatient) {
        if (!clinicRepository.existsByNameAndDoctorName(name, doctorName)) {
            Clinic clinic = new Clinic();
            clinic.setName(name);
            clinic.setDoctorName(doctorName);
            clinic.setSpecialization(specialization);
            clinic.setTiming(timing);
            clinic.setAddress(address);
            clinic.setAvgTimePerPatient(avgTimePerPatient);
            clinicRepository.save(clinic);
        }
    }
}
