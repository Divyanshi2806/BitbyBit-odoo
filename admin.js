// Sample data for the admin dashboard
const adminData = {
    users: [
        {
            id: 1,
            name: "John Doe",
            email: "john.doe@company.com",
            role: "employee",
            department: "Engineering",
            manager: "Sarah Johnson",
            status: "active",
            joinDate: "2023-01-15"
        },
        {
            id: 2,
            name: "Sarah Johnson",
            email: "sarah.j@company.com",
            role: "manager",
            department: "Engineering",
            manager: "",
            status: "active",
            joinDate: "2022-05-20"
        },
        {
            id: 3,
            name: "Mike Wilson",
            email: "mike.w@company.com",
            role: "admin",
            department: "IT",
            manager: "",
            status: "active",
            joinDate: "2021-11-10"
        },
        {
            id: 4,
            name: "Emily Chen",
            email: "emily.c@company.com",
            role: "employee",
            department: "Marketing",
            manager: "Robert Brown",
            status: "active",
            joinDate: "2023-03-22"
        },
        {
            id: 5,
            name: "Robert Brown",
            email: "robert.b@company.com",
            role: "manager",
            department: "Marketing",
            manager: "",
            status: "active",
            joinDate: "2022-08-14"
        }
    ],
    expenses: [
        {
            id: 1,
            employee: "John Doe",
            description: "Client Dinner Meeting",
            category: "Meals & Entertainment",
            amount: 125.50,
            currency: "USD",
            date: "2024-01-15",
            status: "approved",
            approver: "Sarah Johnson",
            approvedDate: "2024-01-16"
        },
        {
            id: 2,
            employee: "Emily Chen",
            description: "Conference Registration",
            category: "Professional Development",
            amount: 450.00,
            currency: "USD",
            date: "2024-01-14",
            status: "pending",
            approver: "Robert Brown",
            submittedDate: "2024-01-15"
        },
        {
            id: 3,
            employee: "John Doe",
            description: "Flight to San Francisco",
            category: "Travel",
            amount: 320.00,
            currency: "USD",
            date: "2024-01-10",
            status: "approved",
            approver: "Sarah Johnson",
            approvedDate: "2024-01-11"
        },
        {
            id: 4,
            employee: "Mike Wilson",
            description: "Software License",
            category: "Software",
            amount: 1200.00,
            currency: "USD",
            date: "2024-01-08",
            status: "rejected",
            approver: "Admin",
            rejectedDate: "2024-01-09",
            rejectionReason: "Exceeds department budget"
        }
    ],
    workflowRules: [
        {
            id: 1,
            name: "Standard Approval",
            type: "multi-level",
            steps: ["Manager", "Finance"],
            conditions: [],
            isActive: true
        },
        {
            id: 2,
            name: "High Value Approval",
            type: "conditional",
            steps: ["Manager", "Director", "CFO"],
            conditions: ["amount > 1000"],
            isActive: true
        }
    ],
    activity: [
        {
            id: 1,
            type: "user_created",
            title: "New user created",
            description: "Emily Chen was added to the system",
            time: "2024-01-15 14:30",
            user: "Admin User"
        },
        {
            id: 2,
            type: "expense_approved",
            title: "Expense approved",
            description: "Flight expense for John Doe was approved",
            time: "2024-01-15 11:15",
            user: "Sarah Johnson"
        },
        {
            id: 3,
            type: "expense_rejected",
            title: "Expense rejected",
            description: "Software license expense was rejected",
            time: "2024-01-15 09:45",
            user: "Admin User"
        },
        {
            id: 4,
            type: "workflow_updated",
            title: "Workflow updated",
            description: "High value approval workflow was modified",
            time: "2024-01-14 16:20",
            user: "Admin User"
        }
    ]
};

// DOM Elements
const modals = document.querySelectorAll('.modal');
const closeModalButtons = document.querySelectorAll('.close-modal');
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const pages = document.querySelectorAll('.page');

// Current state
let currentPage = 'dashboard';
let currentEditingUserId = null;

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    bindEvents();
    loadDashboardData();
    renderUsersTable();
    renderExpensesTable();
    renderWorkflowRules();
    renderRecentActivity();
});

function initializeDashboard() {
    // Set default page
    switchPage('dashboard');
}

