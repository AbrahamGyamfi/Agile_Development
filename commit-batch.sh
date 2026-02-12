#!/bin/bash

# Git Commit Batch Automation Script
# This script helps execute the commit strategy defined in GIT_COMMIT_STRATEGY.md

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

# Function to check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not a git repository. Please run this script from the project root."
        exit 1
    fi
}

# Function to check for uncommitted changes
check_clean_working_tree() {
    if ! git diff-index --quiet HEAD --; then
        print_warning "You have uncommitted changes. Please commit or stash them first."
        git status --short
        exit 1
    fi
}

# Function to create and checkout branch
create_feature_branch() {
    local branch_name=$1
    print_info "Creating feature branch: ${branch_name}"
    
    git checkout main
    git pull origin main
    git checkout -b "${branch_name}"
    
    print_success "Branch ${branch_name} created and checked out"
}

# Function to make a commit with conventional commit format
make_commit() {
    local type=$1
    local scope=$2
    local subject=$3
    local body=$4
    local footer=$5
    
    print_info "Staging changes..."
    git add .
    
    # Build commit message
    local commit_msg="${type}"
    if [ -n "${scope}" ]; then
        commit_msg="${commit_msg}(${scope})"
    fi
    commit_msg="${commit_msg}: ${subject}"
    
    if [ -n "${body}" ]; then
        commit_msg="${commit_msg}

${body}"
    fi
    
    if [ -n "${footer}" ]; then
        commit_msg="${commit_msg}

${footer}"
    fi
    
    print_info "Committing with message:"
    echo "${commit_msg}"
    echo ""
    
    git commit -m "${commit_msg}"
    print_success "Commit created successfully"
}

# Function to run pre-commit checks
run_checks() {
    print_info "Running pre-commit checks..."
    
    # Check for console.log in JS files
    if git diff --cached --name-only | grep -E '\.(js|jsx|ts|tsx)$' > /dev/null; then
        if git diff --cached | grep -E 'console\.(log|debug|info)' > /dev/null; then
            print_warning "Found console.log statements. Please remove debugging code."
            return 1
        fi
    fi
    
    # Check for secrets (basic check)
    if git diff --cached | grep -iE "(api[_-]?key|secret|password|token)[\"']?\s*[:=]\s*[\"'][^\"']+"> /dev/null; then
        print_error "Potential secrets detected in commit. Please remove sensitive data."
        return 1
    fi
    
    print_success "Pre-commit checks passed"
    return 0
}

# Function to run tests
run_tests() {
    local test_type=$1
    
    print_info "Running ${test_type} tests..."
    
    case $test_type in
        "frontend")
            if [ -f "Amplify_frontend/frontend/package.json" ]; then
                cd Amplify_frontend/frontend
                npm test -- --passWithNoTests
                cd ../..
            fi
            ;;
        "lambda")
            if [ -f "lambda/package.json" ]; then
                cd lambda
                npm test -- --passWithNoTests
                cd ..
            fi
            ;;
        "all")
            run_tests "frontend"
            run_tests "lambda"
            ;;
    esac
    
    print_success "${test_type} tests passed"
}

# Sprint 1 - Batch 1.1: Project Foundation
sprint1_batch1_1() {
    print_info "=== Sprint 1 - Batch 1.1: Project Foundation ==="
    create_feature_branch "feat/project-setup"
    
    print_warning "Please complete the following tasks before committing:"
    echo "1. Set up project structure"
    echo "2. Add .gitignore files"
    echo "3. Create README.md"
    echo "4. Add LICENSE file"
    read -p "Press Enter when ready to commit..."
    
    make_commit \
        "chore" \
        "" \
        "initialize project structure and documentation" \
        "- Create repository structure (lambda/, terraform/, Amplify_frontend/)
- Add .gitignore for Node.js, Python, and Terraform
- Create README.md with project overview
- Add LICENSE file
- Configure EditorConfig for consistent code style" \
        "Relates to Sprint 0"
}

