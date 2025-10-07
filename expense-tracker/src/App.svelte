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

<div class="app-container">
  <main>
    <header>
      <h1>Expense Tracker</h1>
    </header>

    <section class="summary">
      <div class="summary-item">
        <span class="label">Income</span>
        <span class="amount positive">${formatCurrency($summary.income)}</span>
      </div>
      <div class="summary-item">
        <span class="label">Expenses</span>
        <span class="amount negative">${formatCurrency($summary.expenses)}</span>
      </div>
      <div class="summary-item balance">
        <span class="label">Balance</span>
        <span class="amount" class:positive={$summary.balance > 0} class:negative={$summary.balance < 0}>
          ${formatCurrency($summary.balance)}
        </span>
      </div>
    </section>

    <section class="actions">
      <button class="btn-primary" on:click={() => showForm = true}>+ Add Transaction</button>
    </section>

    <section class="transactions">
      <h2>Recent Transactions</h2>
      <TransactionList />
    </section>
  </main>

  <footer class="app-footer">
    <DataManagement />
  </footer>
</div>

<TransactionForm bind:show={showForm} on:close={() => showForm = false} />

<style>
  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1;
    width: 100%;
    margin: 0 auto;
    padding: 1rem 10px;
  }

  .app-footer {
    position: sticky;
    bottom: 0;
    background: var(--bg-primary);
    border-top: 1px solid var(--border-color);
    padding: 1rem;
    box-shadow: 0 -2px 8px var(--shadow);
  }

  .app-footer :global(.data-management) {
    margin: 0;
    background: transparent;
    border: none;
    padding: 0;
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
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 1rem;
    padding: 1rem 2rem;
    background: var(--bg-secondary);
    border-radius: 8px;
    border: 1px solid var(--border-color);
    margin-bottom: 2rem;
  }

  .summary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    flex: 1;
  }

  .summary-item.balance {
    padding-left: 1rem;
    border-left: 1px solid var(--border-color);
  }

  .label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .amount {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .amount.positive {
    color: var(--income-color);
  }

  .amount.negative {
    color: var(--expense-color);
  }

  @media (max-width: 600px) {
    .summary {
      flex-direction: column;
      gap: 0.75rem;
    }

    .summary-item.balance {
      padding-left: 0;
      padding-top: 0.75rem;
      border-left: none;
      border-top: 1px solid var(--border-color);
    }
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