function bindEvents() {
    // Sidebar navigation
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            switchPage(page);
        });
    });

    // Modal handling
    document.getElementById('add-user-btn').addEventListener('click', () => {
        openModal('add-user-modal');
        populateManagersDropdown();
    });

    document.getElementById('add-user-quick-btn').addEventListener('click', () => {
        openModal('add-user-modal');
        populateManagersDropdown();
    });

    document.getElementById('create-workflow-btn').addEventListener('click', () => {
        openModal('create-workflow-modal');
    });

    document.getElementById('save-user-btn').addEventListener('click', saveUser);
    document.getElementById('save-workflow-btn').addEventListener('click', saveWorkflow);

    // Quick actions
    document.getElementById('view-reports-btn').addEventListener('click', () => switchPage('reports'));
    document.getElementById('manage-workflow-btn').addEventListener('click', () => switchPage('approvals'));
    document.getElementById('system-settings-btn').addEventListener('click', () => switchPage('settings'));

    // Close modals
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

    // Approval type radio buttons
    document.querySelectorAll('input[name="approval-type"]').forEach(radio => {
        radio.addEventListener('change', handleApprovalTypeChange);
    });

    // Add approval step
    document.getElementById('add-approval-step').addEventListener('click', addApprovalStep);

    // Search functionality
    document.getElementById('user-search').addEventListener('input', handleUserSearch);

    // Filter functionality
    document.getElementById('status-filter').addEventListener('change', filterExpenses);
    document.getElementById('date-filter').addEventListener('change', filterExpenses);

    // Danger zone actions
    document.getElementById('reset-data-btn').addEventListener('click', confirmResetData);
    document.getElementById('export-backup-btn').addEventListener('click', exportBackup);
}

function switchPage(pageName) {
    // Update active states
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });

    // Show/hide pages
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === `${pageName}-page`) {
            page.classList.add('active');
        }
    });

    currentPage = pageName;
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
    document.getElementById('workflow-form').reset();
    currentEditingUserId = null;
}

function loadDashboardData() {
    // Update dashboard stats
    document.getElementById('total-users').textContent = adminData.users.length;
    
    const pendingExpenses = adminData.expenses.filter(exp => exp.status === 'pending').length;
    document.getElementById('pending-expenses').textContent = pendingExpenses;
    
    const approvedAmount = adminData.expenses
        .filter(exp => exp.status === 'approved')
        .reduce((sum, exp) => sum + exp.amount, 0);
    document.getElementById('approved-amount').textContent = `$${approvedAmount.toFixed(2)}`;
    
    const rejectedAmount = adminData.expenses
        .filter(exp => exp.status === 'rejected')
        .reduce((sum, exp) => sum + exp.amount, 0);
    document.getElementById('rejected-amount').textContent = `$${rejectedAmount.toFixed(2)}`;
}