# Sprint 1 - Batch 1.2: Authentication System
sprint1_batch1_2_commit1() {
    print_info "=== Sprint 1 - Batch 1.2: Authentication System - Commit 1 ==="
    
    print_warning "Complete the following tasks:"
    echo "1. Create Cognito User Pool Terraform module"
    echo "2. Configure password policy"
    echo "3. Set up user groups (Admin, Member)"
    read -p "Press Enter when ready to commit..."
    
    make_commit \
        "feat" \
        "auth" \
        "provision Cognito User Pool with Terraform" \
        "- Create Cognito User Pool with email auth
- Configure password policy (min 8 chars, complexity requirements)
- Set up email verification workflow
- Create Admin and Member user groups
- Add Lambda triggers for pre-signup and post-confirmation
- Define IAM roles and policies" \
        "Relates to US-001, US-002, US-003"
}

sprint1_batch1_2_commit2() {
    print_info "=== Sprint 1 - Batch 1.2: Authentication System - Commit 2 ==="
    
    print_warning "Complete the following tasks:"
    echo "1. Create pre-signup Lambda trigger"
    echo "2. Create post-confirmation Lambda"
    echo "3. Add unit tests"
    read -p "Press Enter when ready to commit..."
    
    run_tests "lambda"
    
    make_commit \
        "feat" \
        "auth" \
        "implement user registration Lambda function" \
        "- Create pre-signup Lambda trigger for validation
- Create post-confirmation Lambda for user initialization
- Implement email uniqueness validation
- Add user metadata storage in DynamoDB
- Implement comprehensive input validation
- Add error handling with appropriate status codes
- Add unit tests for all validation scenarios" \
        "Closes US-001"
}

sprint1_batch1_2_commit3() {
    print_info "=== Sprint 1 - Batch 1.2: Authentication System - Commit 3 ==="
    
    make_commit \
        "feat" \
        "auth" \
        "implement login flow with JWT tokens" \
        "- Configure Cognito hosted UI for login
- Implement JWT token generation and validation
- Add token refresh logic
- Configure session timeout (1 hour inactivity)
- Implement 'Remember Me' functionality (30 days)
- Add account lockout after 5 failed attempts
- Add integration tests for login flows" \
        "Closes US-002"
}

sprint1_batch1_2_commit4() {
    print_info "=== Sprint 1 - Batch 1.2: Authentication System - Commit 4 ==="
    
    make_commit \
        "feat" \
        "auth" \
        "implement RBAC with custom authorizer" \
        "- Create Lambda authorizer for API Gateway
- Implement role extraction from JWT claims
- Add role-based permission checks (Admin, Member)
- Define IAM policies per role
- Implement 403 Forbidden for unauthorized access
- Add role management endpoints (Admin only)
- Add comprehensive authorization tests" \
        "Closes US-003"
}

sprint1_batch1_2_commit5() {
    print_info "=== Sprint 1 - Batch 1.2: Authentication System - Commit 5 ==="
    
    run_tests "frontend"
    
    make_commit \
        "feat" \
        "frontend" \
        "integrate AWS Amplify authentication" \
        "- Configure AWS Amplify with Cognito User Pool
- Create login and registration UI components
- Implement protected routes with role checks
- Add token refresh logic
- Create useAuth hook for authentication state
- Add error handling and user feedback
- Style authentication pages with Material-UI" \
        "Relates to US-001, US-002, US-003"
}

# Sprint 1 - Batch 1.3: Core Task Management
sprint1_batch1_3_commit1() {
    print_info "=== Sprint 1 - Batch 1.3: Core Task Management - Commit 1 ==="
    
    make_commit \
        "feat" \
        "database" \
        "create DynamoDB schema for tasks" \
        "- Define Tasks table with primary key (taskId)
- Add GSI for querying by status
- Add GSI for querying by assignee
- Add GSI for querying by creator
- Configure on-demand billing
- Enable Point-in-Time Recovery (PITR)
- Add DynamoDB streams for notifications
- Deploy tables via Terraform" \
        "Relates to US-004, US-005, US-006"
}

