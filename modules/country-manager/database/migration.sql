-- CM-MODULE: Database Migration for Country Manager Module
-- This script runs additive-only migrations to support the Level 2 hierarchy and operations.
-- All columns are nullable with DEFAULT NULL.

-- Create country_managers profile table
CREATE TABLE IF NOT EXISTS `country_managers` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NULL DEFAULT NULL UNIQUE,
  `employee_code` VARCHAR(50) NULL DEFAULT NULL UNIQUE,
  `full_name` VARCHAR(255) NULL DEFAULT NULL,
  `mobile_number` VARCHAR(15) NULL DEFAULT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `profile_photo_url` VARCHAR(500) NULL DEFAULT NULL,
  
  -- Assignment
  `assigned_country_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `assigned_country_name` VARCHAR(100) NULL DEFAULT NULL,
  
  -- Personal Info
  `residential_address` TEXT NULL DEFAULT NULL,
  `aadhaar_number` VARCHAR(16) NULL DEFAULT NULL,
  `pan_number` VARCHAR(12) NULL DEFAULT NULL,
  
  -- Employment Info
  `department` VARCHAR(100) NULL DEFAULT 'Sales',
  `designation` VARCHAR(100) NULL DEFAULT 'Country Manager',
  `reporting_to` BIGINT UNSIGNED NULL DEFAULT NULL,
  `joining_date` DATE NULL DEFAULT NULL,
  `salary_structure` DECIMAL(12,2) NULL DEFAULT NULL,
  `bank_account_number` VARCHAR(50) NULL DEFAULT NULL,
  `bank_ifsc` VARCHAR(20) NULL DEFAULT NULL,
  `bank_name` VARCHAR(100) NULL DEFAULT NULL,
  
  -- Status
  `status` ENUM('Active','Inactive','Suspended') NULL DEFAULT 'Active',
  
  `created_by` BIGINT UNSIGNED NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL
);

-- Create state assignment mappings for State Managers under Country Managers
CREATE TABLE IF NOT EXISTS `cm_state_assignments` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `country_manager_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `state_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `state_name` VARCHAR(100) NULL DEFAULT NULL,
  `state_manager_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `assigned_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `assigned_by` BIGINT UNSIGNED NULL DEFAULT NULL,
  `is_active` TINYINT(1) NULL DEFAULT 1,
  `removed_at` TIMESTAMP NULL DEFAULT NULL,
  UNIQUE KEY `uq_cm_state` (`country_manager_id`, `state_id`)
);

-- Create territory aggregated performance snapshots
CREATE TABLE IF NOT EXISTS `cm_territory_performance` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `country_manager_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `country_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `state_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `city_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `period_type` ENUM('Daily','Weekly','Monthly','Quarterly','Yearly') NULL DEFAULT NULL,
  `period_label` VARCHAR(20) NULL DEFAULT NULL,
  
  `total_revenue` DECIMAL(14,2) NULL DEFAULT 0.00,
  `total_orders` INT NULL DEFAULT 0,
  `delivered_orders` INT NULL DEFAULT 0,
  `cancelled_orders` INT NULL DEFAULT 0,
  `total_retailers` INT NULL DEFAULT 0,
  `active_retailers` INT NULL DEFAULT 0,
  `new_retailers` INT NULL DEFAULT 0,
  `avg_order_value` DECIMAL(12,2) NULL DEFAULT 0.00,
  
  `computed_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_cm_period` (`country_manager_id`, `period_type`, `period_label`)
);

-- Create targets tracking table
CREATE TABLE IF NOT EXISTS `cm_targets` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `country_manager_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `country_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `target_type` ENUM('Daily','Weekly','Monthly','Quarterly','Yearly') NULL DEFAULT NULL,
  `target_period` VARCHAR(20) NULL DEFAULT NULL,
  
  -- Revenue Target
  `revenue_target` DECIMAL(14,2) NULL DEFAULT 0.00,
  `revenue_achieved` DECIMAL(14,2) NULL DEFAULT 0.00,
  `revenue_pct` DECIMAL(5,2) NULL DEFAULT 0.00,
  
  -- Order Count Target
  `order_count_target` INT NULL DEFAULT 0,
  `order_count_achieved` INT NULL DEFAULT 0,
  
  -- Retailer Acquisition Target
  `retailer_target` INT NULL DEFAULT 0,
  `retailer_achieved` INT NULL DEFAULT 0,
  
  -- Market Expansion Target
  `new_cities_target` INT NULL DEFAULT 0,
  `new_cities_achieved` INT NULL DEFAULT 0,
  
  `status` ENUM('Active','Completed','Missed') NULL DEFAULT 'Active',
  `set_by` BIGINT UNSIGNED NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_cm_target` (`country_manager_id`, `target_type`, `target_period`)
);