function renderUsersTable() {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '';

    adminData.users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="user-avatar" style="width: 30px; height: 30px; display: inline-flex; margin-right: 8px;">
                    ${user.name.split(' ').map(n => n[0]).join('')}
                </div>
                ${user.name}
            </td>
            <td>${user.email}</td>
            <td>
                <span class="role-badge role-${user.role}">
                    ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
            </td>
            <td>${user.department}</td>
            <td>${user.manager || '-'}</td>
            <td>
                <span class="badge badge-success">Active</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-light btn-sm edit-user-btn" data-id="${user.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-light btn-sm change-role-btn" data-id="${user.id}">
                        <i class="fas fa-user-cog"></i>
                    </button>
                    <button class="btn btn-danger btn-sm delete-user-btn" data-id="${user.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Add event listeners to action buttons
    addUserActionListeners();
}

function renderExpensesTable() {
    const tbody = document.getElementById('expenses-table-body');
    tbody.innerHTML = '';

    adminData.expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.employee}</td>
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>${formatDate(expense.date)}</td>
            <td>
                <span class="badge badge-${expense.status}">
                    ${expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                </span>
            </td>
            <td>${expense.approver}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-light btn-sm view-expense-btn" data-id="${expense.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${expense.status === 'pending' ? `
                    <button class="btn btn-success btn-sm approve-expense-btn" data-id="${expense.id}">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-danger btn-sm reject-expense-btn" data-id="${expense.id}">
                        <i class="fas fa-times"></i>
                    </button>
                    ` : ''}
                    <button class="btn btn-light btn-sm export-expense-btn" data-id="${expense.id}">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Add event listeners to expense action buttons
    addExpenseActionListeners();
}

function renderWorkflowRules() {
    const container = document.getElementById('workflow-rules');
    container.innerHTML = '';

    adminData.workflowRules.forEach(rule => {
        const ruleElement = document.createElement('div');
        ruleElement.className = 'workflow-rule';
        ruleElement.innerHTML = `
            <div class="rule-header">
                <h4>${rule.name}</h4>
                <span class="badge ${rule.isActive ? 'badge-success' : 'badge-secondary'}">
                    ${rule.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
            <div class="rule-details">
                <p><strong>Type:</strong> ${rule.type.replace('-', ' ')}</p>
                <p><strong>Steps:</strong> ${rule.steps.join(' → ')}</p>
                ${rule.conditions.length > 0 ? `
                    <p><strong>Conditions:</strong> ${rule.conditions.join(', ')}</p>
                ` : ''}
            </div>
            <div class="rule-actions">
                <button class="btn btn-light btn-sm edit-rule-btn" data-id="${rule.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-light btn-sm toggle-rule-btn" data-id="${rule.id}">
                    <i class="fas fa-power-off"></i> ${rule.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button class="btn btn-danger btn-sm delete-rule-btn" data-id="${rule.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        container.appendChild(ruleElement);
    });
}

function renderRecentActivity() {
    const container = document.getElementById('recent-activity');
    container.innerHTML = '';

    adminData.activity.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas fa-${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-time">${formatDateTime(activity.time)} • By ${activity.user}</div>
            </div>
        `;
        container.appendChild(activityItem);
    });
}

function getActivityIcon(type) {
    const icons = {
        'user_created': 'user-plus',
        'expense_approved': 'check-circle',
        'expense_rejected': 'times-circle',
        'workflow_updated': 'sitemap'
    };
    return icons[type] || 'bell';
}

function populateManagersDropdown() {
    const select = document.getElementById('new-user-manager');
    select.innerHTML = '<option value="">Select Manager</option>';
    
    const managers = adminData.users.filter(user => user.role === 'manager');
    managers.forEach(manager => {
        const option = document.createElement('option');
        option.value = manager.id;
        option.textContent = manager.name;
        select.appendChild(option);
    });
}

function saveUser() {
    const name = document.getElementById('new-user-name').value.trim();
    const email = document.getElementById('new-user-email').value.trim();
    const role = document.getElementById('new-user-role').value;
    const department = document.getElementById('new-user-department').value;
    const managerId = document.getElementById('new-user-manager').value;

    if (!name || !email || !role || !department) {
        alert('Please fill in all required fields.');
        return;
    }

    const manager = managerId ? adminData.users.find(u => u.id == managerId) : null;

    // Create new user
    const newUser = {
        id: adminData.users.length + 1,
        name,
        email,
        role,
        department,
        manager: manager ? manager.name : '',
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0]
    };

    adminData.users.push(newUser);

    // Add activity
    adminData.activity.unshift({
        id: adminData.activity.length + 1,
        type: 'user_created',
        title: 'New user created',
        description: `${name} was added to the system`,
        time: new Date().toISOString().replace('T', ' ').substring(0, 16),
        user: 'Admin User'
    });

    showNotification('success', 'User Created', `${name} has been added successfully.`);
    
    closeAllModals();
    
    // Refresh data
    loadDashboardData();
    renderUsersTable();
    renderRecentActivity();
}

function saveWorkflow() {
    const name = document.getElementById('workflow-name').value.trim();
    const description = document.getElementById('workflow-description').value.trim();
    const type = document.getElementById('workflow-type').value;

    if (!name) {
        alert('Please enter a workflow name.');
        return;
    }

    // Create new workflow
    const newWorkflow = {
        id: adminData.workflowRules.length + 1,
        name,
        type,
        steps: ['Manager'],
        conditions: [],
        isActive: true
    };

    adminData.workflowRules.push(newWorkflow);

    // Add activity
    adminData.activity.unshift({
        id: adminData.activity.length + 1,
        type: 'workflow_updated',
        title: 'Workflow created',
        description: `${name} workflow was created`,
        time: new Date().toISOString().replace('T', ' ').substring(0, 16),
        user: 'Admin User'
    });

    showNotification('success', 'Workflow Created', `${name} has been created successfully.`);
    
    closeAllModals();
    
    // Refresh data
    renderWorkflowRules();
    renderRecentActivity();
}

function handleApprovalTypeChange(e) {
    const type = e.target.value;
    const multiLevelConfig = document.getElementById('multi-level-config');
    const conditionalConfig = document.getElementById('conditional-config');

    if (type === 'multi-level') {
        multiLevelConfig.style.display = 'block';
        conditionalConfig.style.display = 'none';
    } else if (type === 'conditional') {
        multiLevelConfig.style.display = 'none';
        conditionalConfig.style.display = 'block';
    } else {
        multiLevelConfig.style.display = 'none';
        conditionalConfig.style.display = 'none';
    }
}

function addApprovalStep() {
    const stepsContainer = document.getElementById('approval-steps');
    const stepCount = stepsContainer.children.length + 1;

    const stepElement = document.createElement('div');
    stepElement.className = 'approval-step';
    stepElement.innerHTML = `
        <div class="step-number">${stepCount}</div>
        <select class="form-control">
            <option value="manager">Manager</option>
            <option value="finance">Finance</option>
            <option value="director">Director</option>
            <option value="cfo">CFO</option>
        </select>
        <button class="btn btn-danger btn-sm remove-step">
            <i class="fas fa-times"></i>
        </button>
    `;
    stepsContainer.appendChild(stepElement);

    // Add event listener to remove button
    stepElement.querySelector('.remove-step').addEventListener('click', function() {
        stepsContainer.removeChild(stepElement);
        // Re-number remaining steps
        const steps = stepsContainer.querySelectorAll('.approval-step');
        steps.forEach((step, index) => {
            step.querySelector('.step-number').textContent = index + 1;
        });
    });
}

function handleUserSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#users-table-body tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function filterExpenses() {
    const statusFilter = document.getElementById('status-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    
    // In a real application, you would filter the data and re-render the table
    console.log('Filtering expenses by:', { statusFilter, dateFilter });
    // For now, we'll just show a notification
    showNotification('info', 'Filter Applied', 'Expenses have been filtered according to your criteria.');
}

function addUserActionListeners() {
    // Edit user
    document.querySelectorAll('.edit-user-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const userId = parseInt(e.target.closest('button').getAttribute('data-id'));
            editUser(userId);
        });
    });

    // Change role
    document.querySelectorAll('.change-role-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const userId = parseInt(e.target.closest('button').getAttribute('data-id'));
            changeUserRole(userId);
        });
    });

    // Delete user
    document.querySelectorAll('.delete-user-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const userId = parseInt(e.target.closest('button').getAttribute('data-id'));
            deleteUser(userId);
        });
    });
}

