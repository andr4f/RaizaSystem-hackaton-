package com.raiza.demo.municipality.repository;

import com.raiza.demo.municipality.entity.Municipality;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MunicipalityRepository extends JpaRepository<Municipality, Long> {

    List<Municipality> findByDepartmentIgnoreCaseOrderByNameAsc(String department);

    List<Municipality> findByDepartmentIgnoreCaseAndNameContainingIgnoreCaseOrderByNameAsc(
            String department, String search);

    List<Municipality> findByNameContainingIgnoreCaseOrderByNameAsc(String search);
}