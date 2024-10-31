package com.example.demo.models;

import com.example.demo.models.enums.Providers;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HistoryPurchased {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Providers provider;
    private LocalDate purchaseDate;
    @ElementCollection
    private List<String> itemsPurchased;

}