function addExpenseActionListeners() {
    // View expense
    document.querySelectorAll('.view-expense-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const expenseId = parseInt(e.target.closest('button').getAttribute('data-id'));
            viewExpense(expenseId);
        });
    });

    // Approve expense
    document.querySelectorAll('.approve-expense-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const expenseId = parseInt(e.target.closest('button').getAttribute('data-id'));
            approveExpense(expenseId);
        });
    });

    // Reject expense
    document.querySelectorAll('.reject-expense-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const expenseId = parseInt(e.target.closest('button').getAttribute('data-id'));
            rejectExpense(expenseId);
        });
    });
}

function editUser(userId) {
    const user = adminData.users.find(u => u.id === userId);
    if (user) {
        // Populate edit form and open modal
        document.getElementById('new-user-name').value = user.name;
        document.getElementById('new-user-email').value = user.email;
        document.getElementById('new-user-role').value = user.role;
        document.getElementById('new-user-department').value = user.department;
        
        currentEditingUserId = userId;
        openModal('add-user-modal');
        populateManagersDropdown();
        
        showNotification('info', 'Edit Mode', `Editing user: ${user.name}`);
    }
}

function changeUserRole(userId) {
    const user = adminData.users.find(u => u.id === userId);
    if (user) {
        const newRole = prompt(`Change role for ${user.name} (current: ${user.role}):\nEnter 'employee', 'manager', or 'admin'`);
        
        if (newRole && ['employee', 'manager', 'admin'].includes(newRole.toLowerCase())) {
            user.role = newRole.toLowerCase();
            
            // Add activity
            adminData.activity.unshift({
                id: adminData.activity.length + 1,
                type: 'user_updated',
                title: 'User role changed',
                description: `${user.name}'s role changed to ${newRole}`,
                time: new Date().toISOString().replace('T', ' ').substring(0, 16),
                user: 'Admin User'
            });

            showNotification('success', 'Role Updated', `${user.name}'s role has been updated to ${newRole}.`);
            renderUsersTable();
            renderRecentActivity();
        }
    }
}

