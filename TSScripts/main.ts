enum StudentStatus {
    Active = "Active",
    AcademicLeave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled",
}

enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special",
}

enum Semester {
    First = "First",
    Second = "Second",
}

enum Grade {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2,
}

enum Faculty {
    ComputerScience = "Computer_Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering",
}

interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semestr: Semester;
    faculty: Faculty;
    maxStudents: number;
}

interface IGrade {
    studentId: number;
    courseId: number;
    grade: Grade;
    date: Date;
    semestr: Semester;
}

class UniversityManagementSystem {
    private students: Student[] = [];
    private courses: Course[] = [];
    private grades: IGrade[] = [];
    private currentId: number = 1;

    enrollStudent(student: Omit<Student, "id">): Student {
        const newStudent = { ...student, id: this.currentId++ };
        this.students.push(newStudent);
        return newStudent;
    }

    registerForCourse(studentId: number, courseId: number): void {
        const student = this.students.find((s) => s.id === studentId);
        const course = this.courses.find((c) => c.id === courseId);

        if (!student) {
            throw new Error("Студента не було знайдено");
        }

        if (!course) {
            throw new Error("Курс не було знайдено");
        }

        if (course.faculty !== student.faculty) {
            throw new Error("Обраний курс не відповідає факультету студента");
        }

        const studentsOnCourse = this.grades.filter(
            (g) => g.courseId === courseId
        ).length;

        if (studentsOnCourse >= course.maxStudents) {
            throw new Error("На курсі немає вільних місць");
        }
    }

    setGrade(studentId: number, courseId: number, grade: Grade): void {
        const student = this.students.find((s) => s.id === studentId);
        const course = this.courses.find((c) => c.id === courseId);

        if (!student) {
            throw new Error("Студента не було знайдено");
        }

        if (!course) {
            throw new Error("Курс не було знайдено");
        }

        const isRegistered = this.grades.some(
            (g) => g.studentId === studentId && g.courseId === courseId
        );
        if (!isRegistered) {
            throw new Error("Студент не зареєстрований на курсі");
        }

        this.grades.push({
            studentId,
            courseId,
            grade,
            date: new Date(),
            semestr: course.semestr,
        });
    }

    updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
        const student = this.students.find((s) => s.id === studentId);
        if (!student) {
            throw new Error("Студента не було знайдено");
        }

        if (
            student.status === StudentStatus.Graduated &&
            newStatus !== StudentStatus.Graduated
        ) {
            throw new Error("Статус випускника неможливо змінити");
        }

        student.status = newStatus;
    }

    getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter((s) => s.faculty === faculty);
    }

    getStudentGrades(studentId: number): Grade[] {
        const student = this.students.find((s) => s.id === studentId);
        if (!student) {
            throw new Error("Студента не було знайдено");
        }
        return this.grades
            .filter((g) => g.studentId === student.id)
            .map((g) => g.grade);
    }

    getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
        return this.courses.filter(
            (c) => c.faculty === faculty && c.semestr === semester
        );
    }

    calculateAverageGrade(studentId: number): number {
        const student = this.students.find((s) => s.id === studentId);
        if (!student) {
            throw new Error("Студента не було знайдено");
        }
        const studentGrades = this.getStudentGrades(studentId);
        if (studentGrades.length === 0) {
            throw new Error("Студент не має оцінок");
        }

        const total = studentGrades.reduce((sum, grade) => sum + grade, 0);
        return total / studentGrades.length;
    }

    getHonorStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter((student) => {
            const avgGrade = this.calculateAverageGrade(student.id);
            return avgGrade >= Grade.Excellent && student.faculty === faculty;
        });
    }
}