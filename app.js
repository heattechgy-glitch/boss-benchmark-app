// BOSS-Benchmark Application

class BenchmarkApp {
  constructor() {
    this.benchmarks = [];
    this.container = document.getElementById('app') || document.body;
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    if (this.benchmarks.length === 0) {
      this.renderEmptyState();
    } else {
      this.renderBenchmarks();
    }
  }

  renderEmptyState() {
    const emptyStateHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3v18h18"/>
            <path d="M18 17V9"/>
            <path d="M13 17V5"/>
            <path d="M8 17v-3"/>
          </svg>
        </div>
        <h2 class="empty-state-title">No Benchmarks Yet</h2>
        <p class="empty-state-message">
          You haven't created any benchmarks yet. Start by creating your first benchmark to track and compare performance metrics.
        </p>
        <button class="empty-state-action" onclick="app.createBenchmark()">
          Create Your First Benchmark
        </button>
      </div>
    `;
    this.container.innerHTML = emptyStateHTML;
  }

  renderBenchmarks() {
    const benchmarksHTML = `
      <div class="benchmarks-container">
        <div class="benchmarks-header">
          <h1>BOSS Benchmarks</h1>
          <button class="btn-primary" onclick="app.createBenchmark()">
            New Benchmark
          </button>
        </div>
        <div class="benchmarks-list">
          ${this.benchmarks.map(benchmark => this.renderBenchmarkCard(benchmark)).join('')}
        </div>
      </div>
    `;
    this.container.innerHTML = benchmarksHTML;
  }

  renderBenchmarkCard(benchmark) {
    return `
      <div class="benchmark-card" data-id="${benchmark.id}">
        <h3>${benchmark.name}</h3>
        <p>${benchmark.description || 'No description'}</p>
        <div class="benchmark-meta">
          <span>Created: ${new Date(benchmark.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    `;
  }

  createBenchmark() {
    const name = prompt('Enter benchmark name:');
    if (name) {
      const benchmark = {
        id: Date.now().toString(),
        name: name,
        description: '',
        createdAt: new Date().toISOString(),
        results: []
      };
      this.benchmarks.push(benchmark);
      this.render();
    }
  }

  deleteBenchmark(id) {
    this.benchmarks = this.benchmarks.filter(b => b.id !== id);
    this.render();
  }
}

// Initialize the application
const app = new BenchmarkApp();