function deleteUser(userId) {
    const user = adminData.users.find(u => u.id === userId);
    if (user && confirm(`Are you sure you want to delete user ${user.name}? This action cannot be undone.`)) {
        adminData.users = adminData.users.filter(u => u.id !== userId);
        
        // Add activity
        adminData.activity.unshift({
            id: adminData.activity.length + 1,
            type: 'user_deleted',
            title: 'User deleted',
            description: `${user.name} was removed from the system`,
            time: new Date().toISOString().replace('T', ' ').substring(0, 16),
            user: 'Admin User'
        });

        showNotification('warning', 'User Deleted', `${user.name} has been removed from the system.`);
        loadDashboardData();
        renderUsersTable();
        renderRecentActivity();
    }
}

function viewExpense(expenseId) {
    const expense = adminData.expenses.find(e => e.id === expenseId);
    if (expense) {
        // In a real application, you would show a detailed view modal
        alert(`Expense Details:\n\nEmployee: ${expense.employee}\nDescription: ${expense.description}\nAmount: $${expense.amount}\nStatus: ${expense.status}\nDate: ${expense.date}`);
    }
}

function approveExpense(expenseId) {
    const expense = adminData.expenses.find(e => e.id === expenseId);
    if (expense) {
        expense.status = 'approved';
        expense.approvedDate = new Date().toISOString().split('T')[0];
        
        // Add activity
        adminData.activity.unshift({
            id: adminData.activity.length + 1,
            type: 'expense_approved',
            title: 'Expense approved',
            description: `${expense.description} for ${expense.employee} was approved`,
            time: new Date().toISOString().replace('T', ' ').substring(0, 16),
            user: 'Admin User'
        });

        showNotification('success', 'Expense Approved', `Expense from ${expense.employee} has been approved.`);
        renderExpensesTable();
        renderRecentActivity();
        loadDashboardData();
    }
}

function rejectExpense(expenseId) {
    const expense = adminData.expenses.find(e => e.id === expenseId);
    if (expense) {
        const reason = prompt('Please provide a reason for rejection:');
        if (reason !== null) {
            expense.status = 'rejected';
            expense.rejectedDate = new Date().toISOString().split('T')[0];
            expense.rejectionReason = reason;
            
            // Add activity
            adminData.activity.unshift({
                id: adminData.activity.length + 1,
                type: 'expense_rejected',
                title: 'Expense rejected',
                description: `${expense.description} for ${expense.employee} was rejected`,
                time: new Date().toISOString().replace('T', ' ').substring(0, 16),
                user: 'Admin User'
            });

            showNotification('warning', 'Expense Rejected', `Expense from ${expense.employee} has been rejected.`);
            renderExpensesTable();
            renderRecentActivity();
            loadDashboardData();
        }
    }
}

function confirmResetData() {
    if (confirm('Are you sure you want to reset all system data? This action cannot be undone and will delete all expenses and user configurations.')) {
        showNotification('danger', 'Data Reset', 'All system data has been reset. (This is a demo - no actual data was modified)');
    }
}

function exportBackup() {
    showNotification('success', 'Backup Exported', 'System backup has been downloaded successfully. (This is a demo)');
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US');
}

function formatDateTime(dateTimeString) {
    return new Date(dateTimeString.replace(' ', 'T')).toLocaleString('en-US');
}

function showNotification(type, title, message) {
    // In a real application, you would use a proper notification system
    alert(`${title}: ${message}`);
}