// Sample data for employee expenses
const employeeExpenses = [
    {
        id: 1,
        description: "Client Dinner Meeting",
        category: "Meals & Entertainment",
        amount: 125.50,
        currency: "USD",
        date: "2025-09-28",
        submitted: "2025-09-29",
        status: "pending",
        approver: "Sarah Johnson (Manager)",
        notes: "Business dinner with potential client from ABC Corp to discuss partnership opportunities.",
        receipt: "receipt_001.jpg",
        timeline: [
            { date: "2025-09-29", action: "Expense submitted for approval" },
            { date: "2025-09-29", action: "Forwarded to Sarah Johnson (Manager) for review" }
        ]
    },
    {
        id: 2,
        description: "Flight to Conference",
        category: "Travel",
        amount: 450.00,
        currency: "USD",
        date: "2025-09-26",
        submitted: "2025-09-27",
        status: "approved",
        approver: "Sarah Johnson (Manager)",
        approvedDate: "2025-09-27",
        notes: "Round-trip flight to annual industry conference in San Francisco.",
        receipt: "receipt_002.jpg",
        timeline: [
            { date: "2025-09-27", action: "Expense submitted for approval" },
            { date: "2025-09-27", action: "Approved by Sarah Johnson (Manager)" }
        ]
    },
    {
        id: 3,
        description: "Office Supplies",
        category: "Office Expenses",
        amount: 85.25,
        currency: "USD",
        date: "2025-09-25",
        submitted: "2025-09-26",
        status: "rejected",
        approver: "Sarah Johnson (Manager)",
        rejectedDate: "2025-09-26",
        rejectionReason: "Expense exceeds department budget for office supplies this month.",
        notes: "Purchase of office stationery and printer supplies.",
        receipt: "receipt_003.jpg",
        timeline: [
            { date: "2025-09-26", action: "Expense submitted for approval" },
            { date: "2025-09-26", action: "Rejected by Sarah Johnson (Manager)" }
        ]
    },
    {
        id: 4,
        description: "Hotel Accommodation",
        category: "Travel",
        amount: 320.00,
        currency: "USD",
        date: "2025-09-20",
        submitted: "2025-09-21",
        status: "approved",
        approver: "Sarah Johnson (Manager)",
        approvedDate: "2025-09-21",
        notes: "3-night hotel stay during business trip to New York.",
        receipt: "receipt_004.jpg",
        timeline: [
            { date: "2025-09-21", action: "Expense submitted for approval" },
            { date: "2025-09-21", action: "Approved by Sarah Johnson (Manager)" }
        ]
    },
    {
        id: 5,
        description: "Team Lunch",
        category: "Meals & Entertainment",
        amount: 75.30,
        currency: "USD",
        date: "2025-09-27",
        submitted: "2025-09-28",
        status: "pending",
        approver: "Sarah Johnson (Manager)",
        notes: "Team building lunch with department colleagues.",
        receipt: "receipt_005.jpg",
        timeline: [
            { date: "2025-09-28", action: "Expense submitted for approval" },
            { date: "2025-09-28", action: "Forwarded to Sarah Johnson (Manager) for review" }
        ]
    }
];

// DOM Elements
const modals = document.querySelectorAll('.modal');
const closeModalButtons = document.querySelectorAll('.close-modal');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Current expense being viewed/edited
let currentExpenseId = null;

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    bindEvents();
});

function initializeDashboard() {
    renderRecentExpenses();
    renderPendingExpenses();
    renderHistoryExpenses();
    updateDashboardStats();
}

function bindEvents() {
    // Tab Switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.getAttribute('data-tab'));
        });
    });

    // Modal Handling
    document.getElementById('submit-expense-btn').addEventListener('click', () => {
        openModal('submit-expense-modal');
        // Set default date to today
        document.getElementById('expense-date').valueAsDate = new Date();
    });

    document.getElementById('save-expense-btn').addEventListener('click', saveExpense);
    document.getElementById('update-expense-btn').addEventListener('click', updateExpense);

    // OCR Upload Handling
    const ocrUploadArea = document.getElementById('ocr-upload-area');
    const receiptFileInput = document.getElementById('receipt-file');
    
    ocrUploadArea.addEventListener('click', () => {
        receiptFileInput.click();
    });
    
    receiptFileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            processReceiptOCR(e.target.files[0]);
        }
    });

    // Action Buttons
    document.getElementById('filter-recent-btn').addEventListener('click', filterRecentExpenses);
    document.getElementById('refresh-pending-btn').addEventListener('click', refreshPendingExpenses);
    document.getElementById('export-history-btn').addEventListener('click', exportHistory);
    document.getElementById('filter-history-btn').addEventListener('click', filterHistory);

    // Close Modals
    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });
}

