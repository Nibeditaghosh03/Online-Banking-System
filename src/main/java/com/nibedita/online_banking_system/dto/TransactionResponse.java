package com.nibedita.online_banking_system.dto;

import com.nibedita.online_banking_system.entity.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class TransactionResponse {

    private Long id;

    private TransactionType transactionType;

    private Double amount;

    private String senderAccountNumber;

    private String receiverAccountNumber;

    private LocalDateTime timestamp;
}