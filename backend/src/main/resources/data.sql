-- Seed sample clinics (idempotent inserts)

INSERT INTO clinics (name, doctor_name, specialization, timing, address, avg_time_per_patient)
SELECT 'City Clinic', 'Dr. A. Smith', 'General', '09:00-17:00', '123 Main St', 15
WHERE NOT EXISTS (SELECT 1 FROM clinics WHERE name='City Clinic' AND doctor_name='Dr. A. Smith');

INSERT INTO clinics (name, doctor_name, specialization, timing, address, avg_time_per_patient)
SELECT 'Downtown Care', 'Dr. B. Lee', 'Pediatrics', '10:00-16:00', '456 Elm St', 10
WHERE NOT EXISTS (SELECT 1 FROM clinics WHERE name='Downtown Care' AND doctor_name='Dr. B. Lee');

INSERT INTO clinics (name, doctor_name, specialization, timing, address, avg_time_per_patient)
SELECT 'Skin Health', 'Dr. C. Jones', 'Dermatology', '09:00-15:00', '789 Oak St', 20
WHERE NOT EXISTS (SELECT 1 FROM clinics WHERE name='Skin Health' AND doctor_name='Dr. C. Jones');
