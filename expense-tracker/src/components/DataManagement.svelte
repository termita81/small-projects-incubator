<script>
  import { transactions } from '../stores/transactions.js';
  import { categories } from '../stores/categories.js';
  import { exportData, importData, STORAGE_KEYS, saveToStorage } from '../utils/storage.js';

  let fileInput;
  let importStatus = '';

  function handleExport() {
    exportData();
  }

  function handleImportClick() {
    fileInput.click();
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = importData(e.target.result);

      if (result.success) {
        // Reload the stores with imported data
        if (result.data.transactions) {
          transactions.set(result.data.transactions);
        }
        if (result.data.categories) {
          categories.set(result.data.categories);
        }

        importStatus = 'success';
        setTimeout(() => {
          importStatus = '';
        }, 3000);
      } else {
        importStatus = 'error';
        alert(`Import failed: ${result.error}`);
        setTimeout(() => {
          importStatus = '';
        }, 3000);
      }
    };

    reader.readAsText(file);
    event.target.value = ''; // Reset input
  }

  function handleClearData() {
    if (confirm('Are you sure you want to delete all data? This cannot be undone!')) {
      transactions.clear();
      categories.reset();
      importStatus = 'cleared';
      setTimeout(() => {
        importStatus = '';
      }, 3000);
    }
  }
</script>

<div class="data-management">
  <h3>Data Management</h3>

  <div class="actions">
    <button class="btn" on:click={handleExport} title="Export all data to JSON file">
      📥 Export Data
    </button>

    <button class="btn" on:click={handleImportClick} title="Import data from JSON file">
      📤 Import Data
    </button>

    <button class="btn btn-danger" on:click={handleClearData} title="Delete all data">
      🗑️ Clear All Data
    </button>
  </div>

  {#if importStatus === 'success'}
    <div class="status success">
      ✓ Data imported successfully!
    </div>
  {:else if importStatus === 'error'}
    <div class="status error">
      ✗ Import failed. Please check the file format.
    </div>
  {:else if importStatus === 'cleared'}
    <div class="status info">
      All data has been cleared.
    </div>
  {/if}

  <input
    type="file"
    accept="application/json,.json"
    bind:this={fileInput}
    on:change={handleFileChange}
    style="display: none;"
  />
</div>

<style>
  .data-management {
    margin-top: 3rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
  }

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #495057;
  }

  .actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .btn {
    padding: 0.5rem 1rem;
    border: 1px solid #ced4da;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s;
  }

  .btn:hover {
    background: #e9ecef;
    border-color: #adb5bd;
  }

  .btn-danger {
    color: #dc3545;
    border-color: #dc3545;
  }

  .btn-danger:hover {
    background: #dc3545;
    color: white;
  }

  .status {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .status.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .status.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .status.info {
    background: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
  }
</style>
