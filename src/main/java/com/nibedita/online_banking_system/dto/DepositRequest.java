package com.nibedita.online_banking_system.dto;
import jakarta.validation.constraints.Positive;


public class DepositRequest {

    @Positive(message = "Deposit amount must be greater than zero")
    private double amount;

    public DepositRequest() {
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }
}