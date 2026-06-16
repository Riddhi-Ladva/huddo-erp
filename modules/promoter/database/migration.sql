-- PROMO-MODULE: Database Migration for Promoter Module
-- This script runs additive-only migrations to support the Promoter module.
-- All columns are nullable with DEFAULT NULL.

CREATE TABLE IF NOT EXISTS `promoters` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NULL DEFAULT NULL UNIQUE,
  `promoter_code` VARCHAR(50) NULL DEFAULT NULL UNIQUE,
  `full_name` VARCHAR(255) NOT NULL,
  `mobile_number` VARCHAR(15) NOT NULL UNIQUE,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `address` TEXT NULL DEFAULT NULL,
  `profile_photo_url` VARCHAR(500) NULL DEFAULT NULL,
  `aadhaar_number` VARCHAR(16) NULL DEFAULT NULL,
  `pan_number` VARCHAR(12) NULL DEFAULT NULL,
  `gst_number` VARCHAR(20) NULL DEFAULT NULL,
  `bank_account_number` VARCHAR(50) NULL DEFAULT NULL,
  `bank_ifsc` VARCHAR(20) NULL DEFAULT NULL,
  `bank_name` VARCHAR(100) NULL DEFAULT NULL,
  `bank_account_holder` VARCHAR(255) NULL DEFAULT NULL,
  `allocated_country_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `allocated_state_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `allocated_city_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `allocated_country_name` VARCHAR(100) NULL DEFAULT NULL,
  `allocated_state_name` VARCHAR(100) NULL DEFAULT NULL,
  `allocated_city_name` VARCHAR(100) NULL DEFAULT NULL,
  `royalty_percentage` DECIMAL(5,2) NULL DEFAULT 5.00,
  `payment_status` ENUM('Paid','Unpaid','Partial') NULL DEFAULT 'Unpaid',
  `status` ENUM('Active','Inactive','Suspended','Pending_Verification') NULL DEFAULT 'Active',
  `verification_status` ENUM('Pending','Verified','Rejected') NULL DEFAULT 'Pending',
  `created_by` BIGINT UNSIGNED NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS `promoter_retailer_mappings` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `promoter_id` BIGINT UNSIGNED NOT NULL,
  `retailer_id` BIGINT UNSIGNED NOT NULL,
  `retailer_name` VARCHAR(255) NOT NULL,
  `retailer_city` VARCHAR(100) NULL DEFAULT NULL,
  `retailer_state` VARCHAR(100) NULL DEFAULT NULL,
  `mapped_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `mapped_by` BIGINT UNSIGNED NULL DEFAULT NULL,
  `is_active` TINYINT(1) NULL DEFAULT 1,
  `unmapped_at` TIMESTAMP NULL DEFAULT NULL,
  `unmapped_reason` TEXT NULL DEFAULT NULL,
  UNIQUE KEY `uq_promo_retailer` (`promoter_id`, `retailer_id`)
);

