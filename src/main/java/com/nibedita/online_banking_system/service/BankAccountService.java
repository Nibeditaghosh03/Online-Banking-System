package com.nibedita.online_banking_system.service;

import com.nibedita.online_banking_system.dto.OpenAccountRequest;
import com.nibedita.online_banking_system.entity.BankAccount;
import com.nibedita.online_banking_system.entity.User;
import com.nibedita.online_banking_system.repository.BankAccountRepository;
import com.nibedita.online_banking_system.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class BankAccountService {

    @Autowired
    private BankAccountRepository bankAccountRepository;

    @Autowired
    private UserRepository userRepository;


    public BankAccount openAccount(OpenAccountRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        String accountNumber = generateAccountNumber();


        BankAccount account = new BankAccount();

        account.setAccountNumber(accountNumber);

        account.setIfscCode("ONBK0001234");

        account.setAccountType(
                request.getAccountType().toUpperCase()
        );

        account.setBalance(0.0);

        account.setStatus("ACTIVE");

        account.setUser(user);

        account.setCreatedAt(LocalDateTime.now());


        return bankAccountRepository.save(account);
    }


    private String generateAccountNumber() {

        Random random = new Random();

        String accountNumber;

        do {

            accountNumber = "ACC"
                    + (1000000000L
                    + random.nextInt(900000000));

        } while (
                bankAccountRepository
                        .existsByAccountNumber(accountNumber)
        );

        return accountNumber;
    }


    public List<BankAccount> getUserAccounts(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return bankAccountRepository.findByUser(user);
    }
}