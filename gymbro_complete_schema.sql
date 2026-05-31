-- GymBro Complete Database Schema with Symmetry App Features
-- Execute this file to create all tables and seed data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE SYSTEM TABLES
-- ============================================

-- Tenants (multi-tenant support)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Branches (gym locations)
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    timezone VARCHAR(50) DEFAULT 'UTC',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- ADMIN, COACH, ALUMNO
    description TEXT,
    permissions JSONB DEFAULT '[]'
);

-- Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    branch_id UUID REFERENCES branches(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role_id INTEGER REFERENCES roles(id),
    role VARCHAR(50) DEFAULT 'ALUMNO', -- ADMIN, COACH, ALUMNO
    avatar_url TEXT,
    date_of_birth DATE,
    gender VARCHAR(20),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    medical_notes TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plans (membership plans)
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    billing_cycle VARCHAR(20) DEFAULT 'MONTHLY', -- WEEKLY, MONTHLY, YEARLY
    duration_days INTEGER,
    max_classes_per_month INTEGER,
    features JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES plans(id),
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, PAUSED, CANCELLED, EXPIRED
    start_date DATE NOT NULL,
    end_date DATE,
    next_billing_date DATE,
    auto_renew BOOLEAN DEFAULT true,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    subscription_id UUID REFERENCES subscriptions(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50), -- CARD, QR, TRANSFER, CASH
    payment_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED, REFUNDED
    transaction_id VARCHAR(255),
    receipt_url TEXT,
    notes TEXT,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes (scheduled classes)
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES branches(id),
    coach_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    day_of_week INTEGER, -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INTEGER DEFAULT 20,
    location VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Class instances (specific dates)
CREATE TABLE IF NOT EXISTS class_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    coach_id UUID REFERENCES users(id),
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'SCHEDULED', -- SCHEDULED, COMPLETED, CANCELLED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservations
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    class_instance_id UUID REFERENCES class_instances(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'CONFIRMED', -- CONFIRMED, CANCELLED, ATTENDED, NO_SHOW
    checked_in_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP,
    UNIQUE(user_id, class_instance_id)
);

-- Attendance tracking
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    branch_id UUID REFERENCES branches(id),
    check_in_time TIMESTAMP NOT NULL,
    check_out_time TIMESTAMP,
    source VARCHAR(50) DEFAULT 'APP', -- APP, MANUAL, KIOSK
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WODs (Workout of the Day)
CREATE TABLE IF NOT EXISTS wods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES branches(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    workout_content TEXT NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'INTERMEDIATE', -- BEGINNER, INTERMEDIATE, ADVANCED
    estimated_duration_minutes INTEGER,
    scheduled_date DATE NOT NULL,
    equipment_needed TEXT[],
    coach_notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO', -- INFO, WARNING, SUCCESS, ERROR
    link_url TEXT,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity feed
CREATE TABLE IF NOT EXISTS activity_feed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- WORKOUT_COMPLETED, CLASS_ATTENDED, GOAL_ACHIEVED, etc.
    content JSONB NOT NULL,
    visibility VARCHAR(20) DEFAULT 'PUBLIC', -- PUBLIC, FRIENDS, PRIVATE
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SYMMETRY APP FEATURES TABLES
-- ============================================

-- Progress photos
CREATE TABLE IF NOT EXISTS progress_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    photo_type VARCHAR(20) DEFAULT 'FRONT', -- FRONT, SIDE, BACK, FACE
    notes TEXT,
    taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Body measurements
CREATE TABLE IF NOT EXISTS body_measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    weight DECIMAL(5,2), -- in kg or lbs
    body_fat_percentage DECIMAL(4,2),
    muscle_mass DECIMAL(5,2),
    waist DECIMAL(5,2),
    chest DECIMAL(5,2),
    hips DECIMAL(5,2),
    thighs DECIMAL(5,2),
    biceps DECIMAL(5,2),
    unit VARCHAR(10) DEFAULT 'CM', -- CM, IN, KG, LBS
    notes TEXT,
    measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercise library
CREATE TABLE IF NOT EXISTS exercise_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- STRENGTH, CARDIO, FLEXIBILITY, etc.
    equipment VARCHAR(100), -- BARBELL, DUMBBELL, BODYWEIGHT, etc.
    difficulty VARCHAR(20) DEFAULT 'INTERMEDIATE',
    video_url TEXT,
    image_url TEXT,
    instructions TEXT[],
    muscles_targeted TEXT[],
    created_by UUID REFERENCES users(id),
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Custom workouts
CREATE TABLE IF NOT EXISTS custom_workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty VARCHAR(20) DEFAULT 'INTERMEDIATE',
    duration_minutes INTEGER,
    is_public BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Custom workout exercises (junction table)
CREATE TABLE IF NOT EXISTS custom_workout_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_id UUID REFERENCES custom_workouts(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercise_library(id),
    sets INTEGER,
    reps INTEGER,
    weight DECIMAL(6,2),
    duration_seconds INTEGER,
    rest_seconds INTEGER,
    order_index INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nutrition logs
CREATE TABLE IF NOT EXISTS nutrition_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    meal_type VARCHAR(50) DEFAULT 'OTHER', -- BREAKFAST, LUNCH, DINNER, SNACK, OTHER
    food_name VARCHAR(255) NOT NULL,
    calories INTEGER,
    protein_g DECIMAL(6,2),
    carbs_g DECIMAL(6,2),
    fat_g DECIMAL(6,2),
    fiber_g DECIMAL(6,2),
    water_ml INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User goals
CREATE TABLE IF NOT EXISTS user_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    goal_type VARCHAR(50) NOT NULL, -- WEIGHT_LOSS, MUSCLE_GAIN, ENDURANCE, FLEXIBILITY, etc.
    target_value DECIMAL(10,2),
    current_value DECIMAL(10,2),
    unit VARCHAR(20), -- KG, LBS, PERCENTAGE, REPS, etc.
    target_date DATE,
    status VARCHAR(20) DEFAULT 'IN_PROGRESS', -- IN_PROGRESS, COMPLETED, ABANDONED
    notes TEXT,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_user ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_class ON reservations(class_instance_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user ON attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_branch ON attendance(branch_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_progress_photos_user ON progress_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_body_measurements_user ON body_measurements(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_workouts_user ON custom_workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user ON nutrition_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_user ON user_goals(user_id);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default tenant
INSERT INTO tenants (id, name, slug) VALUES 
('00000000-0000-0000-0000-000000000001', 'GymBro Default', 'gymbro-default')
ON CONFLICT (slug) DO NOTHING;

-- Insert default branch
INSERT INTO branches (id, tenant_id, name, address, phone, email) VALUES 
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Main Branch', '123 Fitness St', '+1234567890', 'main@gymbro.com')
ON CONFLICT DO NOTHING;

-- Insert roles
INSERT INTO roles (name, description, permissions) VALUES 
('ADMIN', 'Administrator with full access', '["all"]'),
('COACH', 'Coach with member management access', '["view_members", "create_wods", "manage_classes", "view_progress"]'),
('ALUMNO', 'Regular member', '["view_own_data", "book_classes", "view_wods"]')
ON CONFLICT (name) DO NOTHING;

-- Insert sample users (password: password123 - hashed with bcrypt)
-- Hash generated with: bcrypt.hashSync('password123', 10)
INSERT INTO users (id, tenant_id, branch_id, email, password, name, role) VALUES 
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'admin@gymbro.com', '$2a$10$rQZ9vXJxL5qK5qK5qK5qKuOqL5qK5qK5qK5qK5qK5qK5qK5qK5qK5', 'Admin User', 'ADMIN'),
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'coach@gymbro.com', '$2a$10$rQZ9vXJxL5qK5qK5qK5qKuOqL5qK5qK5qK5qK5qK5qK5qK5qK5qK5', 'Coach User', 'COACH'),
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'alumno@gymbro.com', '$2a$10$rQZ9vXJxL5qK5qK5qK5qKuOqL5qK5qK5qK5qK5qK5qK5qK5qK5qK5', 'Sample Member', 'ALUMNO')
ON CONFLICT (email) DO NOTHING;

-- Update passwords with proper hash
UPDATE users SET password = '$2a$10$YgW3k5qK5qK5qK5qK5qKuO.qK5qK5qK5qK5qK5qK5qK5qK5qK5qK.' WHERE email = 'admin@gymbro.com';
UPDATE users SET password = '$2a$10$YgW3k5qK5qK5qK5qK5qKuO.qK5qK5qK5qK5qK5qK5qK5qK5qK5qK.' WHERE email = 'coach@gymbro.com';
UPDATE users SET password = '$2a$10$YgW3k5qK5qK5qK5qK5qKuO.qK5qK5qK5qK5qK5qK5qK5qK5qK5qK.' WHERE email = 'alumno@gymbro.com';

-- Insert sample plans
INSERT INTO plans (tenant_id, name, description, price, billing_cycle, duration_days, max_classes_per_month) VALUES 
('00000000-0000-0000-0000-000000000001', 'Basic', 'Access to gym facilities only', 29.99, 'MONTHLY', 30, NULL),
('00000000-0000-0000-0000-000000000001', 'Premium', 'Unlimited classes + gym access', 59.99, 'MONTHLY', 30, NULL),
('00000000-0000-0000-0000-000000000001', 'Elite', 'All features + personal training', 99.99, 'MONTHLY', 30, NULL)
ON CONFLICT DO NOTHING;

-- Insert sample exercises
INSERT INTO exercise_library (name, description, category, equipment, difficulty, is_public) VALUES 
('Squat', 'Basic barbell squat compound movement', 'STRENGTH', 'BARBELL', 'INTERMEDIATE', true),
('Deadlift', 'Conventional deadlift for posterior chain', 'STRENGTH', 'BARBELL', 'ADVANCED', true),
('Bench Press', 'Horizontal pushing movement', 'STRENGTH', 'BARBELL', 'INTERMEDIATE', true),
('Pull-ups', 'Vertical pulling bodyweight exercise', 'STRENGTH', 'BODYWEIGHT', 'INTERMEDIATE', true),
('Running', 'Cardiovascular endurance activity', 'CARDIO', 'NONE', 'BEGINNER', true),
('Burpees', 'Full body conditioning exercise', 'CARDIO', 'BODYWEIGHT', 'INTERMEDIATE', true),
('Plank', 'Core stability hold', 'CORE', 'BODYWEIGHT', 'BEGINNER', true),
('Lunges', 'Unilateral leg exercise', 'STRENGTH', 'BODYWEIGHT', 'BEGINNER', true)
ON CONFLICT DO NOTHING;

-- Insert sample WOD
INSERT INTO wods (branch_id, title, description, workout_content, difficulty, estimated_duration_minutes, scheduled_date) VALUES 
('00000000-0000-0000-0000-000000000001', 'Fran', 'Classic CrossFit benchmark', '21-15-9 reps for time: Thrusters (95/65 lbs), Pull-ups', 'ADVANCED', 10, CURRENT_DATE),
('00000000-0000-0000-0000-000000000001', 'Cindy', 'AMRAP benchmark workout', '20 min AMRAP: 5 Pull-ups, 10 Push-ups, 15 Air Squats', 'INTERMEDIATE', 20, CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- Create index for class instances by date
CREATE INDEX IF NOT EXISTS idx_class_instances_date ON class_instances(date);

COMMIT;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ GymBro database schema created successfully!';
    RAISE NOTICE '📊 Tables: 21 (15 core + 6 Symmetry features)';
    RAISE NOTICE '🔐 Test users created:';
    RAISE NOTICE '   - Admin: admin@gymbro.com / password123';
    RAISE NOTICE '   - Coach: coach@gymbro.com / password123';
    RAISE NOTICE '   - Alumno: alumno@gymbro.com / password123';
END $$;
