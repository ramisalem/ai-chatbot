****# Database Schema Documentation

This document describes the PostgreSQL database structure for the real estate management system. This schema is designed for a Django-based application that manages properties, customers, units, and various related entities.

## Connection Details
- **Database**: PostgreSQL
- **Host**: 159.69.110.71:5433
- **Database Name**: postgres
- **Connection String**: `postgres://postgres:e0KxH9yGFSHh0kx55z4VWa2sgxXy6PBm0PkWJOuclW7fbjxZwIJa54puRnWlWwA3@159.69.110.71:5433/postgres`

## Core Entity Tables

### 1. Users and Authentication

#### `user_user` - Main User Table
- **Primary Key**: `id` (UUID)
- **Columns**:
  - `id`: UUID - Primary key
  - `username`: varchar(150) - Unique username
  - `email`: varchar(254) - Email address (optional)
  - `name`: varchar(255) - User's full name
  - `phone_number`: varchar(128) - Phone number (unique per role)
  - `password`: varchar(128) - Hashed password
  - `role`: varchar(100) - User role in system
  - `is_superuser`, `is_staff`, `is_active`: boolean - Permission flags
  - `is_deleted`: boolean - Soft deletion flag
  - `deleted_at`: timestamp - Deletion timestamp
  - `last_login`: timestamp - Last login time
  - `created_at`, `updated_at`: timestamp - Audit fields
  - `created_by_id`, `updated_by_id`: UUID - Audit user references
- **Unique Constraints**: 
  - `username` (unique)
  - `(phone_number, role)` (unique combination)

#### `user_profile` - User Profile Extension
- **Primary Key**: `id`
- **Foreign Keys**: `user_id` → `user_user.id` (one-to-one)

### 2. Customers

#### `customer_customer` - Customer Information
- **Primary Key**: `id` (UUID)
- **Columns**:
  - `id`: UUID - Primary key
  - `user_id`: UUID - Reference to user_user (unique)
  - `expected_budget`: double precision - Customer's budget expectation
  - `city_id`: UUID - Reference to city_city
  - `created_at`, `updated_at`: timestamp
  - `created_by_id`, `updated_by_id`: UUID - Audit fields
- **Foreign Keys**:
  - `user_id` → `user_user.id` (unique relationship)
  - `city_id` → `city_city.id`
  - `created_by_id`, `updated_by_id` → `user_user.id`

#### `customer_customer_interests` - Customer Interest Categories
- **Purpose**: Many-to-many relationship between customers and their interests
- **Columns**: `customer_id`, `interest_id`

### 3. Properties and Units

#### `unit_unit` - Property Units
- **Primary Key**: `id` (UUID)
- **Columns**:
  - `id`: UUID - Primary key
  - `name`, `name_en`, `name_ar`: varchar(255) - Unit names (multilingual)
  - `status`: varchar(100) - Unit status (available, sold, reserved, etc.)
  - `price`: double precision - Unit price
  - `meter_price`: double precision - Price per square meter
  - `floor`: varchar(100) - Floor location
  - `area`: double precision - Unit area in square meters
  - `rooms`: integer - Number of rooms
  - `toilets`: integer - Number of bathrooms/toilets
  - `has_private_sitting_room`: boolean - Has private living room
  - `has_basement_parking`: boolean - Has basement parking
  - `sort_order`: integer - Display order (≥ 0)
  - `note`: text - Additional notes
  - `project_id`: UUID - Project reference (no FK constraint in schema)
  - `created_at`, `updated_at`: timestamp
  - `created_by_id`, `updated_by_id`: UUID - Audit fields
- **Foreign Keys**:
  - `created_by_id`, `updated_by_id` → `user_user.id`
- **Indexes**: `status`, `sort_order`, `project_id`

#### `unit_unitimage` - Unit Images
- **Purpose**: Images associated with units
- **Foreign Keys**: `unit_id` → `unit_unit.id`

#### `unit_unit_tags` - Unit Tags
- **Purpose**: Many-to-many relationship between units and tags
- **Foreign Keys**: `unit_id` → `unit_unit.id`, `tag_id` → `tag_tag.id`

### 4. Location Management

#### `city_city` - Cities
- **Primary Key**: `id` (UUID)
- **Columns**:
  - `id`: UUID - Primary key
  - `name`, `name_en`, `name_ar`: varchar(255) - City names (multilingual)
  - `country`: varchar(2) - Country code
  - `is_active`: boolean - Active status
  - `enabled_at`: timestamp - When enabled
  - `sort_order`: integer - Display order (≥ 0)
  - `created_at`, `updated_at`: timestamp
  - `created_by_id`, `updated_by_id`: UUID - Audit fields

#### `neighborhood_neighborhood` - Neighborhoods
- **Foreign Keys**: `city_id` → `city_city.id`

#### `street_street` - Streets
- **Purpose**: Street information within neighborhoods

### 5. Teams and Members

#### `member_member` - Sales/Support Members
- **Primary Key**: `id` (UUID)
- **Foreign Keys**: 
  - `user_id` → `user_user.id`
  - Team relationships through many-to-many tables

