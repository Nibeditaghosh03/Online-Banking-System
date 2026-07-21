package com.nibedita.online_banking_system.dto;
import com.nibedita.online_banking_system.dto.WithdrawRequest;

public class WithdrawRequest {

    private double amount;

    public WithdrawRequest() {
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }
}
