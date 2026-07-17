package com.nibedita.online_banking_system.service;

import com.nibedita.online_banking_system.dto.RegisterRequest;
import com.nibedita.online_banking_system.entity.User;
import com.nibedita.online_banking_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.nibedita.online_banking_system.dto.LoginRequest;
import java.util.List;
import com.nibedita.online_banking_system.dto.BalanceResponse;
import com.nibedita.online_banking_system.entity.Role;

@Service
public class UserService {
    @Autowired
private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

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
}