function switchTab(tabName) {
    // Remove active class from all tabs and contents
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding content
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeAllModals() {
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    // Reset forms
    document.getElementById('expense-form').reset();
    document.getElementById('edit-expense-form').reset();
    document.getElementById('ocr-results').style.display = 'none';
    currentExpenseId = null;
}

function renderRecentExpenses() {
    const tbody = document.getElementById('recent-expenses-list');
    tbody.innerHTML = '';

    // Get recent expenses (last 5)
    const recentExpenses = [...employeeExpenses]
        .sort((a, b) => new Date(b.submitted) - new Date(a.submitted))
        .slice(0, 5);

    recentExpenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(expense.date)}</td>
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td>${formatCurrency(expense.amount, expense.currency)}</td>
            <td>
                <span class="badge badge-${expense.status}">${expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-light btn-sm view-expense-btn" data-id="${expense.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${expense.status === 'pending' || expense.status === 'rejected' ? `
                    <button class="btn btn-light btn-sm edit-expense-btn" data-id="${expense.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    ` : ''}
                    ${expense.status === 'approved' ? `
                    <button class="btn btn-light btn-sm">
                        <i class="fas fa-download"></i>
                    </button>
                    ` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Add event listeners
    addExpenseActionListeners();
}

function renderPendingExpenses() {
    const tbody = document.getElementById('pending-expenses-list');
    tbody.innerHTML = '';

    const pendingExpenses = employeeExpenses.filter(expense => expense.status === 'pending');

    pendingExpenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(expense.date)}</td>
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td>${formatCurrency(expense.amount, expense.currency)}</td>
            <td>${formatDate(expense.submitted)}</td>
            <td>${expense.approver}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-light btn-sm view-expense-btn" data-id="${expense.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-light btn-sm edit-expense-btn" data-id="${expense.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm withdraw-expense-btn" data-id="${expense.id}">
                        <i class="fas fa-times"></i> Withdraw
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Add event listeners
    addExpenseActionListeners();
}

function renderHistoryExpenses() {
    const tbody = document.getElementById('history-expenses-list');
    tbody.innerHTML = '';

    const historyExpenses = employeeExpenses.filter(expense => 
        expense.status === 'approved' || expense.status === 'rejected'
    );

    historyExpenses.forEach(expense => {
        const actionDate = expense.status === 'approved' ? expense.approvedDate : expense.rejectedDate;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(expense.date)}</td>
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td>${formatCurrency(expense.amount, expense.currency)}</td>
            <td>
                <span class="badge badge-${expense.status}">${expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}</span>
            </td>
            <td>${actionDate ? formatDate(actionDate) : '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-light btn-sm view-expense-btn" data-id="${expense.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${expense.status === 'rejected' ? `
                    <button class="btn btn-light btn-sm edit-expense-btn" data-id="${expense.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    ` : ''}
                    <button class="btn btn-light btn-sm">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Add event listeners
    addExpenseActionListeners();
}

function addExpenseActionListeners() {
    // View expense details
    document.querySelectorAll('.view-expense-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const expenseId = parseInt(e.target.closest('button').getAttribute('data-id'));
            viewExpenseDetails(expenseId);
        });
    });

    // Edit expense
    document.querySelectorAll('.edit-expense-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const expenseId = parseInt(e.target.closest('button').getAttribute('data-id'));
            editExpense(expenseId);
        });
    });

    // Withdraw expense
    document.querySelectorAll('.withdraw-expense-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const expenseId = parseInt(e.target.closest('button').getAttribute('data-id'));
            withdrawExpense(expenseId);
        });
    });
}

