package com.nibedita.online_banking_system.repository;

import com.nibedita.online_banking_system.entity.BankAccount;
import com.nibedita.online_banking_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {

    Optional<BankAccount> findByAccountNumber(String accountNumber);

    List<BankAccount> findByUser(User user);

    boolean existsByAccountNumber(String accountNumber);
}