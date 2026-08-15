package com.nibedita.online_banking_system.service;

import com.nibedita.online_banking_system.dto.RegisterRequest;
import com.nibedita.online_banking_system.dto.LoginRequest;
import com.nibedita.online_banking_system.dto.WithdrawRequest;
import com.nibedita.online_banking_system.dto.DepositRequest;
import com.nibedita.online_banking_system.dto.TransferRequest;
import com.nibedita.online_banking_system.dto.BalanceResponse;
import com.nibedita.online_banking_system.dto.TransactionResponse;

import com.nibedita.online_banking_system.entity.User;
import com.nibedita.online_banking_system.entity.BankAccount;
import com.nibedita.online_banking_system.entity.Role;
import com.nibedita.online_banking_system.entity.Transaction;
import com.nibedita.online_banking_system.entity.TransactionType;

import com.nibedita.online_banking_system.repository.UserRepository;
import com.nibedita.online_banking_system.repository.BankAccountRepository;
import com.nibedita.online_banking_system.repository.TransactionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BankAccountRepository bankAccountRepository;

    @Autowired
    private TransactionRepository transactionRepository;


    // =========================================================
    // REGISTER USER
    // =========================================================

    @Transactional
    public User registerUser(RegisterRequest request) {

        // 1. Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        // 2. Create User
        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        // Password is stored as a BCrypt hash
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setPhoneNumber(request.getPhoneNumber());

        user.setActive(true);
        user.setRole(Role.USER);


        // =====================================================
        // CREATE FIRST BANK ACCOUNT
        // =====================================================

        BankAccount bankAccount = new BankAccount();

        // Generate unique account number
        bankAccount.setAccountNumber(
                generateAccountNumber()
        );

        // Demo IFSC for FINNOVA
        bankAccount.setIfscCode(
                "FINN0001234"
        );

        // First account is a Savings Account
        bankAccount.setAccountType(
                "SAVINGS"
        );

        // New account starts with zero balance
        bankAccount.setBalance(0.0);

        // Account is active
        bankAccount.setStatus("ACTIVE");

        // Account creation time
        bankAccount.setCreatedAt(
                LocalDateTime.now()
        );


        // =====================================================
        // CONNECT BANK ACCOUNT WITH USER
        // =====================================================

        bankAccount.setUser(user);

        user.getBankAccounts().add(bankAccount);


        // =====================================================
        // SAVE USER
        // =====================================================

        User savedUser = userRepository.save(user);


        // =====================================================
        // DEBUG INFORMATION
        // =====================================================
        // We will remove these logs later for production.

        System.out.println("User registered successfully");
        System.out.println("Name: " + savedUser.getFullName());
        System.out.println("Email: " + savedUser.getEmail());
        System.out.println(
                "Account: "
                + bankAccount.getAccountNumber()
        );
        System.out.println(
                "IFSC: "
                + bankAccount.getIfscCode()
        );
        System.out.println(
                "Account Type: "
                + bankAccount.getAccountType()
        );


        return savedUser;
    }


    // =========================================================
    // GENERATE ACCOUNT NUMBER
    // =========================================================

    private String generateAccountNumber() {

        String accountNumber;

        do {

            accountNumber =
                    "FNX"
                    + System.currentTimeMillis();

        } while (
                bankAccountRepository
                        .existsByAccountNumber(accountNumber)
        );

        return accountNumber;
    }


    // =========================================================
    // LOGIN USER
    // =========================================================

    public User loginUser(LoginRequest request) {

        User user =
                userRepository
                        .findByEmail(request.getEmail())
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found!"
                                )
                        );


        // Verify password
        if (
                !passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                )
        ) {

            throw new RuntimeException(
                    "Invalid password!"
            );
        }


        // Check whether account/user is active
        if (!user.getActive()) {

            throw new RuntimeException(
                    "User account is inactive!"
            );
        }


        return user;
    }


    // =========================================================
    // GET ALL USERS
    // =========================================================

    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    // =========================================================
    // GET USER ACCOUNTS
    // =========================================================

    public List<BankAccount> getUserAccounts(String email) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        return bankAccountRepository.findByUser(user);
    }


    // =========================================================
    // GET BALANCE
    // =========================================================

    public BalanceResponse getBalance(String email) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        // Get user's accounts
        List<BankAccount> accounts =
                bankAccountRepository.findByUser(user);


        if (accounts.isEmpty()) {

            throw new RuntimeException(
                    "No bank account found"
            );
        }


        // For now use the first account.
        // Later we will allow the user to select
        // a specific account.
        BankAccount account =
                accounts.get(0);


        return new BalanceResponse(
                account.getAccountNumber(),
                account.getBalance()
        );
    }


    // =========================================================
    // DEPOSIT
    // =========================================================

    @Transactional
    public BalanceResponse deposit(
            String email,
            DepositRequest request
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        List<BankAccount> accounts =
                bankAccountRepository.findByUser(user);


        if (accounts.isEmpty()) {

            throw new RuntimeException(
                    "No bank account found"
            );
        }


        BankAccount account =
                accounts.get(0);


        double amount =
                request.getAmount();


        // Amount validation
        if (amount <= 0) {

            throw new RuntimeException(
                    "Deposit amount must be greater than zero"
            );
        }


        // Update balance
        account.setBalance(
                account.getBalance() + amount
        );

        bankAccountRepository.save(account);


        // Create transaction
        Transaction transaction =
                new Transaction();

        transaction.setTransactionType(
                TransactionType.DEPOSIT
        );

        transaction.setAmount(amount);

        transaction.setReceiverAccountNumber(
                account.getAccountNumber()
        );

        transaction.setTimestamp(
                LocalDateTime.now()
        );


        transactionRepository.save(
                transaction
        );


        return new BalanceResponse(
                account.getAccountNumber(),
                account.getBalance()
        );
    }


    // =========================================================
    // WITHDRAW
    // =========================================================

    @Transactional
    public BalanceResponse withdraw(
            String email,
            WithdrawRequest request
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        List<BankAccount> accounts =
                bankAccountRepository.findByUser(user);


        if (accounts.isEmpty()) {

            throw new RuntimeException(
                    "No bank account found"
            );
        }


        BankAccount account =
                accounts.get(0);


        double amount =
                request.getAmount();


        // Amount validation
        if (amount <= 0) {

            throw new RuntimeException(
                    "Withdrawal amount must be greater than zero"
            );
        }


        // Balance validation
        if (account.getBalance() < amount) {

            throw new RuntimeException(
                    "Insufficient balance"
            );
        }


        // Update balance
        account.setBalance(
                account.getBalance() - amount
        );

        bankAccountRepository.save(account);


        // Create transaction
        Transaction transaction =
                new Transaction();

        transaction.setTransactionType(
                TransactionType.WITHDRAW
        );

        transaction.setAmount(amount);

        transaction.setSenderAccountNumber(
                account.getAccountNumber()
        );

        transaction.setTimestamp(
                LocalDateTime.now()
        );


        transactionRepository.save(
                transaction
        );


        return new BalanceResponse(
                account.getAccountNumber(),
                account.getBalance()
        );
    }


    // =========================================================
    // TRANSFER MONEY
    // =========================================================

    @Transactional
    public BalanceResponse transfer(
            String senderEmail,
            TransferRequest request
    ) {

        // Find sender
        User sender =
                userRepository
                        .findByEmail(senderEmail)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Sender not found"
                                )
                        );


        // Get sender accounts
        List<BankAccount> senderAccounts =
                bankAccountRepository.findByUser(sender);


        if (senderAccounts.isEmpty()) {

            throw new RuntimeException(
                    "Sender bank account not found"
            );
        }


        // For now use first account
        BankAccount senderAccount =
                senderAccounts.get(0);


        // Find receiver
        BankAccount receiverAccount =
                bankAccountRepository
                        .findByAccountNumber(
                                request.getReceiverAccountNumber()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Receiver account not found"
                                )
                        );


        double amount =
                request.getAmount();


        // Amount validation
        if (amount <= 0) {

            throw new RuntimeException(
                    "Transfer amount must be greater than zero"
            );
        }


        // Prevent self-transfer
        if (
                senderAccount
                        .getAccountNumber()
                        .equals(
                                receiverAccount
                                        .getAccountNumber()
                        )
        ) {

            throw new RuntimeException(
                    "Cannot transfer money to your own account"
            );
        }


        // Balance validation
        if (
                senderAccount.getBalance()
                        < amount
        ) {

            throw new RuntimeException(
                    "Insufficient balance"
            );
        }


        // Remove money from sender
        senderAccount.setBalance(
                senderAccount.getBalance() - amount
        );


        // Add money to receiver
        receiverAccount.setBalance(
                receiverAccount.getBalance() + amount
        );


        // Save both accounts
        bankAccountRepository.save(
                senderAccount
        );

        bankAccountRepository.save(
                receiverAccount
        );


        // Create transaction
        Transaction transaction =
                new Transaction();

        transaction.setTransactionType(
                TransactionType.TRANSFER
        );

        transaction.setAmount(amount);

        transaction.setSenderAccountNumber(
                senderAccount.getAccountNumber()
        );

        transaction.setReceiverAccountNumber(
                receiverAccount.getAccountNumber()
        );

        transaction.setTimestamp(
                LocalDateTime.now()
        );


        transactionRepository.save(
                transaction
        );


        return new BalanceResponse(
                senderAccount.getAccountNumber(),
                senderAccount.getBalance()
        );
    }


    // =========================================================
    // TRANSACTION HISTORY
    // =========================================================

    public List<TransactionResponse>
    getTransactionHistory(String email) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        List<BankAccount> accounts =
                bankAccountRepository.findByUser(user);


        if (accounts.isEmpty()) {

            throw new RuntimeException(
                    "No bank account found"
            );
        }


        // For now use first account
        String accountNumber =
                accounts.get(0)
                        .getAccountNumber();


        List<Transaction> transactions =
                transactionRepository
                        .findBySenderAccountNumberOrReceiverAccountNumberOrderByTimestampDesc(
                                accountNumber,
                                accountNumber
                        );


        return transactions.stream()
                .map(
                        transaction ->
                                new TransactionResponse(
                                        transaction.getId(),
                                        transaction.getTransactionType(),
                                        transaction.getAmount(),
                                        transaction.getSenderAccountNumber(),
                                        transaction.getReceiverAccountNumber(),
                                        transaction.getTimestamp()
                                )
                )
                .toList();
    }
}