#### `team_team` - Sales/Support Teams
- **Primary Key**: `id` (UUID)
- **Purpose**: Organize members into teams

#### `team_team_members` - Team Membership
- **Purpose**: Many-to-many relationship between teams and members

### 6. Customer Interactions

#### `engagement_engagement` - Customer Engagements
- **Primary Key**: `id` (UUID)
- **Columns**:
  - `id`: UUID - Primary key
  - `status`: varchar(100) - Engagement status
  - `visit_date`: timestamp - Scheduled/completed visit date
  - `note`: text - Engagement notes
  - `customer_id`: UUID - Customer reference
  - `member_id`: UUID - Assigned member
  - `project_id`: UUID - Project reference
  - `team_id`: UUID - Assigned team
  - `unit_id`: UUID - Specific unit (optional)
  - `created_at`, `updated_at`: timestamp
  - `created_by_id`, `updated_by_id`: UUID - Audit fields
- **Foreign Keys**:
  - `customer_id` → `customer_customer.id`
  - `member_id` → `member_member.id`
  - `team_id` → `team_team.id`
  - `unit_id` → `unit_unit.id` (nullable)
  - `created_by_id`, `updated_by_id` → `user_user.id`

### 7. Shopping and Commerce

#### `cart_cart` - Shopping Carts
- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `customer_id` → `customer_customer.id`

#### `cart_cart_units` - Cart Contents
- **Purpose**: Many-to-many relationship between carts and units
- **Foreign Keys**: 
  - `cart_id` → `cart_cart.id`
  - `unit_id` → `unit_unit.id`

#### `favorite_favorite` - User Favorites
- **Purpose**: Track user's favorite units/properties
- **Foreign Keys**: `user_id` → `user_user.id`

### 8. Project Features and Attributes

#### `facility_facility` - Available Facilities
- **Primary Key**: `id` (UUID)
- **Purpose**: Define facilities (gym, pool, parking, etc.)

#### `feature_feature` - Property Features
- **Primary Key**: `id` (UUID)
- **Purpose**: Define features (balcony, garden, etc.)

#### `service_service` - Services
- **Primary Key**: `id` (UUID)
- **Purpose**: Define services offered

#### `guarantee_guarantee` - Guarantees
- **Primary Key**: `id` (UUID)
- **Purpose**: Define warranty/guarantee types

#### Project Association Tables:
- `project_project_facilities` - Links projects to facilities
- `project_project_features` - Links projects to features
- `project_project_services` - Links projects to services
- `project_project_guarantees` - Links projects to guarantees
- `project_project_tags` - Links projects to tags
- `project_project_teams` - Links projects to teams
- `project_project_types` - Links projects to types

### 9. Content Management

#### `banner_banner` - Marketing Banners
- **Primary Key**: `id` (UUID)
- **Purpose**: Promotional banners with project associations

#### `banner_banner_projects` - Banner-Project Associations
- **Purpose**: Many-to-many between banners and projects

#### `faq_faq` - Frequently Asked Questions
- **Primary Key**: `id` (UUID)

#### `notification_notification` - User Notifications
- **Primary Key**: `id` (UUID)
- **Foreign Keys**: 
  - `recipient_id` → `user_user.id`
  - `created_by_id`, `updated_by_id` → `user_user.id`

### 10. System and Configuration

#### `configuration_appconfig` - Application Configuration
- **Purpose**: Store system-wide configuration settings

#### `task_task` - System Tasks
- **Primary Key**: `id` (UUID)
- **Purpose**: Task management system

#### `task_task_members` - Task Assignments
- **Purpose**: Many-to-many relationship between tasks and members

#### `history_history` - Audit History
- **Purpose**: Track changes and user activities
- **Foreign Keys**: `user_id` → `user_user.id`

## Key Relationships Summary

1. **User → Customer**: One-to-one relationship (`customer_customer.user_id`)
2. **Customer → City**: Many-to-one (`customer_customer.city_id`)
3. **Unit → Project**: Many-to-one (`unit_unit.project_id`) - Note: No FK constraint
4. **Engagement**: Central entity linking Customer, Member, Team, Project, and optionally Unit
5. **Cart**: Links customers to units they're interested in purchasing
6. **Project Associations**: Projects linked to facilities, features, services, guarantees, teams, and types through junction tables

## Query Patterns for AI

When querying this database:

1. **Find customer information**: Join `customer_customer` with `user_user` on `user_id`
2. **Get available units**: Filter `unit_unit` by `status` field
3. **Customer engagement tracking**: Use `engagement_engagement` as the central table
4. **Location-based queries**: Join through `city_city` → `customer_customer` → related entities
5. **Project details**: Units belong to projects via `project_id`, with features accessible through `project_project_*` junction tables
6. **Team assignments**: Track through `engagement_engagement` which connects customers to members and teams

## Important Notes

- All tables use UUID primary keys
- Most entities have audit fields (`created_at`, `updated_at`, `created_by_id`, `updated_by_id`)
- Many tables support soft deletion (`is_deleted`, `deleted_at`)
- Multilingual support with `_en` and `_ar` suffixes for English and Arabic
- The system appears to be a Django application based on naming conventions
- Some foreign key relationships exist in the application logic but not as database constraints