sprint1_batch1_3_commit2() {
    print_info "=== Sprint 1 - Batch 1.3: Core Task Management - Commit 2 ==="
    
    run_tests "lambda"
    
    make_commit \
        "feat" \
        "tasks" \
        "implement create task Lambda function" \
        "- Create createTask Lambda with input validation
- Generate unique task ID (UUID)
- Set default status to 'TODO'
- Auto-assign creator as owner
- Store creation timestamp
- Return created task object
- Add JSON schema validation
- Add unit tests with mock DynamoDB" \
        "Closes US-004"
}

# Sprint 2 Batches would be defined similarly...

# Main menu
show_menu() {
    echo ""
    print_info "=== Git Commit Batch Automation ==="
    echo ""
    echo "Sprint 1 Batches:"
    echo "  1) Batch 1.1 - Project Foundation (1 commit)"
    echo "  2) Batch 1.2 - Authentication System (5 commits)"
    echo "  3) Batch 1.3 - Core Task Management (6 commits)"
    echo ""
    echo "Sprint 2 Batches:"
    echo "  4) Batch 2.1 - Task Lifecycle (5 commits)"
    echo "  5) Batch 2.2 - Notification System (4 commits)"
    echo "  6) Batch 2.3 - Monitoring & Observability (5 commits)"
    echo "  7) Batch 2.4 - Deployment Automation (3 commits)"
    echo ""
    echo "Individual Commits:"
    echo "  11) Sprint 1 - Batch 1.2 - Commit 1 (Cognito Infrastructure)"
    echo "  12) Sprint 1 - Batch 1.2 - Commit 2 (User Registration)"
    echo "  13) Sprint 1 - Batch 1.2 - Commit 3 (User Login)"
    echo "  14) Sprint 1 - Batch 1.2 - Commit 4 (RBAC)"
    echo "  15) Sprint 1 - Batch 1.2 - Commit 5 (Frontend Auth)"
    echo "  21) Sprint 1 - Batch 1.3 - Commit 1 (DynamoDB Schema)"
    echo "  22) Sprint 1 - Batch 1.3 - Commit 2 (Create Task)"
    echo ""
    echo "Utilities:"
    echo "  90) Run pre-commit checks only"
    echo "  91) Run tests only"
    echo "  98) Push current branch"
    echo "  99) View commit history"
    echo "  0) Exit"
    echo ""
}

# Main execution
main() {
    check_git_repo
    
    while true; do
        show_menu
        read -p "Select an option: " choice
        
        case $choice in
            1)
                sprint1_batch1_1
                ;;
            11)
                sprint1_batch1_2_commit1
                ;;
            12)
                sprint1_batch1_2_commit2
                ;;
            13)
                sprint1_batch1_2_commit3
                ;;
            14)
                sprint1_batch1_2_commit4
                ;;
            15)
                sprint1_batch1_2_commit5
                ;;
            21)
                sprint1_batch1_3_commit1
                ;;
            22)
                sprint1_batch1_3_commit2
                ;;
            90)
                run_checks
                ;;
            91)
                print_info "Select test suite:"
                echo "1) Frontend"
                echo "2) Lambda"
                echo "3) All"
                read -p "Choice: " test_choice
                case $test_choice in
                    1) run_tests "frontend" ;;
                    2) run_tests "lambda" ;;
                    3) run_tests "all" ;;
                esac
                ;;
            98)
                current_branch=$(git branch --show-current)
                print_info "Pushing ${current_branch} to origin..."
                git push origin "${current_branch}"
                print_success "Branch pushed successfully"
                ;;
            99)
                git log --oneline --graph --decorate --all -20
                ;;
            0)
                print_info "Exiting..."
                exit 0
                ;;
            *)
                print_error "Invalid option. Please try again."
                ;;
        esac
    done
}

# Run main function
main