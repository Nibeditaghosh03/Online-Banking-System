package com.nibedita.online_banking_system.service;

import com.nibedita.online_banking_system.dto.RegisterRequest;
import com.nibedita.online_banking_system.dto.WithdrawRequest;
import com.nibedita.online_banking_system.entity.User;
import com.nibedita.online_banking_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.nibedita.online_banking_system.dto.LoginRequest;
import java.util.List;
import com.nibedita.online_banking_system.dto.BalanceResponse;
import com.nibedita.online_banking_system.entity.Role;
import com.nibedita.online_banking_system.dto.DepositRequest;
import com.nibedita.online_banking_system.dto.TransferRequest;
import org.springframework.transaction.annotation.Transactional;
import com.nibedita.online_banking_system.repository.TransactionRepository;
import com.nibedita.online_banking_system.entity.Transaction;
import com.nibedita.online_banking_system.entity.TransactionType;
import java.time.LocalDateTime;
import com.nibedita.online_banking_system.dto.TransactionResponse;


@Service
public class UserService {
    @Autowired
private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public User registerUser(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        User user = new User();

       user.setFullName(request.getFullName());
       user.setEmail(request.getEmail());
      user.setPassword(passwordEncoder.encode(request.getPassword()));
       user.setPhoneNumber(request.getPhoneNumber());

user.setBalance(Double.valueOf(0.0));
user.setActive(true);
user.setRole(Role.USER);

String accountNumber = "ACC" + System.currentTimeMillis();
user.setAccountNumber(accountNumber);

System.out.println("Registering user:");
System.out.println("Name: " + user.getFullName());
System.out.println("Email: " + user.getEmail());
System.out.println("Phone: " + user.getPhoneNumber());
System.out.println("Account: " + user.getAccountNumber());
System.out.println("Balance: " + user.getBalance());
System.out.println("Active: " + user.getActive());
System.out.println("Role: " + user.getRole());

return userRepository.save(user);
    }
    public User loginUser(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }

        return user;
}

public List<User> getAllUsers() {
    return userRepository.findAll();
}

public BalanceResponse getBalance(String email) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    return new BalanceResponse(
            user.getAccountNumber(),
            user.getBalance()
    );
}
@Transactional
public BalanceResponse deposit(String email, DepositRequest request) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));

        double amount = request.getAmount();
        if (amount <= 0) {
    throw new RuntimeException(
        "Deposit amount must be greater than zero"
    );
}
        user.setBalance(user.getBalance() + amount);
        userRepository.save(user);

        Transaction transaction = new Transaction();

        transaction.setTransactionType(TransactionType.DEPOSIT);
        transaction.setAmount(amount);
        transaction.setReceiverAccountNumber(user.getAccountNumber());
        transaction.setTimestamp(LocalDateTime.now());

        transactionRepository.save(transaction);

       return new BalanceResponse(
        user.getAccountNumber(),
        user.getBalance()
);
}
    @Transactional
    public BalanceResponse withdraw(String email, WithdrawRequest request) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    double amount = request.getAmount();

    if (amount <= 0) {
        throw new RuntimeException("Withdrawal amount must be greater than zero");
    }

   if (user.getBalance() < amount) {
    throw new RuntimeException(
        "Insufficient balance"
    );
}

    user.setBalance(user.getBalance() - amount);

    userRepository.save(user);
    Transaction transaction = new Transaction();
    transaction.setTransactionType(TransactionType.WITHDRAW);
    transaction.setAmount(amount);
    transaction.setSenderAccountNumber(user.getAccountNumber());
    transaction.setTimestamp(LocalDateTime.now());

    transactionRepository.save(transaction);

    return new BalanceResponse(
            user.getAccountNumber(),
            user.getBalance()
    );
}

@Transactional
public BalanceResponse transfer(String senderEmail, TransferRequest request) {

    
    User sender = userRepository.findByEmail(senderEmail)
            .orElseThrow(() -> new RuntimeException("Sender not found"));

    
    User receiver = userRepository.findByAccountNumber(
            request.getReceiverAccountNumber()
    ).orElseThrow(() -> new RuntimeException("Receiver account not found"));

    double amount = request.getAmount();

    
    if (amount <= 0) {
        throw new RuntimeException(
                "Transfer amount must be greater than zero"
        );
    }

    
    if (sender.getAccountNumber().equals(receiver.getAccountNumber())) {
        throw new RuntimeException(
                "Cannot transfer money to your own account"
        );
    }

    
    if (sender.getBalance() < amount) {
        throw new RuntimeException(
                "Insufficient balance"
        );
    }

   
    sender.setBalance(sender.getBalance() - amount);

  
    receiver.setBalance(receiver.getBalance() + amount);

    
    userRepository.save(sender);
    userRepository.save(receiver);

    Transaction transaction = new Transaction();

    transaction.setTransactionType(TransactionType.TRANSFER);
    transaction.setAmount(amount);
    transaction.setSenderAccountNumber(sender.getAccountNumber());
    transaction.setReceiverAccountNumber(receiver.getAccountNumber());
    transaction.setTimestamp(LocalDateTime.now());

    transactionRepository.save(transaction);

    
    return new BalanceResponse(
            sender.getAccountNumber(),
            sender.getBalance()
    );
}

public List<TransactionResponse> getTransactionHistory(String email) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    String accountNumber = user.getAccountNumber();

    List<Transaction> transactions =
            transactionRepository
                    .findBySenderAccountNumberOrReceiverAccountNumberOrderByTimestampDesc(
                            accountNumber,
                            accountNumber
                    );

    return transactions.stream()
            .map(transaction -> new TransactionResponse(
                    transaction.getId(),
                    transaction.getTransactionType(),
                    transaction.getAmount(),
                    transaction.getSenderAccountNumber(),
                    transaction.getReceiverAccountNumber(),
                    transaction.getTimestamp()
            ))
            .toList();
}
}
