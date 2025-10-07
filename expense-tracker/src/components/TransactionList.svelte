<script>
  import { transactions } from '../stores/transactions.js';

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function formatAmount(amount) {
    return amount.toFixed(2);
  }

  function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      transactions.delete(id);
    }
  }
</script>

<div class="transaction-list">
  {#if $transactions.length === 0}
    <div class="empty-state">
      <p>No transactions yet. Add your first transaction to get started!</p>
    </div>
  {:else}
    {#each $transactions as transaction (transaction.id)}
      <div class="transaction-item" class:income={transaction.type === 'income'}>
        <div class="transaction-main">
          <div class="transaction-info">
            <div class="transaction-desc">
              {transaction.description || 'No description'}
            </div>
            <div class="transaction-meta">
              <span class="date">{formatDate(transaction.date)}</span>
              {#if transaction.categories && transaction.categories.length > 0}
                <span class="categories">
                  {transaction.categories.join(', ')}
                </span>
              {/if}
            </div>
          </div>
          <div class="transaction-amount">
            <span class="amount" class:positive={transaction.type === 'income'} class:negative={transaction.type === 'expense'}>
              {transaction.type === 'income' ? '+' : '-'}${formatAmount(transaction.amount)}
            </span>
            <button class="delete-btn" on:click={() => deleteTransaction(transaction.id)} title="Delete transaction">
              ×
            </button>
          </div>
        </div>
      </div>
    {/each}
  {/if}
</div>

<style>
  .transaction-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--text-secondary);
  }

  .transaction-item {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1rem;
    transition: box-shadow 0.2s;
  }

  .transaction-item:hover {
    box-shadow: 0 2px 4px var(--shadow);
  }

  .transaction-item.income {
    border-left: 4px solid var(--income-color);
  }

  .transaction-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .transaction-info {
    flex: 1;
    min-width: 0;
  }

  .transaction-desc {
    font-weight: 500;
    margin-bottom: 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .transaction-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .date {
    flex-shrink: 0;
  }

  .categories {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .transaction-amount {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .amount {
    font-weight: 600;
    font-size: 1.125rem;
    white-space: nowrap;
  }

  .amount.positive {
    color: var(--income-color);
  }

  .amount.negative {
    color: var(--expense-color);
  }

  .delete-btn {
    background: none;
    border: none;
    color: var(--expense-color);
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    width: 1.5rem;
    height: 1.5rem;
    opacity: 0.5;
    transition: opacity 0.2s;
  }

  .delete-btn:hover {
    opacity: 1;
  }

  @media (max-width: 600px) {
    .transaction-main {
      flex-direction: column;
      align-items: flex-start;
    }

    .transaction-amount {
      width: 100%;
      justify-content: space-between;
    }
  }
</style>