function viewExpenseDetails(expenseId) {
    const expense = employeeExpenses.find(e => e.id === expenseId);
    if (expense) {
        document.getElementById('detail-description').textContent = expense.description;
        document.getElementById('detail-amount').textContent = formatCurrency(expense.amount, expense.currency);
        document.getElementById('detail-category').textContent = expense.category;
        document.getElementById('detail-date').textContent = formatDate(expense.date, true);
        document.getElementById('detail-status').innerHTML = `<span class="badge badge-${expense.status}">${expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}</span>`;
        document.getElementById('detail-submitted').textContent = formatDate(expense.submitted, true);
        document.getElementById('detail-notes').textContent = expense.notes;

        // Render timeline
        const timeline = document.getElementById('approval-timeline');
        timeline.innerHTML = '';
        
        expense.timeline.forEach(item => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.innerHTML = `
                <div class="timeline-date">${formatDate(item.date)}</div>
                <div class="timeline-content">${item.action}</div>
            `;
            timeline.appendChild(timelineItem);
        });

        // Show/hide timeline section based on status
        const timelineSection = document.getElementById('approval-timeline-section');
        timelineSection.style.display = expense.status === 'pending' ? 'block' : 'block';

        openModal('expense-detail-modal');
    }
}

function editExpense(expenseId) {
    const expense = employeeExpenses.find(e => e.id === expenseId);
    if (expense) {
        currentExpenseId = expenseId;
        
        document.getElementById('edit-expense-amount').value = expense.amount;
        document.getElementById('edit-expense-currency').value = expense.currency;
        document.getElementById('edit-expense-category').value = expense.category;
        document.getElementById('edit-expense-date').value = expense.date;
        document.getElementById('edit-expense-description').value = expense.description;
        
        openModal('edit-expense-modal');
    }
}

function withdrawExpense(expenseId) {
    const expense = employeeExpenses.find(e => e.id === expenseId);
    if (expense) {
        if (confirm(`Are you sure you want to withdraw the expense "${expense.description}"?`)) {
            // In a real application, you would make an API call here
            showNotification('success', 'Expense Withdrawn', 'Your expense has been withdrawn successfully.');
            
            // Remove from array (simulating API call)
            const index = employeeExpenses.findIndex(e => e.id === expenseId);
            if (index !== -1) {
                employeeExpenses.splice(index, 1);
            }
            
            // Refresh views
            renderRecentExpenses();
            renderPendingExpenses();
            updateDashboardStats();
        }
    }
}

function processReceiptOCR(file) {
    // Simulate OCR processing
    showNotification('warning', 'Processing Receipt', 'Extracting information from receipt...');
    
    setTimeout(() => {
        // Mock extracted data
        const mockData = {
            amount: (Math.random() * 200 + 10).toFixed(2),
            date: new Date().toISOString().split('T')[0],
            description: 'Business Lunch at Restaurant',
            category: 'Meals',
            merchant: 'Local Restaurant'
        };

        document.getElementById('expense-amount').value = mockData.amount;
        document.getElementById('expense-date').value = mockData.date;
        document.getElementById('expense-description').value = mockData.description;
        document.getElementById('expense-category').value = mockData.category;

        document.getElementById('ocr-results').style.display = 'block';
        document.getElementById('extracted-data').innerHTML = `
            <p><strong>Amount:</strong> ${formatCurrency(parseFloat(mockData.amount))}</p>
            <p><strong>Date:</strong> ${formatDate(mockData.date)}</p>
            <p><strong>Description:</strong> ${mockData.description}</p>
            <p><strong>Category:</strong> ${mockData.category}</p>
            <p><strong>Merchant:</strong> ${mockData.merchant}</p>
        `;

        showNotification('success', 'Receipt Processed', 'Information extracted successfully!');
    }, 2000);
}

