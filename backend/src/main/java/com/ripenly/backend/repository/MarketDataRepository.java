package com.ripenly.backend.repository;

import com.ripenly.backend.entity.MarketData;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MarketDataRepository extends JpaRepository<MarketData, Integer> {
    List<MarketData> findAllByOrderByIdDesc();
}
