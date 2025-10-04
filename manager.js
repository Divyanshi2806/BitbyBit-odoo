// Sample data
const sampleExpenses = [
    {
        id: 1,
        employee: { name: "Sarah Singh", avatar: "SJ" },
        description: "Client Dinner Meeting",
        category: "Meals & Entertainment",
        amount: 125.50,
        date: "2025-09-28",
        status: "pending",
        notes: "Business dinner with potential client from ABC Corp to discuss partnership opportunities."
    },
    {
        id: 2,
        employee: { name: "Jay Mehta", avatar: "MJ" },
        description: "Flight to Conference",
        category: "Travel",
        amount: 450.00,
        date: "2025-09-26",
        status: "pending",
        notes: "Round-trip flight to annual industry conference in San Francisco."
    },
    {
        id: 3,
        employee: { name: "Jay Mehta", avatar: "ER" },
        description: "Office Supplies",
        category: "Office Expenses",
        amount: 85.25,
        date: "2025-09-25",
        status: "pending",
        notes: "Purchase of office stationery and printer supplies."
    }
];

const sampleUsers = [
    {
        id: 1,
        name: "Sarah Singh",
        email: "sarah.j@example.com",
        role: "employee",
        department: "Sales",
        status: "active"
    },
    {
        id: 2,
        name: "Jay Mehta",
        email: "mike.j@example.com",
        role: "employee",
        department: "Marketing",
        status: "active"
    },
    {
        id: 3,
        name: "Neha Rai",
        email: "emily.r@example.com",
        role: "manager",
        department: "Engineering",
        status: "active"
    }
];

const sampleReports = [
    {
        id: "EXP-2025-089",
        employee: "Sarah Singh",
        period: "Sep 2025",
        totalAmount: 1245.50,
        status: "approved",
        submitted: "2025-09-30"
    },
    {
        id: "EXP-2025-088",
        employee: "Jay Mehta",
        period: "Sep 2025",
        totalAmount: 845.75,
        status: "pending",
        submitted: "2025-09-28"
    },
    {
        id: "EXP-2025-087",
        employee: "Neha Rai",
        period: "Sep 2025",
        totalAmount: 560.30,
        status: "rejected",
        submitted: "2025-09-25"
    }
];

// DOM Elements
const modals = document.querySelectorAll('.modal');
const closeModalButtons = document.querySelectorAll('.close-modal');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Current expense being processed
let currentExpenseId = null;

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    bindEvents();
});

function initializeDashboard() {
    renderApprovalQueue();
    renderUsersList();
    renderReportsList();
}

function bindEvents() {
    // Tab Switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.getAttribute('data-tab'));
        });
    });

    // Modal Handling
    document.getElementById('add-user-btn').addEventListener('click', () => {
        openModal('add-user-modal');
    });

    document.getElementById('save-user-btn').addEventListener('click', saveUser);
    document.getElementById('confirm-reject-btn').addEventListener('click', confirmRejection);

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
    document.getElementById('add-user-form').reset();
    document.getElementById('rejection-reason').value = '';
    currentExpenseId = null;
}

function renderApprovalQueue() {
    const tbody = document.getElementById('approval-queue');
    tbody.innerHTML = '';

    sampleExpenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="user-avatar" style="width: 30px; height: 30px; display: inline-flex; margin-right: 8px;">${expense.employee.avatar}</div>
                ${expense.employee.name}
            </td>
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>${formatDate(expense.date)}</td>
            <td>
                <span class="badge badge-pending">Pending</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-success btn-sm approve-btn" data-id="${expense.id}">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn btn-danger btn-sm reject-btn" data-id="${expense.id}">
                        <i class="fas fa-times"></i> Reject
                    </button>
                    <button class="btn btn-light btn-sm view-btn" data-id="${expense.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Add event listeners to action buttons
    document.querySelectorAll('.approve-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const expenseId = parseInt(e.target.closest('button').getAttribute('data-id'));
            approveExpense(expenseId);
        });
    });

    document.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const expenseId = parseInt(e.target.closest('button').getAttribute('data-id'));
            openRejectionModal(expenseId);
        });
    });

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const expenseId = parseInt(e.target.closest('button').getAttribute('data-id'));
            viewExpenseDetails(expenseId);
        });
    });
}