function saveExpense() {
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const currency = document.getElementById('expense-currency').value;
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value;
    const description = document.getElementById('expense-description').value.trim();

    if (!amount || !category || !date || !description) {
        alert('Please fill in all required fields.');
        return;
    }

    // Create new expense
    const newExpense = {
        id: employeeExpenses.length + 1,
        description,
        category,
        amount,
        currency,
        date,
        submitted: new Date().toISOString().split('T')[0],
        status: 'pending',
        approver: 'Sarah Johnson (Manager)',
        notes: description,
        receipt: 'receipt_new.jpg',
        timeline: [
            { date: new Date().toISOString().split('T')[0], action: 'Expense submitted for approval' },
            { date: new Date().toISOString().split('T')[0], action: 'Forwarded to Sarah Johnson (Manager) for review' }
        ]
    };

    // Add to array (simulating API call)
    employeeExpenses.push(newExpense);

    showNotification('success', 'Expense Submitted', 'Your expense has been submitted for approval.');
    
    closeAllModals();
    
    // Refresh views
    renderRecentExpenses();
    renderPendingExpenses();
    updateDashboardStats();
}

function updateExpense() {
    if (!currentExpenseId) return;

    const amount = parseFloat(document.getElementById('edit-expense-amount').value);
    const currency = document.getElementById('edit-expense-currency').value;
    const category = document.getElementById('edit-expense-category').value;
    const date = document.getElementById('edit-expense-date').value;
    const description = document.getElementById('edit-expense-description').value.trim();

    if (!amount || !category || !date || !description) {
        alert('Please fill in all required fields.');
        return;
    }

    // Find and update expense
    const expenseIndex = employeeExpenses.findIndex(e => e.id === currentExpenseId);
    if (expenseIndex !== -1) {
        employeeExpenses[expenseIndex].amount = amount;
        employeeExpenses[expenseIndex].currency = currency;
        employeeExpenses[expenseIndex].category = category;
        employeeExpenses[expenseIndex].date = date;
        employeeExpenses[expenseIndex].description = description;
        employeeExpenses[expenseIndex].notes = description;

        // If it was rejected, change status back to pending
        if (employeeExpenses[expenseIndex].status === 'rejected') {
            employeeExpenses[expenseIndex].status = 'pending';
            employeeExpenses[expenseIndex].timeline.push({
                date: new Date().toISOString().split('T')[0],
                action: 'Resubmitted after edits'
            });
        }

        showNotification('success', 'Expense Updated', 'Your expense has been updated successfully.');
        
        closeAllModals();
        
        // Refresh views
        renderRecentExpenses();
        renderPendingExpenses();
        renderHistoryExpenses();
        updateDashboardStats();
    }
}

function updateDashboardStats() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = employeeExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
    
    const totalExpenses = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const pendingCount = monthlyExpenses.filter(e => e.status === 'pending').length;
    const approvedAmount = monthlyExpenses
        .filter(e => e.status === 'approved')
        .reduce((sum, exp) => sum + exp.amount, 0);
    const rejectedAmount = monthlyExpenses
        .filter(e => e.status === 'rejected')
        .reduce((sum, exp) => sum + exp.amount, 0);

    document.querySelector('.dashboard-card-value:nth-child(1)').textContent = formatCurrency(totalExpenses);
    document.querySelector('.dashboard-card-value:nth-child(2)').textContent = pendingCount;
    document.querySelector('.dashboard-card-value:nth-child(3)').textContent = formatCurrency(approvedAmount);
    document.querySelector('.dashboard-card-value:nth-child(4)').textContent = formatCurrency(rejectedAmount);
}

function filterRecentExpenses() {
    // In a real application, this would filter the data
    alert('Filter functionality would be implemented here');
}

function refreshPendingExpenses() {
    // In a real application, this would refresh from server
    renderPendingExpenses();
    showNotification('info', 'Refreshed', 'Pending expenses list has been updated.');
}

function exportHistory() {
    // In a real application, this would generate a CSV/PDF
    alert('Export functionality would be implemented here');
}

function filterHistory() {
    // In a real application, this would filter by date range
    alert('Date filter functionality would be implemented here');
}

function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function formatDate(dateString, full = false) {
    const date = new Date(dateString);
    if (full) {
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    return date.toISOString().split('T')[0];
}

function showNotification(type, title, message) {
    // In a real application, you would use a proper notification system
    alert(`${title}: ${message}`);
}