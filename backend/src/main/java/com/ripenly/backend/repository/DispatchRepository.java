package com.ripenly.backend.repository;

import com.ripenly.backend.entity.Dispatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DispatchRepository extends JpaRepository<Dispatch, Integer> {
    List<Dispatch> findAllByOrderByIdDesc();
    List<Dispatch> findTop500ByOrderByIdDesc();
}
