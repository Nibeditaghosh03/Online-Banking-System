package com.nibedita.online_banking_system.repository;

import com.nibedita.online_banking_system.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findBySenderAccountNumberOrReceiverAccountNumberOrderByTimestampDesc(
            String senderAccountNumber,
            String receiverAccountNumber
    );
}