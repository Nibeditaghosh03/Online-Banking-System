package com.nibedita.online_banking_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class BalanceResponse {
     private String accountNumber;
     private Double balance;

}
