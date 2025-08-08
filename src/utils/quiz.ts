// Quiz System Types and Interfaces

export enum QuestionType {
  SINGLE_CHOICE = "single_choice",
  MULTIPLE_CHOICE = "multiple_choice",
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  type: string;
  question: string;
  options?: QuizOption[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, string | string[]>;
  isComplete: boolean;
  score: number;
  totalQuestions: number;
  startTime: Date;
  endTime?: Date;
}

export const mockPythonVariablesQuiz: Quiz = {
  id: "python-variables-quiz-1",
  title: "Python Variables Mastery Quiz", //name in the database
  //description in the database
  description:
    "Test your understanding of Python variables, data types, and naming conventions.",
  passingScore: 70, //passing_score in the database
  timeLimit: 15, //time_limit in the database
  questions: [
    {
      id: "q1",
      type: "single_choice",
      question: "What is a variable in Python?",
      options: [
        {
          id: "q1_a",
          text: "A container for storing data values",
          isCorrect: true,
        },
        {
          id: "q1_b",
          text: "A function that performs calculations",
          isCorrect: false,
        },
        { id: "q1_c", text: "A type of loop structure", isCorrect: false },
        { id: "q1_d", text: "A built-in Python module", isCorrect: false },
      ],
    },
    {
      id: "q2",
      type: "multiple_choice",
      question: "Which of the following are valid Python data types?",

      options: [
        { id: "q2_a", text: "str (String)", isCorrect: true },
        { id: "q2_b", text: "int (Integer)", isCorrect: true },
        { id: "q2_c", text: "float (Float)", isCorrect: true },
        { id: "q2_d", text: "bool (Boolean)", isCorrect: true },
        { id: "q2_e", text: "char (Character)", isCorrect: false },
      ],
    },
    {
      id: "q3",
      type: "single_choice",
      question: "How do you create a variable in Python?",

      options: [
        { id: "q3_a", text: "var name = value", isCorrect: false },
        { id: "q3_b", text: "name = value", isCorrect: true },
        { id: "q3_c", text: "let name = value", isCorrect: false },
        { id: "q3_d", text: "const name = value", isCorrect: false },
      ],
    },
    {
      id: "q4",
      type: "single_choice",
      question: "What function can you use to check the type of a variable?",
      options: [
        { id: "q4_a", text: "typeof()", isCorrect: false },
        { id: "q4_b", text: "type()", isCorrect: true },
        { id: "q4_c", text: "getType()", isCorrect: false },
        { id: "q4_d", text: "checkType()", isCorrect: false },
      ],
    },
    {
      id: "q5",
      type: "multiple_choice",
      question: "Which of the following are valid variable names in Python?",
      options: [
        { id: "q5_a", text: "user_name", isCorrect: true },
        { id: "q5_b", text: "age", isCorrect: true },
        { id: "q5_c", text: "2name", isCorrect: false },
        { id: "q5_d", text: "my_variable", isCorrect: true },
        { id: "q5_e", text: "class", isCorrect: false },
      ],
    },
    {
      id: "q6",
      type: "single_choice",
      question: 'What will be the output of: print(type("Python"))?',
      options: [
        { id: "q6_a", text: "<class 'str'>", isCorrect: true },
        { id: "q6_b", text: "<class 'string'>", isCorrect: false },
        { id: "q6_c", text: "string", isCorrect: false },
        { id: "q6_d", text: "text", isCorrect: false },
      ],
    },
    {
      id: "q7",
      type: "multiple_choice",
      question:
        "Which of the following statements about Python variables are true?",
      options: [
        { id: "q7_a", text: "Variables are case-sensitive", isCorrect: true },
        {
          id: "q7_b",
          text: "You must declare the type when creating a variable",
          isCorrect: false,
        },
        {
          id: "q7_c",
          text: "Variables can be reassigned to different types",
          isCorrect: true,
        },
        {
          id: "q7_d",
          text: "Variable names can contain spaces",
          isCorrect: false,
        },
        { id: "q7_e", text: "Python is dynamically typed", isCorrect: true },
      ],
    },
    {
      id: "q8",
      type: "single_choice",
      question:
        "What is the correct way to assign multiple variables in one line?",
      options: [
        { id: "q8_a", text: "x = 1, y = 2, z = 3", isCorrect: false },
        { id: "q8_b", text: "x, y, z = 1, 2, 3", isCorrect: true },
        { id: "q8_c", text: "x; y; z = 1; 2; 3", isCorrect: false },
        { id: "q8_d", text: "x & y & z = 1 & 2 & 3", isCorrect: false },
      ],
    },
  ],
};

// Quiz Utility Functions
export function calculateScore(
  quiz: Quiz,
  answers: Record<string, string | string[]>,
): number {
  let correctAnswers = 0;
  const totalQuestions = quiz.questions.length;

  quiz.questions.forEach((question) => {
    if (answers[question.id]) {
      const isCorrect = validateAnswer(question, answers[question.id]);
      if (isCorrect) {
        correctAnswers++;
      }
    }
  });

  return Math.round((correctAnswers / totalQuestions) * 100);
}

export function validateAnswer(
  question: QuizQuestion,
  userAnswer: string | string[],
): boolean {
  switch (question.type) {
    case "single_choice":
      const selectedOption = question.options?.find(
        (opt) => opt.id === userAnswer,
      );
      return selectedOption?.isCorrect || false;

    case "multiple_choice":
      if (!Array.isArray(userAnswer) || !question.options) return false;

      const selectedOptions = question.options.filter((opt) =>
        userAnswer.includes(opt.id),
      );
      const correctOptions = question.options.filter((opt) => opt.isCorrect);

      // All selected must be correct AND all correct must be selected
      return (
        selectedOptions.every((opt) => opt.isCorrect) &&
        correctOptions.every((opt) => userAnswer.includes(opt.id))
      );

    default:
      return false;
  }
}

export function getQuizProgress(
  currentIndex: number,
  totalQuestions: number,
): number {
  // Calculate progress based on completed questions
  // First question (index 0) should show 0% progress
  // Last question (index totalQuestions-1) should show progress but not 100%
  // 100% should only be shown when quiz is actually finished
  const completedQuestions = currentIndex;
  const maxProgress = totalQuestions - 1; // Don't reach 100% until finished
  return Math.round((completedQuestions / maxProgress) * 100);
}

// Fetch quiz from database by course slug and order index
export async function fetchQuizBySlugAndOrder(
  courseSlug: string,
  orderIndex: number,
): Promise<Quiz | null> {
  try {
    const { createClient } = await import("@/utils/supabase/client");
    const supabase = createClient();

    // First get the course ID from the slug
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", courseSlug)
      .single();

    if (courseError || !courseData) {
      console.error("Error fetching course:", courseError);
      return null;
    }

    // Then get the quiz by course_id and order_index
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("course_id", courseData.id)
      .eq("order_index", orderIndex)
      .single();

    if (error) {
      console.error("Error fetching quiz:", error);
      return null;
    }

    if (!data) {
      console.error("No quiz data found");
      return null;
    }

    // Transform the database data to match our Quiz interface
    const quiz: Quiz = {
      id: data.id,
      title: data.name,
      description: `Quiz for ${data.name}`, // You might want to add a description field to your database
      questions: data.questions, // This should already be in the correct format
      timeLimit: 15, // Default time limit - you might want to add this to your database
      passingScore: 70, // Default passing score - you might want to add this to your database
    };

    return quiz;
  } catch (error) {
    console.error("Unexpected error in fetchQuizBySlugAndOrder:", error);
    return null;
  }
}
