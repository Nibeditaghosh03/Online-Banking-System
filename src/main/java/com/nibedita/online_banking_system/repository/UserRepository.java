package com.nibedita.online_banking_system.repository;

import com.nibedita.online_banking_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByAccountNumber(String accountNumber);

    Optional<User> findByAccountNumber(String accountNumber);
}