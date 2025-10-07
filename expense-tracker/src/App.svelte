<script>
  import { onMount } from 'svelte';
  import { theme } from './stores/theme.js';
  import { summary } from './stores/transactions.js';
  import TransactionForm from './components/TransactionForm.svelte';
  import TransactionList from './components/TransactionList.svelte';
  import DataManagement from './components/DataManagement.svelte';
  import ThemeToggle from './components/ThemeToggle.svelte';

  let showForm = false;

  onMount(() => {
    theme.init();
  });

  function formatCurrency(amount) {
    return amount.toFixed(2);
  }
</script>

<ThemeToggle />

<main>
  <header>
    <h1>Expense Tracker</h1>
  </header>

  <section class="summary">
    <div class="summary-card">
      <h3>Balance</h3>
      <p class="amount" class:positive={$summary.balance > 0} class:negative={$summary.balance < 0}>
        ${formatCurrency($summary.balance)}
      </p>
    </div>
    <div class="summary-card">
      <h3>Income</h3>
      <p class="amount positive">${formatCurrency($summary.income)}</p>
    </div>
    <div class="summary-card">
      <h3>Expenses</h3>
      <p class="amount negative">${formatCurrency($summary.expenses)}</p>
    </div>
  </section>

  <section class="actions">
    <button class="btn-primary" on:click={() => showForm = true}>+ Add Transaction</button>
  </section>

  <section class="transactions">
    <h2>Recent Transactions</h2>
    <TransactionList />
  </section>

  <DataManagement />
</main>

<TransactionForm bind:show={showForm} on:close={() => showForm = false} />

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }

  header {
    text-align: center;
    margin-bottom: 2rem;
  }

  h1 {
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
  }

  .summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .summary-card {
    background: var(--bg-secondary);
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    border: 1px solid var(--border-color);
  }

  .summary-card h3 {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);
    text-transform: uppercase;
  }

  .amount {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .amount.positive {
    color: var(--income-color);
  }

  .amount.negative {
    color: var(--expense-color);
  }

  .actions {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .btn-primary {
    background: var(--accent-color);
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-primary:hover {
    background: var(--accent-hover);
  }

  .transactions {
    margin-top: 2rem;
  }

  .transactions h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
</style>