CREATE TABLE IF NOT EXISTS `promoter_royalty_config` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `promoter_id` BIGINT UNSIGNED NOT NULL,
  `config_type` ENUM('Product','Retailer','Global') NOT NULL,
  `product_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `product_name` VARCHAR(255) NULL DEFAULT NULL,
  `retailer_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `retailer_name` VARCHAR(255) NULL DEFAULT NULL,
  `royalty_percentage` DECIMAL(5,2) NOT NULL DEFAULT 5.00,
  `is_active` TINYINT(1) NULL DEFAULT 1,
  `effective_from` DATE NULL DEFAULT NULL,
  `effective_to` DATE NULL DEFAULT NULL,
  `created_by` BIGINT UNSIGNED NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `promoter_royalty_earnings` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `promoter_id` BIGINT UNSIGNED NOT NULL,
  `retailer_id` BIGINT UNSIGNED NOT NULL,
  `order_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `invoice_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `product_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `product_name` VARCHAR(255) NULL DEFAULT NULL,
  `royalty_config_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `billing_amount` DECIMAL(12,2) NOT NULL,
  `royalty_percentage` DECIMAL(5,2) NOT NULL,
  `royalty_amount` DECIMAL(12,2) NOT NULL,
  `period_month` TINYINT NULL DEFAULT NULL,
  `period_year` SMALLINT NULL DEFAULT NULL,
  `status` ENUM('Pending','Approved','Paid','Cancelled') NULL DEFAULT 'Pending',
  `approved_by` BIGINT UNSIGNED NULL DEFAULT NULL,
  `paid_at` TIMESTAMP NULL DEFAULT NULL,
  `payment_reference` VARCHAR(100) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_promo_royalty` (`promoter_id`, `period_year`, `period_month`)
);

CREATE TABLE IF NOT EXISTS `promoter_royalty_settlements` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `promoter_id` BIGINT UNSIGNED NOT NULL,
  `settlement_period` VARCHAR(20) NOT NULL,
  `period_month` TINYINT NOT NULL,
  `period_year` SMALLINT NOT NULL,
  `total_billings` DECIMAL(14,2) NULL DEFAULT 0.00,
  `total_royalty_earned` DECIMAL(12,2) NULL DEFAULT 0.00,
  `total_royalty_paid` DECIMAL(12,2) NULL DEFAULT 0.00,
  `outstanding_royalty` DECIMAL(12,2) NULL DEFAULT 0.00,
  `settlement_status` ENUM('Pending','Partial','Settled','Cancelled') NULL DEFAULT 'Pending',
  `settled_at` TIMESTAMP NULL DEFAULT NULL,
  `settled_by` BIGINT UNSIGNED NULL DEFAULT NULL,
  `payment_reference` VARCHAR(100) NULL DEFAULT NULL,
  `payment_mode` ENUM('NEFT','RTGS','UPI','Cheque','Cash') NULL DEFAULT NULL,
  `remarks` TEXT NULL DEFAULT NULL,
  `generated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_promo_settlement` (`promoter_id`, `settlement_period`)
);

CREATE TABLE IF NOT EXISTS `promoter_revenue_tracking` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `promoter_id` BIGINT UNSIGNED NOT NULL,
  `retailer_id` BIGINT UNSIGNED NOT NULL,
  `retailer_name` VARCHAR(255) NOT NULL,
  `retailer_city` VARCHAR(100) NULL DEFAULT NULL,
  `invoice_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `invoice_number` VARCHAR(100) NULL DEFAULT NULL,
  `invoice_date` DATE NULL DEFAULT NULL,
  `invoice_amount` DECIMAL(12,2) NOT NULL,
  `gst_amount` DECIMAL(12,2) NULL DEFAULT 0.00,
  `total_amount` DECIMAL(12,2) NOT NULL,
  `payment_status` ENUM('Unpaid','Paid','Partial','Overdue') NULL DEFAULT 'Unpaid',
  `period_month` TINYINT NULL DEFAULT NULL,
  `period_year` SMALLINT NULL DEFAULT NULL,
  `synced_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_promo_revenue` (`promoter_id`, `period_year`, `period_month`)
);

CREATE TABLE IF NOT EXISTS `promoter_performance_snapshots` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `promoter_id` BIGINT UNSIGNED NOT NULL,
  `period_label` VARCHAR(20) NOT NULL,
  `period_month` TINYINT NOT NULL,
  `period_year` SMALLINT NOT NULL,
  `total_retailers_added` INT NULL DEFAULT 0,
  `total_active_retailers` INT NULL DEFAULT 0,
  `total_revenue_generated` DECIMAL(14,2) NULL DEFAULT 0.00,
  `total_royalty_earned` DECIMAL(12,2) NULL DEFAULT 0.00,
  `total_royalty_paid` DECIMAL(12,2) NULL DEFAULT 0.00,
  `pending_royalty` DECIMAL(12,2) NULL DEFAULT 0.00,
  `computed_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_promo_perf` (`promoter_id`, `period_label`)
);

CREATE TABLE IF NOT EXISTS `promoter_notifications` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `promoter_id` BIGINT UNSIGNED NOT NULL,
  `type` ENUM('Royalty_Calculated','Royalty_Paid','Retailer_Mapped','Settlement_Generated','System') NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `reference_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `reference_type` VARCHAR(50) NULL DEFAULT NULL,
  `is_read` TINYINT(1) NULL DEFAULT 0,
  `priority` ENUM('Low','Normal','High') NULL DEFAULT 'Normal',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `promoter_documents` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `promoter_id` BIGINT UNSIGNED NOT NULL,
  `document_type` VARCHAR(100) NOT NULL,
  `document_url` VARCHAR(500) NOT NULL,
  `uploaded_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `uploaded_by` BIGINT UNSIGNED NULL DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS `promoter_reports_log` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `promoter_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `report_type` VARCHAR(100) NOT NULL,
  `filters_applied` JSON NULL DEFAULT NULL,
  `generated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `file_url` VARCHAR(500) NULL DEFAULT NULL,
  `generated_by` BIGINT UNSIGNED NULL DEFAULT NULL
);
