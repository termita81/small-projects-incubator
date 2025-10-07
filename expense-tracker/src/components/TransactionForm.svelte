<script>
  import { transactions } from '../stores/transactions.js';
  import { categories } from '../stores/categories.js';
  import { createEventDispatcher } from 'svelte';

  export let show = false;

  const dispatch = createEventDispatcher();

  let formData = {
    type: 'expense',
    amount: '',
    description: '',
    categories: [],
    date: new Date().toISOString().split('T')[0]
  };

  let newCategory = '';

  function handleSubmit() {
    if (!formData.amount || formData.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    transactions.add({
      type: formData.type,
      amount: parseFloat(formData.amount),
      description: formData.description,
      categories: formData.categories,
      date: formData.date
    });

    // Reset form
    formData = {
      type: 'expense',
      amount: '',
      description: '',
      categories: [],
      date: new Date().toISOString().split('T')[0]
    };

    dispatch('close');
  }

  function toggleCategory(category) {
    if (formData.categories.includes(category)) {
      formData.categories = formData.categories.filter(c => c !== category);
    } else {
      formData.categories = [...formData.categories, category];
    }
  }

  function addNewCategory() {
    if (newCategory.trim()) {
      categories.add(newCategory.trim());
      toggleCategory(newCategory.trim());
      newCategory = '';
    }
  }

  function handleClose() {
    dispatch('close');
  }
</script>

{#if show}
  <div class="modal-overlay" on:click={handleClose}>
    <div class="modal" on:click|stopPropagation>
      <div class="modal-header">
        <h2>Add Transaction</h2>
        <button class="close-btn" on:click={handleClose}>&times;</button>
      </div>

      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-group">
          <label>Type</label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" bind:group={formData.type} value="expense" />
              Expense
            </label>
            <label class="radio-label">
              <input type="radio" bind:group={formData.type} value="income" />
              Income
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="amount">Amount *</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            bind:value={formData.amount}
            placeholder="0.00"
            required
          />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <input
            id="description"
            type="text"
            bind:value={formData.description}
            placeholder="Optional description"
          />
        </div>

        <div class="form-group">
          <label for="date">Date</label>
          <input
            id="date"
            type="date"
            bind:value={formData.date}
          />
        </div>

        <div class="form-group">
          <label>Categories</label>
          <div class="category-tags">
            {#each $categories as category}
              <button
                type="button"
                class="category-tag"
                class:selected={formData.categories.includes(category)}
                on:click={() => toggleCategory(category)}
              >
                {category}
              </button>
            {/each}
          </div>

          <div class="add-category">
            <input
              type="text"
              bind:value={newCategory}
              placeholder="Add new category"
              on:keypress={(e) => e.key === 'Enter' && (e.preventDefault(), addNewCategory())}
            />
            <button type="button" on:click={addNewCategory}>+</button>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" on:click={handleClose}>
            Cancel
          </button>
          <button type="submit" class="btn-primary">
            Add Transaction
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal {
    background: var(--bg-primary);
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 6px var(--shadow);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    line-height: 1;
    cursor: pointer;
    color: var(--text-secondary);
    padding: 0;
    width: 2rem;
    height: 2rem;
  }

  .close-btn:hover {
    color: var(--text-primary);
  }

  form {
    padding: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-primary);
  }

  .form-group input[type="text"],
  .form-group input[type="number"],
  .form-group input[type="date"] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 1rem;
    background: var(--bg-primary);
    color: var(--text-primary);
  }

  .form-group input:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }

  .radio-group {
    display: flex;
    gap: 1rem;
  }

  .radio-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-weight: 400;
  }

  .radio-label input[type="radio"] {
    cursor: pointer;
  }

  .category-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .category-tag {
    padding: 0.375rem 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 16px;
    background: var(--bg-primary);
    color: var(--text-primary);
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s;
  }

  .category-tag:hover {
    background: var(--bg-secondary);
  }

  .category-tag.selected {
    background: var(--accent-color);
    color: white;
    border-color: var(--accent-color);
  }

  .add-category {
    display: flex;
    gap: 0.5rem;
  }

  .add-category input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 0.875rem;
    background: var(--bg-primary);
    color: var(--text-primary);
  }

  .add-category button {
    padding: 0.5rem 1rem;
    background: var(--income-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.25rem;
    line-height: 1;
  }

  .add-category button:hover {
    opacity: 0.9;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-primary {
    background: var(--accent-color);
    color: white;
  }

  .btn-primary:hover {
    background: var(--accent-hover);
  }

  .btn-secondary {
    background: var(--text-secondary);
    color: white;
  }

  .btn-secondary:hover {
    opacity: 0.9;
  }
</style>
