<template>
  <div class="container">
    <header class="headTitle display-3 text-center mb-3 ">Expense Tracker</header>
    <div class="row justify-content-center">
      <div class="col-md-6 mb-5">
        <div class="search-bar">
          <input type="text" v-model="searchQuery" placeholder="Search Expenses" class="form-control">
          <i>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              class="bi bi-search" viewBox="0 0 16 16">
              <path
                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </i>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="inputfields col-md-6">
        <div class="title mb-4">
          <h2 class="title-text text-center">Add Expense</h2>
        </div>
        <div class="mb-3">
          <label for="item" class="form-label">Item:</label>
          <input type="text" v-model="newExpense.item" id="item" placeholder="Input Item" class="form-control">
        </div>
        <div class="mb-3">
          <label for="category" class="form-label">Category:</label>
          <select v-model="newExpense.category" id="category" class="form-select">
            <option value="" disabled selected>Select Category</option>
            <option value="Foods">Foods</option>
            <option value="Drinks">Drinks</option>
            <option value="Clothing">Clothing</option>
            <option value="Utilities">Utilities</option>
            <option value="Leisure">Leisure</option>
            <option value="Transportation">Transportation</option>
            <option value="School">School</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="amount" class="form-label">Amount:</label>
          <input type="text" v-model="amountInput" id="amount" placeholder="Input Amount" class="form-control">
        </div>
        <div class="mb-3 d-flex justify-content-center">
          <button @click="addPatchExpense" class="btncss btn btn-primary">{{ editingIndex === null ? 'Add' : 'Update' }}</button>
        </div>
      </div>
      <div class="col-md-8">
        <div class="table-responsive expenses-table-container">
          <table class="table table-bordered table-hover">
            <thead class="table-dark">
              <tr>
                <th>Date & Time</th>
                <th>Item</th>
                <th>Category</th>
                <th>Amount</th>
                <th style="width: 150px">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(expense, index) in filteredExpenses" :key="index">
                <td>{{ expense.dateTime }}</td>
                <td>{{ expense.item }}</td>
                <td>{{ expense.category }}</td>
                <td>₱{{ expense.amount.toFixed(2) }}</td>
                <td>
                  <button @click="editExpense(index)" class="btn btn-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                      class="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path
                        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path fill-rule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(expense.id)" class="btn btn-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                      class="bi bi-trash3-fill" viewBox="0 0 16 16">
                      <path
                        d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="total-expenses">
          <div class="totaldes">Total Expenses: {{ totalExpenses }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

  
<script setup>
import './Tracker.css';
import {
  ExpenseTracker,
  newExpense,
  amountInput,
  editingIndex,
  searchQuery,
  filteredExpenses,
  fetchExpenseTrackerDB,
  addPatchExpense,
  addExpense,
  patchExpense,
  deleteExpense,
  confirmDelete,
  editExpense,
  totalExpenses,
} from './assets/TrackerScript';
import { onMounted } from 'vue';

onMounted(fetchExpenseTrackerDB);
</script>