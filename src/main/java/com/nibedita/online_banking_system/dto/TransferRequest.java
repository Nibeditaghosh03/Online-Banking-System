package com.nibedita.online_banking_system.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransferRequest {
    
    @NotBlank(message = "Receiver account number is required")
    private String receiverAccountNumber;

    @Positive(message = "Transfer amount must be greater than zero")
    private Double amount;
}