-- Create commission incentive tracking table
CREATE TABLE IF NOT EXISTS `cm_commissions` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `country_manager_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `country_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  
  `commission_type` VARCHAR(100) NULL DEFAULT 'Country Manager Incentive',
  `basis` VARCHAR(100) NULL DEFAULT 'Country Revenue',
  
  `period_type` ENUM('Monthly','Quarterly','Yearly') NULL DEFAULT NULL,
  `period_label` VARCHAR(20) NULL DEFAULT NULL,
  
  `base_revenue` DECIMAL(14,2) NULL DEFAULT NULL,
  `commission_percentage` DECIMAL(5,2) NULL DEFAULT NULL,
  `commission_amount` DECIMAL(12,2) NULL DEFAULT NULL,
  `bonus_amount` DECIMAL(12,2) NULL DEFAULT 0.00,
  `total_payable` DECIMAL(12,2) NULL DEFAULT NULL,
  
  `status` ENUM('Pending','Approved','Paid','Cancelled') NULL DEFAULT 'Pending',
  `approved_by` BIGINT UNSIGNED NULL DEFAULT NULL,
  `paid_at` TIMESTAMP NULL DEFAULT NULL,
  `payment_reference` VARCHAR(100) NULL DEFAULT NULL,
  `remarks` TEXT NULL DEFAULT NULL,
  
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create approvals queue table
CREATE TABLE IF NOT EXISTS `cm_approval_queue` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `country_manager_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `country_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  
  `approval_type` ENUM('Retailer_Registration','Large_Order','Discount','Commission','Team_Request','Purchase_Request') NULL DEFAULT NULL,
  `reference_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `reference_type` VARCHAR(50) NULL DEFAULT NULL,
  `reference_label` VARCHAR(255) NULL DEFAULT NULL,
  
  `submitted_by` BIGINT UNSIGNED NULL DEFAULT NULL,
  `submitted_by_role` VARCHAR(100) NULL DEFAULT NULL,
  `submitted_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  
  `priority` ENUM('Low','Normal','High','Urgent') NULL DEFAULT 'Normal',
  `action` ENUM('Pending','Approved','Rejected') NULL DEFAULT 'Pending',
  `actioned_by` BIGINT UNSIGNED NULL DEFAULT NULL,
  `actioned_at` TIMESTAMP NULL DEFAULT NULL,
  `remarks` TEXT NULL DEFAULT NULL,
  
  INDEX `idx_cm_queue` (`country_manager_id`, `action`)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS `cm_notifications` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `country_manager_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `type` ENUM('Approval_Request','Order_Update','Target_Reminder','Commission_Alert','State_Performance_Alert','System') NULL DEFAULT NULL,
  `title` VARCHAR(255) NULL DEFAULT NULL,
  `message` TEXT NULL DEFAULT NULL,
  `reference_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `reference_type` VARCHAR(50) NULL DEFAULT NULL,
  `is_read` TINYINT(1) NULL DEFAULT 0,
  `priority` ENUM('Low','Normal','High') NULL DEFAULT 'Normal',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create audit reports log
CREATE TABLE IF NOT EXISTS `cm_reports_log` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `country_manager_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `report_type` VARCHAR(100) NULL DEFAULT NULL,
  `filters_applied` JSON NULL DEFAULT NULL,
  `generated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `file_url` VARCHAR(500) NULL DEFAULT NULL,
  `generated_by` BIGINT UNSIGNED NULL DEFAULT NULL
);

-- Create performance review log table for State Managers
CREATE TABLE IF NOT EXISTS `cm_state_manager_reviews` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `state_manager_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `review_period` VARCHAR(50) NULL DEFAULT NULL,
  `performance_rating` INT NULL DEFAULT NULL,
  `remarks` TEXT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
);
