/*
  # Classroom Engagement System Schema

  1. New Tables
    - `students`
      - `id` (uuid, primary key)
      - `student_id` (text, unique)
      - `name` (text)
      - `class_section` (text)
      - `created_at` (timestamp)
    
    - `engagement_points`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key)
      - `points` (integer)
      - `comment` (text)
      - `date` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to:
      - Read all student data
      - Only modify their own data
      - Read all engagement points
      - Only add their own engagement points
*/

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  student_id text UNIQUE NOT NULL,
  name text NOT NULL,
  class_section text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create engagement points table
CREATE TABLE IF NOT EXISTS engagement_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) NOT NULL,
  points integer NOT NULL,
  comment text NOT NULL,
  date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_points ENABLE ROW LEVEL SECURITY;

-- Policies for students table
CREATE POLICY "Students can read all student data"
  ON students
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Students can update their own data"
  ON students
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policies for engagement points
CREATE POLICY "Students can read all engagement points"
  ON engagement_points
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Students can add their own engagement points"
  ON engagement_points
  FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());