function renderUsersList() {
    const tbody = document.getElementById('users-list');
    tbody.innerHTML = '';

    sampleUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="user-avatar" style="width: 30px; height: 30px; display: inline-flex; margin-right: 8px;">${user.name.split(' ').map(n => n[0]).join('')}</div>
                ${user.name}
            </td>
            <td>${user.email}</td>
            <td>
                <span class="role-badge role-${user.role}">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
            </td>
            <td>${user.department}</td>
            <td>
                <span class="status-dot status-approved"></span>
                Active
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-light btn-sm edit-user-btn" data-id="${user.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-light btn-sm change-role-btn" data-id="${user.id}">
                        <i class="fas fa-user-cog"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderReportsList() {
    const tbody = document.getElementById('reports-list');
    tbody.innerHTML = '';

    sampleReports.forEach(report => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${report.id}</td>
            <td>${report.employee}</td>
            <td>${report.period}</td>
            <td>$${report.totalAmount.toFixed(2)}</td>
            <td>
                <span class="badge badge-${report.status}">${report.status.charAt(0).toUpperCase() + report.status.slice(1)}</span>
            </td>
            <td>${formatDate(report.submitted)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-light btn-sm">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-light btn-sm">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function approveExpense(expenseId) {
    const expense = sampleExpenses.find(e => e.id === expenseId);
    if (expense) {
        if (confirm(`Approve expense of $${expense.amount.toFixed(2)} from ${expense.employee.name}?`)) {
            // In a real application, you would make an API call here
            showNotification('success', 'Expense Approved', `Expense from ${expense.employee.name} has been approved successfully.`);
            
            // Update UI
            const row = document.querySelector(`.approve-btn[data-id="${expenseId}"]`).closest('tr');
            row.cells[5].innerHTML = '<span class="badge badge-approved">Approved</span>';
            row.cells[6].innerHTML = '<button class="btn btn-light btn-sm"><i class="fas fa-eye"></i></button>';
            
            // Update dashboard stats
            updateDashboardStats();
        }
    }
}

function openRejectionModal(expenseId) {
    currentExpenseId = expenseId;
    openModal('rejection-modal');
}

function confirmRejection() {
    const reason = document.getElementById('rejection-reason').value.trim();
    if (!reason) {
        alert('Please provide a reason for rejection.');
        return;
    }

    const expense = sampleExpenses.find(e => e.id === currentExpenseId);
    if (expense) {
        // In a real application, you would make an API call here
        showNotification('warning', 'Expense Rejected', `Expense from ${expense.employee.name} has been rejected.`);
        
        // Update UI
        const row = document.querySelector(`.reject-btn[data-id="${currentExpenseId}"]`).closest('tr');
        row.cells[5].innerHTML = '<span class="badge badge-rejected">Rejected</span>';
        row.cells[6].innerHTML = '<button class="btn btn-light btn-sm"><i class="fas fa-eye"></i></button>';
        
        closeAllModals();
        
        // Update dashboard stats
        updateDashboardStats();
    }
}

function viewExpenseDetails(expenseId) {
    const expense = sampleExpenses.find(e => e.id === expenseId);
    if (expense) {
        document.getElementById('detail-employee').textContent = expense.employee.name;
        document.getElementById('detail-description').textContent = expense.description;
        document.getElementById('detail-category').textContent = expense.category;
        document.getElementById('detail-amount').textContent = `$${expense.amount.toFixed(2)}`;
        document.getElementById('detail-date').textContent = formatDate(expense.date, true);
        document.getElementById('detail-notes').textContent = expense.notes;
        
        openModal('expense-detail-modal');
    }
}

function saveUser() {
    const name = document.getElementById('user-name').value.trim();
    const email = document.getElementById('user-email').value.trim();
    const role = document.getElementById('user-role').value;
    const department = document.getElementById('user-department').value;

    if (!name || !email || !role || !department) {
        alert('Please fill in all fields.');
        return;
    }

    // In a real application, you would make an API call here
    showNotification('success', 'User Added', `${name} has been added to the system successfully.`);
    
    closeAllModals();
    
    // Refresh users list
    renderUsersList();
    updateDashboardStats();
}

function updateDashboardStats() {
    // In a real application, you would fetch updated stats from the server
    const pendingCount = sampleExpenses.filter(e => e.status === 'pending').length;
    document.querySelector('.dashboard-card-value:nth-child(2)').textContent = pendingCount;
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

// Role change functionality (placeholder)
document.addEventListener('click', function(e) {
    if (e.target.closest('.change-role-btn')) {
        const userId = e.target.closest('.change-role-btn').getAttribute('data-id');
        const user = sampleUsers.find(u => u.id === parseInt(userId));
        if (user) {
            const newRole = prompt(`Change role for ${user.name} (current: ${user.role}):\nEnter 'employee', 'manager', or 'admin'`);
            if (newRole && ['employee', 'manager', 'admin'].includes(newRole.toLowerCase())) {
                // In a real application, you would make an API call here
                showNotification('success', 'Role Updated', `${user.name}'s role has been updated to ${newRole}.`);
                renderUsersList();
            }
        }
    }
});