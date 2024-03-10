import db from '../firebase/config';
import { ref, computed } from 'vue';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

const ExpenseTracker = ref([]);
const newExpense = ref({
  item: '',
  category: '',
  amount: 0,
});
const amountInput = ref('');
const editingIndex = ref(null);
const searchQuery = ref('');

const filteredExpenses = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return ExpenseTracker.value.filter(
    (expense) =>
      expense.item.toLowerCase().includes(query) ||
      expense.category.toLowerCase().includes(query)
  );
});

const fetchExpenseTrackerDB = async () => {
  const q = query(collection(db, 'ExpenseTracker'), orderBy('dateTime', 'desc'));

  const fetch = onSnapshot(q, (snapshot) => {
    ExpenseTracker.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  });
};

const addPatchExpense = async () => {
  if (!newExpense.value.item || !newExpense.value.category || !amountInput.value) {
    alert('Please fill up all the fields to continue.');
    return;
  }

  if (isNaN(parseFloat(amountInput.value))) {
    alert('Please enter a valid number for the amount.');
    return;
  }

  if (editingIndex.value === null) {
    await addExpense();
  } else {
    await patchExpense();
  }
};

const addExpense = async () => {
  const dateTime = new Date().toLocaleString();
  const expense = { ...newExpense.value, amount: parseFloat(amountInput.value), dateTime };

  try {
    const docRef = await addDoc(collection(db, 'ExpenseTracker'), expense);
  } catch (error) {
    console.error(error);
  }

  newExpense.value = {
    item: '',
    category: '',
    amount: 0,
  };
  amountInput.value = '';
};

const patchExpense = async () => {
  const expenseId = ExpenseTracker.value[editingIndex.value].id;
  const expense = { ...newExpense.value, amount: parseFloat(amountInput.value) };

  try {
    await updateDoc(doc(db, 'ExpenseTracker', expenseId), expense);
    console.log('Expense updated with ID: ', expenseId);
  } catch (error) {
    console.error('Error updating expense: ', error);
  }

  newExpense.value = {
    item: '',
    category: '',
    amount: 0,
  };
  amountInput.value = '';
  editingIndex.value = null;
};

const deleteExpense = async (id) => {
  try {
    await deleteDoc(doc(db, 'ExpenseTracker', id));
  } catch (error) {
    console.error(error);
  }
};

const confirmDelete = (id, category) => {
  if (window.confirm('Delete this expense?')) {
    deleteExpense(id);
  }
};

const editExpense = (index) => {
  const expense = ExpenseTracker.value[index];
  newExpense.value = {
    item: expense.item,
    category: expense.category,
    amount: expense.amount,
  };
  amountInput.value = expense.amount;
  editingIndex.value = index;
};

const totalExpenses = computed(() => {
  const totalAmount = filteredExpenses.value.reduce(
    (total, expense) => total + parseFloat(expense.amount),
    0
  );
  return totalAmount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
});

export {
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
};
